# SeaTrack Deploy Checklist

## 1. Secrets and environment
- Copy .env.production.example to .env on server.
- Fill all API keys and secrets locally on server only.
- Never commit .env files.
- Rotate MAERSK and CMA keys after any suspected exposure.
- Confirm AUTH_REQUIRED=true, AUTH_JWT_SECRET, and AUTH_TEMP_PASSWORD are set to non-default values in the server environment. Check the startup log: no `[mail-api] SECURITY WARNING` line should appear.

## 2. Endpoint validation
- Confirm MAERSK_OAUTH_TOKEN_URL and MAERSK_TRACKING_BASE_URL point to production.
- Confirm CMA_TRACKING_BASE_URL is set to https://apis.cma-cgm.net.
- Confirm TRACKING_SOURCE is set as expected.
- Confirm server can reach external HTTPS endpoints on port 443.

## 3. Service startup
- Start backend: npm run server (inside SeaTrack-v3).
- Start frontend: npm run dev:local (dev) or serve build (prod).
- Verify health endpoint: GET /api/tracking/health.

## 4. Critical tracking smoke test
- Run: npm run test:tracking
- Expected:
  - update.source = maersk
  - trackingSyncError = null
  - trackingKey is not empty

## 5. Rollback plan
- Keep previous .env backup and previous build artifact.
- If tracking fails after deploy, revert .env and restart backend.

## 6. Post-deploy monitoring
- Review server/logs/tracking-sync.ndjson for 401/503/fetch errors.
- Check first manual sync from UI for MAERSK and CMA sample shipments.
