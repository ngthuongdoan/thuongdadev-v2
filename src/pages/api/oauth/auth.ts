import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ redirect, url }) => {
  const clientId = import.meta.env.GH_CLIENT_ID;
  const origin = import.meta.env.ORIGIN || url.origin;
  const state = url.searchParams.get('state') || '';

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', `${origin}/api/oauth/callback`);
  authUrl.searchParams.set('scope', 'repo,user');
  authUrl.searchParams.set('state', state);

  return redirect(authUrl.toString());
};
