/**
 * CAN Traffic Graph
 * Clean line chart showing CAN frame generation over time
 */

import { motion } from 'framer-motion';
import type { AttackExecution } from '../../stores/attackStore';
import './CANTrafficGraph.css';

interface CANTrafficGraphProps {
  execution: AttackExecution;
}

export const CANTrafficGraph: React.FC<CANTrafficGraphProps> = ({ execution }) => {
  const { canActivity } = execution.telemetry;
  
  // Calculate chart dimensions
  const width = 100;
  const height = 60;
  const maxCount = Math.max(...canActivity.map(d => d.count), 1);
  const maxTime = Math.max(...canActivity.map(d => d.time), 1);
  
  // Generate path for line chart
  const points = canActivity.map(d => ({
    x: (d.time / maxTime) * width,
    y: height - (d.count / maxCount) * height
  }));
  
  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');
  
  // Generate area fill path
  const areaPath = `${pathData} L ${points[points.length - 1].x} ${height} L 0 ${height} Z`;
  
  return (
    <div className="can-traffic-graph">
      <div className="graph-header">
        <div>
          <h3>CAN Traffic</h3>
          <p className="graph-subtitle">{execution.canFrames} frames during attack execution</p>
        </div>
      </div>
      
      <div className="graph-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="traffic-chart">
          <defs>
            <linearGradient id={`canGrad-${execution.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 50, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={(y / 100) * height}
              x2={width}
              y2={(y / 100) * height}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Area fill */}
          <motion.path
            d={areaPath}
            fill={`url(#canGrad-${execution.id})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          
          {/* Data points */}
          {points.map((point, i) => (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill="#F59E0B"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.15 }}
            />
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="axis-labels">
          <span>0s</span>
          <span>{maxTime.toFixed(1)}s</span>
        </div>
      </div>
    </div>
  );
};
