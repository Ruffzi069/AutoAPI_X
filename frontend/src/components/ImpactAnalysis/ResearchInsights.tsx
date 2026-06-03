/**
 * Research Insights
 * Concise attack summary and impact assessment
 */

import { motion } from 'framer-motion';
import type { AttackExecution } from '../../stores/attackStore';
import './ResearchInsights.css';

interface ResearchInsightsProps {
  execution: AttackExecution;
}

const attackInsights: Record<string, string> = {
  'idor': 'The IDOR attack successfully bypassed authorization controls and accessed vehicle resources. The Gateway ECU and Door Control ECU were activated without proper authentication. Privacy and vehicle access were compromised while safety-critical systems remained unaffected.',
  
  'broken-auth': 'The authentication bypass attack exploited missing authorization checks in the API gateway. Vehicle control commands were executed without valid credentials. The Gateway ECU and Body Control ECU processed unauthorized commands, demonstrating operational security vulnerabilities.',
  
  'replay-attack': 'The replay attack captured and re-executed legitimate vehicle unlock commands. The Gateway ECU and Door Control ECU accepted repeated commands without replay protection. The attack demonstrates the lack of timestamp validation and nonce implementation in vehicle command processing.',
  
  'data-exposure': 'The data exposure attack successfully retrieved excessive telemetry and location data from vehicle APIs. GPS coordinates, vehicle status, and telemetry data were exposed without proper filtering. The attack demonstrates privacy vulnerabilities in data response handling while operational systems remained secure.',
  
  'rate-limiting': 'The rate limiting failure allowed excessive API requests to flood vehicle services. The API Gateway and Body Control ECU were overwhelmed with repeated commands. The attack demonstrates resource exhaustion vulnerabilities that could lead to denial of service without impacting vehicle safety systems.',
  
  'ota-manipulation': 'The OTA manipulation attack successfully bypassed firmware verification and delivered malicious updates to the Infotainment ECU. The attack propagated through the OTA service and compromised firmware integrity. Infotainment and telematics systems were affected while safety-critical ECUs remained isolated and protected.'
};

export const ResearchInsights: React.FC<ResearchInsightsProps> = ({ execution }) => {
  const insight = attackInsights[execution.attackId] || 'Attack analysis unavailable.';
  
  return (
    <motion.div
      className="research-insights"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="insights-header">
        <svg className="insights-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M11 8v6M8 11h6" />
        </svg>
        <h3>Research Insights</h3>
      </div>
      <p className="insights-text">{insight}</p>
    </motion.div>
  );
};
