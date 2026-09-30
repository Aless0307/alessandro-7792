import { DonutChart } from '../../../components/charts/DonutChart';
import { Card } from '../../../components/ui/Card';
import type { BetSummary } from '../../races/bets';

interface BetsCardProps {
  summary: BetSummary;
}

export function BetsCard({ summary }: BetsCardProps) {
  const total = summary.won + summary.lost;
  const winRate = total === 0 ? 0 : Math.round((summary.won / total) * 100);

  return (
    <Card title="Tus apuestas de hoy" description={`${total} apuestas en las 6 carreras`}>
      <DonutChart
        title="Apuestas ganadas y perdidas hoy"
        centerValue={`${winRate} %`}
        centerLabel="ganadas"
        segments={[
          { id: 'won', label: 'Ganadas', value: summary.won, color: 'var(--chart-won)' },
          { id: 'lost', label: 'Perdidas', value: summary.lost, color: 'var(--chart-lost)' },
        ]}
      />
    </Card>
  );
}
