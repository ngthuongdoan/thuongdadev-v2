import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');
  const origin = import.meta.env.ORIGIN || url.origin;
  const allowedUsersRaw = import.meta.env.GH_ALLOWED_USERS || 'ngthuongdoan';
  const allowedUsers = allowedUsersRaw
    .split(',')
    .map((user: string) => user.trim().toLowerCase())
    .filter(Boolean);

  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  try {
    const clientId = import.meta.env.GH_CLIENT_ID;
    const clientSecret = import.meta.env.GH_CLIENT_SECRET;

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${origin}/api/oauth/callback`,
      }),
    });

    const data = await tokenResponse.json();

    if (data.error) {
      throw new Error(data.error_description || data.error);
    }

    const token = data.access_token;

    // Restrict CMS access to explicit GitHub usernames only.
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to verify authenticated GitHub user');
    }

    const userData = await userResponse.json();
    const githubLogin = String(userData?.login || '').toLowerCase();
    const isAllowed = allowedUsers.includes(githubLogin);

    if (!isAllowed) {
      return new Response(
        `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Access denied</title>
  </head>
  <body>
    <script>
      (function() {
        window.opener.postMessage(
          "authorization:github:error:access_denied:This GitHub account is not allowed to access this CMS.",
          ${JSON.stringify(origin)}
        );
      })();
    </script>
    <p>Access denied for GitHub user: ${githubLogin || 'unknown'}.</p>
  </body>
</html>`,
        {
          status: 403,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    // Return HTML that communicates with Decap CMS
    return new Response(
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Authenticating...</title>
  </head>
  <body>
    <script>
      (function() {
        function receiveMessage(e) {
          if (e.origin !== ${JSON.stringify(origin)}) {
            return;
          }
          console.log("receiveMessage", e);
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify({
              token: "${token}",
              provider: "github"
            }),
            e.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        console.log("Sending message to opener");
        window.opener.postMessage("authorizing:github", ${JSON.stringify(origin)});
      })();
    </script>
  </body>
</html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('OAuth Error:', error);
    return new Response(
      `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
};
