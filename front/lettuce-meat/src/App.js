import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import HomePage from './HomePage'
import LoginPage from './LoginPage'

function App() {


  return (
    <div className="App">
      <Router>
        <div>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
        </div>
      </Router>
    </div>
  );
}

export default App;
