import { sign, eq, makeToken, json } from '../_auth.js';
export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_USER || !env.ADMIN_PASS || !env.SESSION_SECRET)
    return json({ error: 'Server niet ingesteld: zet ADMIN_USER, ADMIN_PASS en SESSION_SECRET in Cloudflare.' }, 500);
  let b = {};
  try { b = await request.json(); } catch {}
  const k = env.SESSION_SECRET;
  const okU = eq(await sign(k, String(b.user || '')), await sign(k, env.ADMIN_USER));
  const okP = eq(await sign(k, String(b.pass || '')), await sign(k, env.ADMIN_PASS));
  if (!(okU && okP)) { await new Promise(r => setTimeout(r, 800)); return json({ error: 'Onjuiste inloggegevens' }, 401); }
  const t = await makeToken(env);
  return json({ ok: true }, 200, { 'Set-Cookie': `nn_session=${t}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800` });
}
