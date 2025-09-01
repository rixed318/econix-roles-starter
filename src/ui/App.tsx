import HealthPage from '../pages/Health'
import Wizard from '../pages/Wizard'
import ComparePage from '../pages/Compare'
import ComparePlus from '../pages/ComparePlus'
import Guide from '../pages/Guide'
import ChartsPage from '../pages/Charts'
import Unmatched from '../pages/Unmatched'
import LevelsPage from '../pages/Levels'
import PathPage from '../pages/Path'
import ResumePage from '../pages/Resume'
import MainLanding from '../pages/MainLanding'
import { useHash } from './routes'

function Home() { return <MainLanding /> }

export default function App() {
  const route = useHash()
  return route === 'health'
    ? <HealthPage />
    : route === 'wizard'
    ? <Wizard />
    : route === 'compare'
    ? <ComparePage />
    : route === 'compare-plus'
    ? <ComparePlus />
    : route === 'guide'
    ? <Guide />
    : route === 'charts'
    ? <ChartsPage />
    : route === 'levels'
    ? <LevelsPage />
    : route === 'path'
    ? <PathPage />
    : route === 'resume'
    ? <ResumePage />
    : route === 'unmatched'
    ? <Unmatched />
    : <Home />
}
