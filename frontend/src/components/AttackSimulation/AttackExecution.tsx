/**
 * Attack Execution Component
 * Single "Run Attack" button
 */

import { motion } from 'framer-motion';
import type { Attack } from '../../pages/AttackSimulation';
import './AttackExecution.css';

interface AttackExecutionProps {
  attack: Attack | null;
  isExecuting: boolean;
  onExecute: () => void;
}

export const AttackExecution: React.FC<AttackExecutionProps> = ({
  attack,
  isExecuting,
  onExecute
}) => {
  if (!attack) {
    return null;
  }

  return (
    <div className="attack-execution">
      <motion.button
        className="run-attack-btn"
        onClick={onExecute}
        disabled={isExecuting}
        whileHover={{ scale: isExecuting ? 1 : 1.02 }}
        whileTap={{ scale: isExecuting ? 1 : 0.98 }}
      >
        {isExecuting ? (
          <>
            <span className="spinner"></span>
            Attack Running...
          </>
        ) : (
          <>
            <span className="play-icon">▶</span>
            Run Attack
          </>
        )}
      </motion.button>
    </div>
  );
};
