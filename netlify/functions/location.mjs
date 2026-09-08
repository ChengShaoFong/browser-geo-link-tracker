import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
};

function response(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

function validToken(token) {
  return typeof token === 'string' && /^[a-f0-9]{32}$/.test(token);
}

export async function handler(event) {
  let store;
  try {
    store = getStore({
      name: 'locations',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN
    });
  } catch (error) {
    console.error('Netlify Blobs initialization failed:', error);
    return response(500, { error: 'storage_unavailable', detail: error.message });
  }

  try {
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

      await store.set(data.token, JSON.stringify({
        latitude: Number(latitude.toFixed(6)),
        longitude: Number(longitude.toFixed(6)),
        accuracy: Math.round(accuracy),
        receivedAt: new Date().toISOString()
      }));
      return response(200, { ok: true });
    }

    if (event.httpMethod === 'GET') {
      const token = event.queryStringParameters?.token;
      if (!validToken(token)) return response(400, { error: 'invalid_token' });
      const rawLocation = await store.get(token);
      const location = rawLocation ? JSON.parse(rawLocation) : null;
      if (location && Date.now() - Date.parse(location.receivedAt) > 86400000) {
        await store.delete(token);
        return response(200, null);
      }
      return response(200, location);
    }

    return response(405, { error: 'method_not_allowed' });
  } catch (error) {
    console.error('Location function failed:', error);
    return response(500, { error: 'storage_request_failed', detail: error.message });
  }
}