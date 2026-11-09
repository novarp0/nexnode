const enc = new TextEncoder();
export async function sign(secret, msg) {
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const s = await crypto.subtle.sign('HMAC', k, enc.encode(msg));
  return [...new Uint8Array(s)].map(b => b.toString(16).padStart(2, '0')).join('');
}
export function eq(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
export async function makeToken(env) {
  const exp = Date.now() + 7 * 864e5;
  return exp + '.' + await sign(env.SESSION_SECRET, String(exp));
}
export async function isAuthed(req, env) {
  if (!env.SESSION_SECRET) return false;
  const m = (req.headers.get('Cookie') || '').match(/(?:^|;\s*)nn_session=([^;]+)/);
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || +exp < Date.now()) return false;
  return eq(sig, await sign(env.SESSION_SECRET, exp));
}
export const json = (o, status = 200, headers = {}) =>
  new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });
