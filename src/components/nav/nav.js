import { React, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  AccountCircle,
  Dashboard,
  ExitToApp,
  PersonAdd,
  Contacts,
  Storage,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import "./navigationPanel.css";
import axios from "../../instance";

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
    <div className="sidebar">
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

      <table style={{ borderSpacing: 20 }}>
        <tr>
          <td>
            <AccountCircle></AccountCircle> {name} {lastName}
          </td>
        </tr>
        <tr>
          <td>
            <ExitToApp
              style={{ fill: "red" }}
              className="svg_icons"
              onClick={(event) => {
                logout();
              }}
            ></ExitToApp>{" "}
            Logout
          </td>
        </tr>

        <tr>
          <td>
            <Dashboard
              className="svg_icons"
              style={{ fill: "blue" }}
              onClick={(event) => {
                dashboard();
              }}
            ></Dashboard>
            Dashboard
          </td>
        </tr>
        <tr>
          <td>
            <PersonAdd
              style={{ fill: "green" }}
              className="svg_icons"
              onClick={(event) => {
                props.history.push("/api/register");
              }}
            ></PersonAdd>
            Register user
          </td>
        </tr>

        <tr>
          <td>
            <Contacts
              style={{ fill: "blue" }}
              className="svg_icons"
              onClick={(event) => {
                props.history.push("/api/users");
              }}
            ></Contacts>
            Manage users
          </td>
        </tr>

        <tr>
          <td>
            <Storage
              className="svg_icons"
              style={{ fill: "blue" }}
              onClick={(event) => {
                props.history.push("/api/machines");
              }}
            ></Storage>{" "}
            Machines
          </td>
        </tr>

        <tr>
          <td>
            <Storage
              className="svg_icons"
              style={{ fill: "green" }}
              onClick={(event) => {
                props.history.push("/api/machines/register");
              }}
            ></Storage>{" "}
            Register machine
          </td>
        </tr>
      </table>
    </div>
  );
}

export default withRouter(Nav);
