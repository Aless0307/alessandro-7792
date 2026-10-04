import { ShellIcon } from '../../../components/brand/ShellIcon';
import { ColumnChart } from '../../../components/charts/ColumnChart';
import { Card } from '../../../components/ui/Card';
import { RACES_PER_DAY, countWins, type RaceDay } from '../../races/raceDay';
import { getSnail } from '../../races/snails';

interface WinsCardProps {
  day: RaceDay;
}

export function WinsCard({ day }: WinsCardProps) {
  const wins = countWins(day);
  const maxWins = Math.max(...wins.map((entry) => entry.wins));
  const leaders = wins.filter((entry) => entry.wins === maxWins).map((entry) => entry.snailId);

  return (
    <Card title="Victorias por caracol" description={describeLeaders(leaders, maxWins)}>
      <ColumnChart
        title={`Victorias por caracol en las ${RACES_PER_DAY} carreras de hoy`}
        highlightIds={leaders}
        formatValue={(value) => (value === 1 ? '1 victoria' : `${value} victorias`)}
        data={wins.map((entry) => {
          const snail = getSnail(entry.snailId);
          return {
            id: snail.id,
            label: snail.name,
            value: entry.wins,
            icon: <ShellIcon color={snail.shellColor} size={22} />,
          };
        })}
      />
    </Card>
  );
}

function describeLeaders(leaderIds: string[], wins: number): string {
  const names = leaderIds.map((id) => getSnail(id).name);
  const victories = wins === 1 ? '1 victoria' : `${wins} victorias`;
  if (names.length === 1)
    return `${RACES_PER_DAY} carreras hoy. Va a la cabeza ${names[0]} con ${victories}.`;
  const list = `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
  return `${RACES_PER_DAY} carreras hoy. Empatan ${list} con ${victories} cada uno.`;
}
