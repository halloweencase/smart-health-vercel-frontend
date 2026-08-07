import { useEffect, useState } from 'react';
export function usePatients(loader) { const [patients, setPatients] = useState([]); const [loading, setLoading] = useState(true); useEffect(() => { loader().then((data) => setPatients(data.patients || [])).finally(() => setLoading(false)); }, [loader]); return { patients, setPatients, loading }; }
