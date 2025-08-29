// backend/routes/route.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const turf = require('@turf/turf');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const ORS_KEY = process.env.ORS_API_KEY;
const ORS_URL = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

// Default auto fare config (tweak later in DB)
const AUTO_CONFIG = { base: 25, per_km: 10, per_min: 0.5, min_fare: 30 };

async function callORS(coords) {
  const body = { coordinates: coords }; // [[lng,lat],[lng,lat],...]
  const r = await axios.post(ORS_URL, body, {
    headers: { Authorization: ORS_KEY, 'Content-Type': 'application/json' }
  });
  return r.data;
}

async function findNearestStation(point) {
  const { rows } = await pool.query('SELECT id,name,lat,lng,station_index FROM nmrc_stations');
  let best = null;
  for (const r of rows) {
    const dist = turf.distance(turf.point([r.lng, r.lat]), turf.point([point.lng, point.lat]), { units: 'kilometers' });
    if (!best || dist < best.dist) best = { ...r, dist };
  }
  return best;
}

async function calcMetroFare(aIdx, bIdx) {
  const diff = Math.abs(aIdx - bIdx);
  const avg_km = 1.5;
  const km = diff * avg_km;
  const { rows } = await pool.query('SELECT min_km,max_km,fare FROM metro_fare_bands ORDER BY min_km');
  for (const band of rows) if (km >= band.min_km && km <= band.max_km) return band.fare;
  return rows[rows.length-1]?.fare || 0;
}

router.post('/', async (req, res) => {
  try {
    const { sources, destinations } = req.body;
    if (!sources || !destinations || sources.length !== destinations.length) {
      return res.status(400).json({ error: 'sources and destinations required and must match in count' });
    }

    // Build coordinate list for ORS: [lng,lat] pairs
    const coords = [];
    for (let i = 0; i < sources.length; i++) {
      coords.push([sources[i].lng, sources[i].lat]);
      coords.push([destinations[i].lng, destinations[i].lat]);
    }

    const ors = await callORS(coords);
    const summary = ors.features[0]?.properties?.summary || {};
    const distance_m = summary.distance || 0;
    const duration_s = summary.duration || 0;
    const distance_km = +(distance_m / 1000).toFixed(3);
    const duration_min = +(duration_s / 60).toFixed(1);

    let fare_auto = AUTO_CONFIG.base + (AUTO_CONFIG.per_km * distance_km) + (AUTO_CONFIG.per_min * duration_min);
    if (fare_auto < AUTO_CONFIG.min_fare) fare_auto = AUTO_CONFIG.min_fare;
    fare_auto = Math.round(fare_auto);

    // Attempt metro fare using first source and last destination -> nearest station logic
    const first = sources[0], last = destinations[destinations.length - 1];
    const nearestStart = await findNearestStation(first);
    const nearestEnd = await findNearestStation(last);
    let fare_metro = null;
    if (nearestStart && nearestEnd && nearestStart.dist < 1.5 && nearestEnd.dist < 1.5) {
      fare_metro = await calcMetroFare(nearestStart.station_index, nearestEnd.station_index);
    }

    await pool.query(
      'INSERT INTO routes (user_id, waypoints, distance_km, duration_min, fare_auto, fare_metro) VALUES ($1,$2,$3,$4,$5,$6)',
      [null, JSON.stringify({ sources, destinations }), distance_km, duration_min, fare_auto, fare_metro]
    );

    return res.json({
      geojson: ors.features[0].geometry,
      distance_km,
      duration_min,
      fare_auto,
      fare_metro
    });
  } catch (err) {
    console.error(err?.response?.data || err);
    return res.status(500).json({ error: 'server error', details: err?.message || err });
  }
});

module.exports = router;
