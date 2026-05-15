import { useMemo, useState } from 'react'
import './App.css'
import AppShell from './components/AppShell'
import { useGymFlowData } from './hooks/useGymFlowData'
import Home from './pages/Home'
import Workout from './pages/Workout'
import History from './pages/History'
import Progress from './pages/Progress'
import Program from './pages/Program'
import Settings from './pages/Settings'

const views = {
  home: Home,
  workout: Workout,
  history: History,
  progress: Progress,
  program: Program,
  settings: Settings,
}

function App() {
  const [activeView, setActiveView] = useState('home')
  const [selectedWorkoutDayId, setSelectedWorkoutDayId] = useState(null)
  const gymFlow = useGymFlowData()
  const ActivePage = views[activeView]

  const pageTitle = useMemo(() => {
    const titles = {
      home: 'Tänään',
      workout: 'Treeni',
      history: 'Historia',
      progress: 'Kehitys',
      program: 'Ohjelma',
      settings: 'Asetukset',
    }
    return titles[activeView]
  }, [activeView])

  return (
    <AppShell activeView={activeView} onNavigate={setActiveView} title={pageTitle}>
      <ActivePage
        {...gymFlow}
        onNavigate={setActiveView}
        onSelectWorkoutDay={setSelectedWorkoutDayId}
        selectedWorkoutDayId={selectedWorkoutDayId}
      />
    </AppShell>
  )
}

export default App
