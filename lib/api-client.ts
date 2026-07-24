export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Non autorisé');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Erreur réseau');
  }

  return response.json();
}
