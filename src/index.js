import React from "react";
import ReactDOM from "react-dom";
import LogInForm from "./components/login";
import SignupForm from "./components/signup";

import VerifyInvitation from "./components/verifyInvitation";
import Admin from "./components/admin/invitePage";
import Feed from "./components/feedPage";
import HomePage from "./components/homePage";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

function Counter() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li>
              <Link to="/admin">Admin</Link>
            </li>
            <li>
              <Link to="/feed">Feed</Link>
            </li>
          </ul>
        </nav>
      </div>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/login">
          <LogInForm />
        </Route>
        <Route path="/signup">
          <SignupForm />
        </Route>

        <Route path="/admin">
          <Admin />
        </Route>

        <Route path="/feed">
          <Feed />
        </Route>

        <Route path="/verify/:invitationHash">
          <VerifyInvitation />
        </Route>

        <Route>
          <Redirect to="/login"></Redirect>
        </Route>
      </Switch>
    </Router>
  );
}

const $root = document.querySelector(".js-root");
ReactDOM.render(<Counter />, $root);
