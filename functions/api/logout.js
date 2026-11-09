import { json } from '../_auth.js';
export async function onRequestPost() {
  return json({ ok: true }, 200, { 'Set-Cookie': 'nn_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' });
}
