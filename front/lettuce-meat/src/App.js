import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import sha512 from 'js-sha512'
import React from 'react'

import HomePage from './HomePage'
import LoginPage from './LoginPage'
import SignUpPage from './SignUpPage'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  componentWillMount() {
    let auth = window.localStorage.getItem('au_co')
    let uname = window.localStorage.getItem('login')
    let now = sha512((new Date().toISOString().slice(0, 10)).toString())

    if (uname && auth === now) {
      this.setState({ loggedIn: true })
    } else {
      this.setState({ loggedIn: false })
    }
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={HomePage} />
            <Route path="/login" component={!this.state.loggedIn ? LoginPage : HomePage} />
            <Route path="/signup" component={!this.state.loggedIn ? SignUpPage : HomePage} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
