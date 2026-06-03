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
import { getAttackEndpoint } from '../config/api';
import './AttackSimulation.css';

export interface Attack {
  id: string;
  name: string;
  description: string;
}

export const attacks: Attack[] = [
  {
    id: 'replay',
    name: 'Replay Attack',
    description: 'A previously captured command is replayed multiple times to repeat vehicle actions.'
  },
  {
    id: 'idor',
    name: 'IDOR',
    description: 'An attacker changes a vehicle identifier and gains access to another vehicle\'s resources.'
  },
  {
    id: 'broken-authentication',
    name: 'Broken Authentication',
    description: 'An attacker bypasses authentication checks and gains unauthorized API access to vehicle functions.'
  },
  {
    id: 'excessive-data-exposure',
    name: 'Excessive Data Exposure',
    description: 'Vehicle location and telemetry data is exposed without proper authorization checks.'
  },
  {
    id: 'rate-limiting-failure',
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
    
    try {
      // Get the correct API endpoint for this attack
      const endpoint = getAttackEndpoint(selectedAttack.id);
      
      // Call the actual backend API endpoint
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vin: '5YJ3E1EA1KF000001',
          // Attack-specific parameters
          ...(selectedAttack.id === 'replay' && { iterations: 5 }),
          ...(selectedAttack.id === 'idor' && { 
            victim_vin: '5YJ3E1EA1KF000001',
            attacker_vin: 'ATTACKER_VIN' 
          }),
          ...(selectedAttack.id === 'rate-limiting-failure' && { burst_count: 30 })
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Attack executed successfully:', result);
        console.log('🚀 Expected CAN traffic:', result.expected_can_traffic);
        console.log('📊 Attack ID:', result.attack_id);
        
        // Record attack execution for Impact Analysis
        const executionTimeline: Array<{time: string, event: string}> = [];
        executionTimeline.push({
          time: new Date().toISOString(),
          event: `${selectedAttack.name} initiated - Attack ID: ${result.attack_id}`
        });
        executionTimeline.push({
          time: new Date().toISOString(),
          event: `CAN Traffic: ${result.expected_can_traffic}`
        });
        
        // Keep attack UI running for visual feedback duration
        setTimeout(() => {
          setIsExecuting(false);
          addExecution(selectedAttack.id, result.attack_id, executionTimeline);
        }, 4000);
      } else {
        console.error('❌ Attack execution failed:', result);
        setIsExecuting(false);
      }
    } catch (error) {
      console.error('❌ Error executing attack:', error);
      setIsExecuting(false);
      alert('Failed to execute attack. Make sure the backend is running on http://localhost:5000');
    }
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
