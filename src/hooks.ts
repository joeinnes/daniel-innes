import type { RequestEvent } from '@sveltejs/kit';
import jwt from '$lib/auth/jwt';
import { parse } from 'cookie';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }: { event: RequestEvent, resolve: (value: any) => void }) {
  try {
    const req = event.request;
    const rawCookies = req.headers.get('cookie') || '';
    const { access_token = '' } = parse(rawCookies);
    if (!access_token) throw 'No token';
    const user = await jwt.verifyAccessToken(access_token);
    event.locals.user = { ...user, ...user.payload };
    delete event.locals.user.payload
  } catch (e) {
    event.locals.user = null;
    // do nothing - token verification failed.
  }
  const response = await resolve(event);
  return response;
}