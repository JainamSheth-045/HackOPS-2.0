import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';
import IntelligencePage from './pages/IntelligencePage';
import CompliancePage from './pages/CompliancePage';
import IncidentsPage from './pages/IncidentsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FAF8] flex">
        {/* Dark Forest-Green Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          {/* Top Header Navbar */}
          <Navbar 
            onMenuClick={() => setSidebarOpen(true)} 
            currentStation="Vapi GIDC Industrial Cluster"
          />

          {/* Route Outlet Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/intelligence" element={<IntelligencePage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
