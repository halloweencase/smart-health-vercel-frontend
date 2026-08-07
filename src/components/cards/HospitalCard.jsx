import { Card } from '../ui';
export default function HospitalCard({ children, ...props }) { return <Card className="hospital-card" {...props}>{children}</Card>; }
