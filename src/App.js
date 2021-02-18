import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
import Navigation from './Navigation';
function App() {
  return (
    <>
      <header></header>
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
        </Switch>
      </Router>
      <Navigation />
    </>
  );
}

export default App;
