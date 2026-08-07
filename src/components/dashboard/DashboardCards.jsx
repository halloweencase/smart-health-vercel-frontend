import { Card } from '../ui';
export default function DashboardCards({ items }) { return <div className="metric-grid">{items.map(({ label, value, icon: Icon, color }) => <Card key={label} className="metric-tile"><span className={`icon-circle ${color}`}><Icon size={22} /></span><div><h3>{value}</h3><p>{label}</p></div></Card>)}</div>; }
