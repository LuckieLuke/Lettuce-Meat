import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import sha512 from "js-sha512";
import React from "react";

import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import PrivateRoute from "./PrivateRoute";
import AddRecipePage from "./AddRecipePage";
import RecipePage from "./RecipePage";
import FavoritePage from "./FavoritePage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }

  componentDidMount() {
    let auth = window.localStorage.getItem("au_co");
    let uname = window.localStorage.getItem("login");
    let now = sha512(new Date().toISOString().slice(0, 10).toString());

    if (uname && auth === now) {
      this.setState({ loggedIn: true });
    } else {
      this.setState({ loggedIn: false });
    }
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={HomePage} />
            <Route
              path="/login"
              component={!this.state.loggedIn ? LoginPage : HomePage}
            />
            <Route
              path="/signup"
              component={!this.state.loggedIn ? SignUpPage : HomePage}
            />
            <Route path="/recipes" component={HomePage} />
            <Route path="/recipe" component={RecipePage} />
            <Route path="/addrecipe" component={AddRecipePage} />
            <PrivateRoute path="/favorites" component={FavoritePage} />
            <PrivateRoute path="/menus" component={HomePage} />
            <PrivateRoute path="/createmenu" component={HomePage} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
