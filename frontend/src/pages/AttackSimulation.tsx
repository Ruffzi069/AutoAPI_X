/**
 * Attack Simulation Module
 * Connected Vehicle Security Testing Laboratory
 * Live cybersecurity experiment platform
 */

import { useState } from 'react';
import { AttackSelector } from '../components/AttackSimulation/AttackSelector';
import { AttackDescription } from '../components/AttackSimulation/AttackDescription';
import { AttackExecution } from '../components/AttackSimulation/AttackExecution';
import { APIActivityPanel } from '../components/AttackSimulation/APIActivityPanel';
import { CANActivityPanel } from '../components/AttackSimulation/CANActivityPanel';
import { VehicleReactionPanel } from '../components/AttackSimulation/VehicleReactionPanel';
import { useAttackStore } from '../stores/attackStore';
import './AttackSimulation.css';

export interface Attack {
  id: string;
  name: string;
  description: string;
}

export const attacks: Attack[] = [
  {
    id: 'idor',
    name: 'IDOR',
    description: 'An attacker changes a vehicle identifier and gains access to another vehicle\'s resources.'
  },
  {
    id: 'broken-auth',
    name: 'Broken Authentication',
    description: 'An attacker bypasses authentication checks and gains unauthorized API access to vehicle functions.'
  },
  {
    id: 'replay-attack',
    name: 'Replay Attack',
    description: 'A previously captured command is replayed multiple times to repeat vehicle actions.'
  },
  {
    id: 'data-exposure',
    name: 'Excessive Data Exposure',
    description: 'Vehicle location and telemetry data is exposed without proper authorization checks.'
  },
  {
    id: 'rate-limiting',
    name: 'Rate Limiting Failure',
    description: 'Unlimited API requests flood the system, causing resource exhaustion and service degradation.'
  },
  {
    id: 'ota-manipulation',
    name: 'OTA Manipulation',
    description: 'A malicious firmware update is delivered through the OTA update channel without verification.'
  }
];

export default function AttackSimulation() {
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(attacks[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionCount, setExecutionCount] = useState(0);
  
  const addExecution = useAttackStore(state => state.addExecution);

  const handleExecuteAttack = async () => {
    if (!selectedAttack) return;
    
    setIsExecuting(true);
    setExecutionCount(prev => prev + 1);
    
    const txnId = `TXN-ATT-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
    
    // Collect timeline as attack executes
    const executionTimeline: Array<{time: string, event: string}> = [];
    
    // Simulate attack execution duration
    setTimeout(() => {
      setIsExecuting(false);
      
      // Record attack execution for Impact Analysis
      addExecution(selectedAttack.id, txnId, executionTimeline);
    }, 4000);
  };

  return (
    <div className="attack-simulation-container">
      <div className="attack-simulation-header">
        <div className="header-content">
          <h1>Attack Simulation</h1>
          <p className="header-subtitle">Live Connected Vehicle Security Experiments</p>
        </div>
      </div>

      <div className="simulation-layout">
        <AttackSelector
          attacks={attacks}
          selectedAttack={selectedAttack}
          onSelectAttack={setSelectedAttack}
        />

        <AttackDescription attack={selectedAttack} />

        <AttackExecution
          attack={selectedAttack}
          isExecuting={isExecuting}
          onExecute={handleExecuteAttack}
        />

        <div className="telemetry-grid">
          <APIActivityPanel
            attack={selectedAttack}
            isExecuting={isExecuting}
            executionCount={executionCount}
          />

          <CANActivityPanel
            attack={selectedAttack}
            isExecuting={isExecuting}
            executionCount={executionCount}
          />
        </div>

        <VehicleReactionPanel
          attack={selectedAttack}
          isExecuting={isExecuting}
          executionCount={executionCount}
        />
      </div>
    </div>
  );
}
