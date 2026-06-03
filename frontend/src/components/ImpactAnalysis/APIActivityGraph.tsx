/**
 * API Activity Graph
 * Clean line chart showing API request activity during attack execution
 */

import { motion } from 'framer-motion';
import type { AttackExecution } from '../../stores/attackStore';
import './APIActivityGraph.css';

interface APIActivityGraphProps {
  execution: AttackExecution;
}

export const APIActivityGraph: React.FC<APIActivityGraphProps> = ({ execution }) => {
  const { apiActivity } = execution.telemetry;
  
  // Calculate chart dimensions
  const width = 100;
  const height = 60;
  const maxCount = Math.max(...apiActivity.map(d => d.count), 1);
  const maxTime = Math.max(...apiActivity.map(d => d.time), 1);
  
  // Generate path for line chart
  const points = apiActivity.map(d => ({
    x: (d.time / maxTime) * width,
    y: height - (d.count / maxCount) * height
  }));
  
  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');
  
  // Generate area fill path
  const areaPath = `${pathData} L ${points[points.length - 1].x} ${height} L 0 ${height} Z`;
  
  return (
    <div className="api-activity-graph">
      <div className="graph-header">
        <div>
          <h3>API Activity</h3>
          <p className="graph-subtitle">{execution.apiRequests} requests during attack execution</p>
        </div>
      </div>
      
      <div className="graph-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="activity-chart">
          <defs>
            <linearGradient id={`apiGrad-${execution.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
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
            fill={`url(#apiGrad-${execution.id})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="#8B5CF6"
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
              fill="#8B5CF6"
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
