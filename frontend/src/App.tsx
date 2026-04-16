import { Router, Route } from '@solidjs/router';
import HomeScreen from './pages/HomeScreen';
import PlayScreen from './pages/PlayScreen';
import FinishScreen from './pages/FinishScreen';

function App() {
  return (
    <Router>
      <Route path="/" component={HomeScreen} />
      <Route path="/play" component={PlayScreen} />
      <Route path="/finish" component={FinishScreen} />
    </Router>
  );
}

export default App;
