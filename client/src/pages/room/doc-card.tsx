import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DocCardProps {
  title: string;
  description: string;
}

export function DocCard({ title, description }: DocCardProps) {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
