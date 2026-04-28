import type { APIRoute } from 'astro';

// This handler initiates the GitHub OAuth flow for Decap CMS.
// The requested scopes are intentionally narrow: `public_repo` allows the CMS
// to write to public content in the repository, while `read:user` is used to
// fetch the authenticated user's login for whitelisting.  See `.env.example`
// for configuration details.

export const GET: APIRoute = async ({ redirect, url }) => {
  const clientId = import.meta.env.GH_CLIENT_ID;
  const origin = import.meta.env.ORIGIN || url.origin;
  const state = url.searchParams.get('state') || '';

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', `${origin}/api/oauth/callback`);
  // Request only the minimal scopes needed for Decap CMS
  authUrl.searchParams.set('scope', 'public_repo,read:user');
  authUrl.searchParams.set('state', state);

  return redirect(authUrl.toString());
};