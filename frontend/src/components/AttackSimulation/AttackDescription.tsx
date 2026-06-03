/**
 * Attack Description Component
 * Brief 2-3 line description only
 */

import type { Attack } from '../../pages/AttackSimulation';
import './AttackDescription.css';

interface AttackDescriptionProps {
  attack: Attack | null;
}

export const AttackDescription: React.FC<AttackDescriptionProps> = ({ attack }) => {
  if (!attack) {
    return null;
  }

  return (
    <div className="attack-description">
      <h3>{attack.name}</h3>
      <p>{attack.description}</p>
    </div>
  );
};
