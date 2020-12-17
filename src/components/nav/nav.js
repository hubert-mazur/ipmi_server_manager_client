import { React, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  AccountCircle,
  AddCircle,
  Dashboard,
  Fireplace,
  ExitToApp,
  PersonAdd,
  Contacts,
  Storage,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import "./nav.css";
import axios from "axios";

function Nav(props) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.get(
          "http://localhost:3000/api/users/identity",
          {
            withCredentials: true,
          }
        );

        setName(resp.data.body[0].name);
        setLastName(resp.data.body[0].lastName);
      } catch (err) {
        if (err) {
          console.error(err.response);
          setError(err.response);
        }
      }
    };
    getData();
  }, []);

  const logout = () => {
    localStorage.setItem("jwt", null);
    props.history.push("/login");
  };

  const dashboard = () => {
    props.history.push("/api/dashboard");
  };

  return (
    <div>
      {error && (
        <Alert
          severity="error"
          onClick={(event) => {
            setError(null);
            event.preventDefault();
          }}
        >
          {error.data.body}
        </Alert>
      )}

      <div className="nav">
        <div style={{ marginBottom: 10 }}>
          <AccountCircle></AccountCircle> {name} {lastName}
        </div>
        <div style={{ marginBottom: 50 }}>
          <ExitToApp
            style={{ fill: "red" }}
            className="svg_icons"
            onClick={(event) => {
              logout();
            }}
          ></ExitToApp>
          <span>Logout</span>
        </div>
        <div style={{ lineHeight: 3 }}>
          <div>
            <Dashboard
              className="svg_icons"
              onClick={(event) => {
                dashboard();
              }}
            ></Dashboard>
            <span>Dashboard</span>
          </div>
          <div>
            <PersonAdd
              style={{ fill: "green" }}
              className="svg_icons"
              onClick={(event) => {
                props.history.push("/api/register");
              }}
            ></PersonAdd>
            <span>Register user</span>
          </div>
          <div>
            <Contacts
              style={{ fill: "green" }}
              className="svg_icons"
              onClick={(event) => {
                props.history.push("/api/users");
              }}
            ></Contacts>
            <span>Manage users</span>
          </div>
          <div>
            <Storage
              className="svg_icons"
              style={{ fill: "green" }}
              onClick={(event) => {
                props.history.push("/api/machines");
              }}
            ></Storage>{" "}
            <span>Machines</span>
          </div>
          <div>
          <Storage
              className="svg_icons"
              style={{ fill: "green" }}
              onClick={(event) => {
                props.history.push("/api/machines/register");
              }}
            ></Storage>{" "}
            <span>Register machine</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Nav);
