import { useEffect, useState } from 'react';
export function useDoctors(loader) { const [doctors, setDoctors] = useState([]); useEffect(() => { loader().then((data) => setDoctors(data.doctors || [])); }, [loader]); return { doctors, setDoctors }; }
