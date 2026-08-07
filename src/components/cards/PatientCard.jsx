import { Card } from '../ui';
export default function PatientCard({ children, ...props }) { return <Card className="patient-card" {...props}>{children}</Card>; }
