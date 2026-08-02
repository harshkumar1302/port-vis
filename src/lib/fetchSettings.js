/** Safe fetch for /api/settings — works when Vite serves JS instead of JSON in local dev */
export async function fetchSiteSetting(id, fallback = null) {
  try {
    const res = await fetch(`/api/settings?id=${encodeURIComponent(id)}`);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      return fallback;
    }
    const data = await res.json();
    return data?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function fetchSiteSettingRow(id) {
  try {
    const res = await fetch(`/api/settings?id=${encodeURIComponent(id)}`);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}
