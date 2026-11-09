import { isAuthed, json } from '../_auth.js';
async function defaults(request, env) {
  const r = await env.ASSETS.fetch(new Request(new URL('/content.default.json', request.url)));
  return r.json();
}
export async function onRequestGet({ request, env }) {
  if (env.DB) {
    const v = await env.DB.get('content');
    if (v) return new Response(v, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  }
  return json(await defaults(request, env));
}
export async function onRequestPut({ request, env }) {
  if (!(await isAuthed(request, env))) return json({ error: 'Niet ingelogd' }, 401);
  if (!env.DB) return json({ error: 'KV-opslag (binding DB) is niet gekoppeld in Cloudflare.' }, 500);
  const text = await request.text();
  if (text.length > 900000) return json({ error: 'Te groot' }, 413);
  let c;
  try { c = JSON.parse(text); } catch { return json({ error: 'Ongeldige JSON' }, 400); }
  for (const k of ['settings', 'categories', 'products', 'locations', 'reviews', 'features', 'pages'])
    if (!(k in c)) return json({ error: 'Ontbrekend onderdeel: ' + k }, 400);
  await env.DB.put('content', JSON.stringify(c));
  return json({ ok: true });
}
