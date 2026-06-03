/**
 * Attack Summary Component
 * Key attack execution details
 */

import type { AttackExecution } from '../../stores/attackStore';
import './AttackSummary.css';

interface AttackSummaryProps {
  execution: AttackExecution;
}

export const AttackSummary: React.FC<AttackSummaryProps> = ({ execution }) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="attack-summary">
      <div className="summary-header">
        <h2>Attack Execution Summary</h2>
      </div>

      <div className="summary-grid">
        <div className="summary-item">
          <span className="summary-label">Attack Type</span>
          <span className="summary-value attack-name">{execution.attackName}</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Transaction ID</span>
          <span className="summary-value transaction-id">{execution.transactionId}</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Timestamp</span>
          <span className="summary-value">{formatDate(execution.timestamp)}</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Target System</span>
          <span className="summary-value">{execution.targetSystems[0]}</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Execution Status</span>
          <span className="summary-value status success">Completed</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Duration</span>
          <span className="summary-value">{execution.duration}s</span>
        </div>
      </div>
    </div>
  );
};
