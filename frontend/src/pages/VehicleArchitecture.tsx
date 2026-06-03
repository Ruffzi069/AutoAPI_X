/**
 * Vehicle Architecture Page
 * Technical foundation showing connected vehicle system architecture
 */

import { useState, useEffect } from 'react';
import { useAttackStore } from '../stores/attackStore';
import { ComponentExplorer } from '../components/VehicleArchitecture/ComponentExplorer';
import { ArchitectureDiagram } from '../components/VehicleArchitecture/ArchitectureDiagram';
import { ComponentInfoPanel } from '../components/VehicleArchitecture/ComponentInfoPanel';
import { CommunicationFlow } from '../components/VehicleArchitecture/CommunicationFlow';
import { ArchitectureInsights } from '../components/VehicleArchitecture/ArchitectureInsights';
import './VehicleArchitecture.css';

export interface VehicleComponent {
  id: string;
  name: string;
  type: 'app' | 'api' | 'cloud' | 'telematics' | 'gateway' | 'ecu' | 'network' | 'service';
  purpose: string;
  receives: string[];
  sends: string[];
  connectedSystems: string[];
  relatedAttacks: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  position?: { x: number; y: number };
}

export const vehicleComponents: VehicleComponent[] = [
  {
    id: 'mobile-app',
    name: 'Google Pixel Mobile App',
    type: 'app',
    purpose: 'User interface for vehicle control and monitoring. Sends commands to vehicle API gateway.',
    receives: ['Vehicle Status', 'Telemetry Data', 'GPS Location'],
    sends: ['Vehicle Commands', 'Authentication Tokens', 'API Requests'],
    connectedSystems: ['Vehicle API Gateway'],
    relatedAttacks: ['IDOR', 'Broken Authentication'],
    riskLevel: 'High',
    position: { x: 400, y: 50 }
  },
  {
    id: 'api-gateway',
    name: 'Vehicle API Gateway',
    type: 'api',
    purpose: 'Entry point for all vehicle API requests. Routes commands to cloud backend.',
    receives: ['API Requests', 'Authentication Tokens'],
    sends: ['Cloud Commands', 'Status Responses'],
    connectedSystems: ['Cloud Backend', 'Google Pixel Mobile App'],
    relatedAttacks: ['IDOR', 'Broken Authentication', 'Rate Limiting Failure'],
    riskLevel: 'Critical',
    position: { x: 400, y: 120 }
  },
  {
    id: 'cloud-backend',
    name: 'Cloud Backend',
    type: 'cloud',
    purpose: 'Processes vehicle commands and manages communication with telematics systems.',
    receives: ['API Requests', 'Vehicle Commands'],
    sends: ['Telematics Requests', 'Vehicle Data'],
    connectedSystems: ['Vehicle API Gateway', 'Telematics Control Unit'],
    relatedAttacks: ['Rate Limiting Failure', 'Excessive Data Exposure'],
    riskLevel: 'High',
    position: { x: 400, y: 190 }
  },
  {
    id: 'tcu',
    name: 'Telematics Control Unit',
    type: 'telematics',
    purpose: 'Vehicle-side gateway for cloud connectivity. Routes commands to Gateway ECU.',
    receives: ['Cloud Commands', 'Remote Requests'],
    sends: ['CAN Messages', 'Vehicle Status'],
    connectedSystems: ['Cloud Backend', 'Gateway ECU', 'OTA Service'],
    relatedAttacks: ['OTA Manipulation', 'Rate Limiting Failure'],
    riskLevel: 'Critical',
    position: { x: 400, y: 260 }
  },
  {
    id: 'gateway-ecu',
    name: 'Gateway ECU',
    type: 'gateway',
    purpose: 'Central routing hub between vehicle networks. Routes CAN messages to target ECUs.',
    receives: ['Telematics Commands', 'API Requests'],
    sends: ['CAN Messages', 'ECU Commands'],
    connectedSystems: ['Telematics Control Unit', 'GPS Module', 'Body Control Module', 'Infotainment ECU', 'Door ECU'],
    relatedAttacks: ['IDOR', 'Replay Attack', 'Broken Authentication'],
    riskLevel: 'Critical',
    position: { x: 400, y: 330 }
  },
  {
    id: 'gps-module',
    name: 'GPS Module',
    type: 'ecu',
    purpose: 'Provides vehicle location data. Communicates via CAN network.',
    receives: ['Location Requests'],
    sends: ['GPS Coordinates', 'Location Data'],
    connectedSystems: ['Gateway ECU', 'CAN Network'],
    relatedAttacks: ['IDOR', 'Excessive Data Exposure'],
    riskLevel: 'High',
    position: { x: 200, y: 400 }
  },
  {
    id: 'bcm',
    name: 'Body Control Module',
    type: 'ecu',
    purpose: 'Controls body functions including lights and horn. Receives CAN commands.',
    receives: ['CAN Commands', 'Control Signals'],
    sends: ['Status Updates', 'Acknowledgments'],
    connectedSystems: ['Gateway ECU', 'CAN Network'],
    relatedAttacks: ['Broken Authentication', 'Rate Limiting Failure'],
    riskLevel: 'Medium',
    position: { x: 300, y: 400 }
  },
  {
    id: 'infotainment-ecu',
    name: 'Infotainment ECU',
    type: 'ecu',
    purpose: 'Manages media, navigation, and user interface systems.',
    receives: ['Media Commands', 'OTA Updates'],
    sends: ['System Status', 'User Input'],
    connectedSystems: ['Gateway ECU', 'OTA Service', 'CAN Network'],
    relatedAttacks: ['OTA Manipulation', 'Broken Authentication'],
    riskLevel: 'High',
    position: { x: 400, y: 400 }
  },
  {
    id: 'door-ecu',
    name: 'Door Control ECU',
    type: 'ecu',
    purpose: 'Controls door locks and access. Processes unlock/lock commands.',
    receives: ['Lock Commands', 'Access Requests'],
    sends: ['Lock Status', 'Access Confirmations'],
    connectedSystems: ['Gateway ECU', 'CAN Network'],
    relatedAttacks: ['IDOR', 'Replay Attack'],
    riskLevel: 'Critical',
    position: { x: 500, y: 400 }
  },
  {
    id: 'can-network',
    name: 'CAN Network',
    type: 'network',
    purpose: 'Primary communication bus between ECUs. Carries all vehicle control messages.',
    receives: ['ECU Messages', 'Control Commands'],
    sends: ['Broadcast Messages', 'Network Traffic'],
    connectedSystems: ['Gateway ECU', 'GPS Module', 'Body Control Module', 'Infotainment ECU', 'Door Control ECU'],
    relatedAttacks: ['Replay Attack', 'Rate Limiting Failure'],
    riskLevel: 'Critical',
    position: { x: 400, y: 470 }
  },
  {
    id: 'ota-service',
    name: 'OTA Service',
    type: 'service',
    purpose: 'Over-the-air firmware update service. Delivers updates to ECUs.',
    receives: ['Update Packages', 'Firmware Files'],
    sends: ['Installation Commands', 'Update Status'],
    connectedSystems: ['Telematics Control Unit', 'Infotainment ECU'],
    relatedAttacks: ['OTA Manipulation'],
    riskLevel: 'Critical',
    position: { x: 600, y: 260 }
  },
  {
    id: 'telemetry-service',
    name: 'Telemetry Service',
    type: 'service',
    purpose: 'Collects and processes vehicle telemetry data.',
    receives: ['Sensor Data', 'Vehicle Status'],
    sends: ['Analytics Data', 'Telemetry Reports'],
    connectedSystems: ['Cloud Backend', 'GPS Module'],
    relatedAttacks: ['Excessive Data Exposure', 'Rate Limiting Failure'],
    riskLevel: 'Medium',
    position: { x: 200, y: 190 }
  }
];

export default function VehicleArchitecture() {
  const [selectedComponent, setSelectedComponent] = useState<VehicleComponent | null>(null);
  const { currentExecution } = useAttackStore();

  useEffect(() => {
    // Auto-select first component on mount
    if (!selectedComponent && vehicleComponents.length > 0) {
      setSelectedComponent(vehicleComponents[0]);
    }
  }, [selectedComponent]);

  return (
    <div className="vehicle-architecture-container">
      <div className="architecture-header">
        <h1>Vehicle Architecture</h1>
        <p className="header-subtitle">Connected Vehicle System Architecture Explorer</p>
      </div>

      <div className="architecture-layout">
        {/* Main Section: Component Explorer + Large Vehicle Diagram + Info Panel */}
        <div className="architecture-main">
          <ComponentExplorer
            components={vehicleComponents}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            activeAttack={currentExecution}
          />
          
          <ArchitectureDiagram
            components={vehicleComponents}
            onSelectComponent={setSelectedComponent}
            activeAttack={currentExecution}
          />
          
          <ComponentInfoPanel
            component={selectedComponent}
          />
        </div>

        {/* Bottom Section: Communication Flow (Secondary) + Insights */}
        <div className="architecture-bottom">
          <CommunicationFlow
            activeAttack={currentExecution}
          />
          
          <ArchitectureInsights />
        </div>
      </div>
    </div>
  );
}
