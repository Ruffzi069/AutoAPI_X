/**
 * AutoAPI-X Main Application
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { Dashboard } from './components/Dashboard/Dashboard';
import Infotainment from './pages/Infotainment';
import AttackSimulation from './pages/AttackSimulation';
import ImpactAnalysis from './pages/ImpactAnalysis';
import VehicleArchitecture from './pages/VehicleArchitecture';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicle-architecture" element={<VehicleArchitecture />} />
          <Route path="/infotainment" element={<Infotainment />} />
          <Route path="/attack-simulation" element={<AttackSimulation />} />
          <Route path="/impact-analysis" element={<ImpactAnalysis />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
