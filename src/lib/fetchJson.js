/** Parse fetch responses safely — avoids "Unexpected end of JSON input" on empty/HTML bodies */
export async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid response from server.');
      }
    }
  } else {
    const text = await res.text().catch(() => '');
    if (!res.ok) {
      if (contentType.includes('text/html') || text.trimStart().startsWith('<!')) {
        throw new Error(
          'Could not reach the API. Run vercel dev locally, or test on the deployed site.'
        );
      }
      throw new Error(text?.slice(0, 120) || `Request failed (${res.status})`);
    }
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return { res, data };
}

export default fetchJson;
