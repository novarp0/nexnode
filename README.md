# NexNode: website + admin-panel (Cloudflare Pages)

Map `public/` = de site, map `functions/` = de backend (login + opslag).

## Installatie
1. Zet deze hele map in een GitHub-repository.
2. Cloudflare > Workers & Pages > Create > Pages > Connect to Git > kies de repo.
   Build command: leeg. Build output directory: `public`.
3. Cloudflare > Storage & Databases > KV > maak een namespace (bv. `nexnode`).
4. Pages-project > Settings > Bindings > Add > KV namespace: variable name `DB`, kies de namespace.
5. Pages-project > Settings > Variables and Secrets (Production), voeg toe als Secret:
   `ADMIN_USER`, `ADMIN_PASS`, `SESSION_SECRET`
6. Deployments > Retry deployment (zodat de instellingen actief worden).
7. Ga naar `jouwsite.pages.dev/admin.html` en log in.

Wijzigingen in het admin-panel staan direct live. Maak regelmatig een back-up (knop in het panel).
