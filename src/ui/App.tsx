import HealthPage from '../pages/Health'
import Wizard from '../pages/Wizard'
import MainLanding from '../pages/MainLanding'
import { useHash } from './routes'

function Home() { return <MainLanding /> }

export default function App() {
  const route = useHash()
  return route === 'health' ? <HealthPage /> : route === 'wizard' ? <Wizard /> : <Home />
}
