/**
 * Communication Flow
 * Shows how commands flow through the vehicle ecosystem
 */

import { motion } from 'framer-motion';
import type { AttackExecution } from '../../stores/attackStore';
import './CommunicationFlow.css';

interface CommunicationFlowProps {
  activeAttack: AttackExecution | null;
}

const normalFlow = [
  { step: 1, component: 'Google Pixel App', description: 'User initiates vehicle command' },
  { step: 2, component: 'Vehicle API Gateway', description: 'Authentication and request routing' },
  { step: 3, component: 'Cloud Backend', description: 'Command processing and validation' },
  { step: 4, component: 'Telematics Control Unit', description: 'Vehicle-side gateway receives command' },
  { step: 5, component: 'Gateway ECU', description: 'Routes command to target ECU' },
  { step: 6, component: 'CAN Network', description: 'Message broadcast to ECUs' },
  { step: 7, component: 'Target ECU', description: 'Executes vehicle function' }
];

export const CommunicationFlow: React.FC<CommunicationFlowProps> = ({ activeAttack }) => {
  const flowSteps = activeAttack ? activeAttack.attackPath.map((node) => ({
    step: node.step,
    component: node.component,
    description: `Attack step ${node.step}`
  })) : normalFlow;

  return (
    <div className="communication-flow">
      <div className="flow-header">
        <h3>Communication Flow</h3>
        <span className="flow-mode">
          {activeAttack ? `Attack: ${activeAttack.attackName}` : 'Normal Operation'}
        </span>
      </div>

      <div className="flow-steps">
        {flowSteps.map((step, i) => (
          <motion.div
            key={i}
            className="flow-step-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <div className="step-number">{step.step}</div>
            <div className="step-content">
              <div className="step-component">{step.component}</div>
              <div className="step-description">{step.description}</div>
            </div>
            {i < flowSteps.length - 1 && (
              <div className="step-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
