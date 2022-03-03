import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./Page/Login"
import UserAuth from "./Page/userAuth";
import UserProcessFlow from "./Page/UserProcessFlow";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/start">
            <UserProcessFlow />
          </Route>
          <Route path="/userauth">
            <UserAuth />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
