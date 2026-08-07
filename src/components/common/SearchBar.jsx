export default function SearchBar({ value, onChange, placeholder = 'Search...' }) { return <input value={value} onChange={onChange} placeholder={placeholder} />; }
