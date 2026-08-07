import { useCallback, useState } from 'react';
export function useApi(request) {
  const [loading, setLoading] = useState(false); const [error, setError] = useState(null);
  const execute = useCallback(async (...args) => { setLoading(true); setError(null); try { return await request(...args); } catch (err) { setError(err); throw err; } finally { setLoading(false); } }, [request]);
  return { execute, loading, error };
}
