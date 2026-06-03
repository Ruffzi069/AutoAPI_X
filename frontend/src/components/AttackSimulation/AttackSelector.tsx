/**
 * Attack Selector Component
 * Simple attack selection
 */

import { motion } from 'framer-motion';
import type { Attack } from '../../pages/AttackSimulation';
import './AttackSelector.css';

interface AttackSelectorProps {
  attacks: Attack[];
  selectedAttack: Attack | null;
  onSelectAttack: (attack: Attack) => void;
}

export const AttackSelector: React.FC<AttackSelectorProps> = ({
  attacks,
  selectedAttack,
  onSelectAttack
}) => {
  return (
    <div className="attack-selector-simple">
      <h2>Select Attack</h2>
      <div className="attack-grid">
        {attacks.map((attack) => (
          <motion.button
            key={attack.id}
            className={`attack-card-simple ${selectedAttack?.id === attack.id ? 'selected' : ''}`}
            onClick={() => onSelectAttack(attack)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {attack.name}
            {selectedAttack?.id === attack.id && (
              <motion.div
                className="selection-indicator"
                layoutId="selection"
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
