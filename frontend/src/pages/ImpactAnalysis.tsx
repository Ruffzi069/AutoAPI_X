/**
 * Impact Analysis Page
 * Dynamic attack-aware cybersecurity impact assessment
 */

import { useState, useEffect } from 'react';
import { useAttackStore } from '../stores/attackStore';
import { AttackSummary } from '../components/ImpactAnalysis/AttackSummary';
import { SeverityAssessment } from '../components/ImpactAnalysis/SeverityAssessment';
import { RiskDistribution } from '../components/ImpactAnalysis/RiskDistribution';
import { AttackHistory } from '../components/ImpactAnalysis/AttackHistory';
import { APIActivityGraph } from '../components/ImpactAnalysis/APIActivityGraph';
import { CANTrafficGraph } from '../components/ImpactAnalysis/CANTrafficGraph';
import { VehicleHeatMap } from '../components/ImpactAnalysis/VehicleHeatMap';
import { AttackPathVisualization } from '../components/ImpactAnalysis/AttackPathVisualization';
import { ResearchInsights } from '../components/ImpactAnalysis/ResearchInsights';
import './ImpactAnalysis.css';

export default function ImpactAnalysis() {
  const { executions, currentExecution, setCurrentExecution } = useAttackStore();
  const [selectedExecution, setSelectedExecution] = useState(currentExecution);

  useEffect(() => {
    // Auto-select latest execution
    if (currentExecution && currentExecution !== selectedExecution) {
      setSelectedExecution(currentExecution);
    }
  }, [currentExecution]);

  const handleSelectExecution = (execution: any) => {
    setSelectedExecution(execution);
    setCurrentExecution(execution);
  };

  if (!selectedExecution && executions.length === 0) {
    return (
      <div className="impact-analysis-container">
        <div className="impact-analysis-header">
          <h1>Impact Analysis</h1>
          <p className="header-subtitle">Automotive Security Assessment</p>
        </div>
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <h2>No Attack Executions Yet</h2>
          <p>Execute an attack from the Attack Simulation page to generate impact analysis</p>
        </div>
      </div>
    );
  }

  const execution = selectedExecution || executions[executions.length - 1];

  return (
    <div className="impact-analysis-container">
      <div className="impact-analysis-header">
        <div>
          <h1>Impact Analysis</h1>
          <p className="header-subtitle">Attack: {execution.attackName} • {execution.transactionId}</p>
        </div>
        <AttackHistory
          executions={executions}
          selectedExecution={execution}
          onSelectExecution={handleSelectExecution}
        />
      </div>

      <div className="impact-layout">
        {/* Row 1: Attack Summary */}
        <div className="impact-row">
          <AttackSummary execution={execution} />
        </div>

        {/* Row 2: Severity + Risk Distribution */}
        <div className="impact-row severity-risk-row">
          <SeverityAssessment execution={execution} />
          <RiskDistribution execution={execution} />
        </div>

        {/* Row 3: Attack Flow (Centerpiece) */}
        <div className="impact-row">
          <AttackPathVisualization execution={execution} />
        </div>

        {/* Row 4: API Activity + CAN Activity */}
        <div className="impact-row activity-row">
          <APIActivityGraph execution={execution} />
          <CANTrafficGraph execution={execution} />
        </div>

        {/* Row 5: Vehicle Component Impact */}
        <div className="impact-row">
          <VehicleHeatMap execution={execution} />
        </div>

        {/* Row 6: Research Insights */}
        <div className="impact-row">
          <ResearchInsights execution={execution} />
        </div>
      </div>
    </div>
  );
}
