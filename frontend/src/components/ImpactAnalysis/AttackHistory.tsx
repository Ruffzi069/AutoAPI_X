import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AttackExecution } from '../../stores/attackStore';
import './AttackHistory.css';

interface AttackHistoryProps {
  executions: AttackExecution[];
  selectedExecution: AttackExecution;
  onSelectExecution: (execution: AttackExecution) => void;
}

export const AttackHistory: React.FC<AttackHistoryProps> = ({ executions, selectedExecution, onSelectExecution }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="attack-history">
      <button className="history-toggle" onClick={() => setIsOpen(!isOpen)}>
        📜 Attack History ({executions.length})
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="history-dropdown" initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}>
            {executions.slice().reverse().map((exec) => (
              <button key={exec.id} className={`history-item ${exec.id === selectedExecution.id ? 'active' : ''}`} onClick={() => { onSelectExecution(exec); setIsOpen(false); }}>
                <span className="item-name">{exec.attackName}</span>
                <span className="item-time">{new Date(exec.timestamp).toLocaleTimeString()}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
