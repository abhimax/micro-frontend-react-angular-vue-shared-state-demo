// The host talks to the same API gateway the remotes use (single origin).
const API_BASE = 'http://localhost:4000';

// Fetch a resource list and return how many records it has. Used by the
// dashboard tiles to show a live count.
export async function fetchCount(resource: string): Promise<number> {
  const res = await fetch(`${API_BASE}/${resource}`);
  if (!res.ok) {
    throw new Error(`Failed to load ${resource} (HTTP ${res.status})`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}
