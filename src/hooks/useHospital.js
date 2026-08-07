import { useEffect, useState } from 'react';
export function useHospital(loader) { const [hospital, setHospital] = useState(null); useEffect(() => { loader().then((data) => setHospital(data.hospital || data)); }, [loader]); return { hospital, setHospital }; }
