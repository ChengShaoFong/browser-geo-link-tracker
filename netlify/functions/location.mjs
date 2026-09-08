import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};

function response(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

function validToken(token) {
  return typeof token === 'string' && /^[a-f0-9]{32}$/.test(token);
}

export async function handler(event) {
  const store = getStore('locations');

  if (event.httpMethod === 'POST') {
    let data;
    try {
      data = JSON.parse(event.body || '{}');
    } catch {
      return response(400, { error: 'invalid_json' });
    }

    const latitude = Number(data.latitude);
    const longitude = Number(data.longitude);
    const accuracy = Number(data.accuracy);
    if (!validToken(data.token) || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
        !Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100000) {
      return response(400, { error: 'invalid_location' });
    }

    await store.setJSON(data.token, {
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
      accuracy: Math.round(accuracy),
      receivedAt: new Date().toISOString()
    });
    return response(200, { ok: true });
  }

  if (event.httpMethod === 'GET') {
    const token = event.queryStringParameters?.token;
    if (!validToken(token)) return response(400, { error: 'invalid_token' });
    const location = await store.get(token, { type: 'json' });
    if (location && Date.now() - Date.parse(location.receivedAt) > 86400000) {
      await store.delete(token);
      return response(200, null);
    }
    return response(200, location || null);
  }

  return response(405, { error: 'method_not_allowed' });
}