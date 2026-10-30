# Supabase availability for VICLU

Target project: `mvvmmewieigfslvqroia` (`viclu store`). No other projects are
managed by this workflow. It runs outside Supabase, so pausing the database
does not stop its scheduler.

## Scheduled recovery

`supabase-recovery.n8n.json` is generated with
`node ops/supabase-recovery.mjs`. It contains credential references, never tokens.

Every 15 minutes the workflow:

1. Reads the project's status through the Supabase Management API.
2. If healthy, reads one product ID through the public catalog API. This is a
   real database query and checks the API used by the storefront.
3. If `INACTIVE`, sends one `POST /v1/projects/{ref}/restore`. It records
   `restore_requested`; the next scheduled run checks the actual result.
4. Waits during startup/restoration and other transitions. Unexpected or failed
   states fail visibly in n8n. An unhealthy active project is not restarted.

Read requests have a 15-second timeout and up to three attempts. The restore
POST has no immediate retries. Workflow timeout: 180 seconds. Successful
executions do not retain payloads; errors are saved for diagnosis. There are no
outbound messages or periodic status notifications.

### Credentials and activation

Create two n8n **Header Auth** credentials:

- `VICLU Supabase Management`: `Authorization` = `Bearer <management token>`.
- `VICLU Supabase Public Catalog`: `apikey` = the application's public anon key.

Bind their IDs to the generated workflow and activate the schedule. Tokens
belong only in n8n's encrypted credential store, never in this repository, the
browser bundle, node parameters, or workflow exports. The management token
must authorize reading and restoring this project.

Deployment status as of 30 October 2026: **active** on
[n8n workflow qj4AV6fMijzya5BL](https://n8n.fourgsolutions.com/workflow/qj4AV6fMijzya5BL),
every 15 minutes, timezone `America/Bogota`. The first real scheduled execution,
`435787`, completed successfully at 14:35 COT and returned `outcome: healthy`.
The project was already healthy, so no restore request was sent. The final
15-minute schedule and active state were read back from the server.

Both credentials are stored encrypted in n8n and restricted to their respective
HTTP domains. Successful execution payload retention is disabled after the
initial validation. A valid existing n8n key was recovered from local client
configuration; no new account, paid plan or public webhook was required.

## Browser recovery

The deployed catalog includes optimized product photos and a public inventory
snapshot. A failed inventory request preserves the last available catalog.
The browser retries every 30 seconds after errors and refreshes when coming
online or regaining focus. Requests time out after 10 seconds, overlapping
fetches are suppressed, and timers/listeners are removed on unmount. Stock may
be stale during an outage; the storefront asks customers to confirm it via
WhatsApp.

## Limits and verification

This does not change the Free plan or guarantee uninterrupted service. Its
activity can reduce inactivity pauses; only paid plans are exempt. Detection
can take up to roughly 15 minutes plus restoration time and scheduler delays.
The n8n server, scheduler and credentials must remain available. Provider
outages, failed restores, exhausted quotas and revoked credentials can still
require intervention.

Tests cover paused/healthy/transitional/failed statuses, unexpected project IDs,
the exact generated Code-node logic, catalog validation, and browser recovery
after outages. Production is never intentionally paused to test restoration.

References:

- [Supabase project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)
- [Supabase restore API](https://supabase.com/docs/reference/api/v1-restore-a-project)
