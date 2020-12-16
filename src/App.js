import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/login/login";
import Register from "./components/register/register";
import Dashboard from "./components/dashboard/dashboard";
import Nav from "./components/nav/nav";
import UserManagement from "./components/usermanagement/userManagement";
import Machines from "./components/machines/machines";
import axios from "axios";
import "./App.css";

axios.defaults.headers = {
  "Content-Type": "application/json",
  "auth-token": localStorage.getItem("jwt"),
};

function App(props) {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login/" exact component={Login} />
        </Switch>
        <Switch>
          <Route
            path="/api/register/"
            exact
            render={(props) => (
              <div>
                <Nav />
                <Register />
              </div>
            )}
          />
          <Route
            path="/api/dashboard/"
            exact
            render={(props) => (
              <div>
                <Nav />
                <Dashboard />
              </div>
            )}
          />

          <Route
            path="/api/users/"
            exact
            render={(props) => (
              <div>
                <Nav />
                <UserManagement />
              </div>
            )}
          />

          <Route
            path="/api/machines/"
            exact
            render={(props) => (
              <div>
                <Nav />
                <Machines />
              </div>
            )}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
