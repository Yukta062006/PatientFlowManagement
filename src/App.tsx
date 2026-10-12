import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import OverviewPage from './pages/OverviewPage'
import MedicalKnowledgePage from './pages/MedicalKnowledgePage'
import MedicalVideosPage from './pages/MedicalVideosPage'
import HealthGamesPage from './pages/HealthGamesPage'
import LearningProgressPage from './pages/LearningProgressPage'

function App() {
  return (
    <div className="min-h-screen bg-outerBackground">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block w-64 lg:w-72">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/medical-knowledge" element={<MedicalKnowledgePage />} />
              <Route path="/medical-videos" element={<MedicalVideosPage />} />
              <Route path="/health-games" element={<HealthGamesPage />} />
              <Route path="/learning-progress" element={<LearningProgressPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
