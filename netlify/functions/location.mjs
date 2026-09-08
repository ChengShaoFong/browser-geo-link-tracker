import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers });
}

function validToken(token) {
  return typeof token === 'string' && /^[a-f0-9]{32}$/.test(token);
}

function isExpired(location) {
  return location && Date.now() - Date.parse(location.receivedAt) > 86400000;
}

export default async function handler(request) {
  const store = getStore('locations');

  try {
    if (request.method === 'POST') {
      let data;
      try {
        data = await request.json();
      } catch {
        return json({ error: 'invalid_json' }, 400);
      }

      const latitude = Number(data.latitude);
      const longitude = Number(data.longitude);
      const accuracy = Number(data.accuracy);
      if (!validToken(data.token) || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
          !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
          !Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100000) {
        return json({ error: 'invalid_location' }, 400);
      }

      await store.setJSON(data.token, {
        latitude: Number(latitude.toFixed(6)),
        longitude: Number(longitude.toFixed(6)),
        accuracy: Math.round(accuracy),
        receivedAt: new Date().toISOString()
      });
      return json({ ok: true });
    }

    if (request.method === 'GET') {
      const token = new URL(request.url).searchParams.get('token');
      if (!validToken(token)) return json({ error: 'invalid_token' }, 400);

      const location = await store.get(token, {
        type: 'json',
        consistency: 'strong'
      });
      if (isExpired(location)) {
        await store.delete(token);
        return json(null);
      }
      return json(location || null);
    }

    return json({ error: 'method_not_allowed' }, 405);
  } catch (error) {
    console.error('Location function failed:', error);
    return json({ error: 'storage_request_failed', detail: error.message }, 500);
  }
}