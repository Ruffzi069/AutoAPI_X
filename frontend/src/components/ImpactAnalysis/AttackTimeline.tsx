import type { AttackExecution } from '../../stores/attackStore';
import './AttackTimeline.css';

export const AttackTimeline: React.FC<{execution: AttackExecution}> = ({ execution }) => (
  <div className="attack-timeline">
    <h2>Attack Timeline</h2>
    <div className="timeline-content">
      <div className="timeline-stats">
        <div className="stat"><span>API Requests:</span><strong>{execution.apiRequests}</strong></div>
        <div className="stat"><span>CAN Frames:</span><strong>{execution.canFrames}</strong></div>
        <div className="stat"><span>Duration:</span><strong>{execution.duration}s</strong></div>
      </div>
    </div>
  </div>
);
