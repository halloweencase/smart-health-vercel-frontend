import { Card } from '../ui';
export default function DoctorCard({ children, ...props }) { return <Card className="doctor-card" {...props}>{children}</Card>; }
