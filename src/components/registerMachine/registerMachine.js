import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { TextField, Button, Checkbox } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import "./register.css";

function RegisterMachine(props) {
  const [name, setName] = useState("");
  const [IP, setIP] = useState("");
  const [port, setPort] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [scriptUsage, setScriptUsage] = useState(false);
  const [scriptCommand, setScriptCommand] = useState("");

  function validateForm() {
    return (
      name.length > 0 &&
      IP.length > 0 &&
      port.length > 0 &&
      user.length > 0 &&
      password.length > 0
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/machine",
        JSON.stringify({
          name: name,
          IP: IP,
          port: port,
          user: user,
          password: password,
          scriptUsage: scriptUsage,
          script: scriptCommand
        })
      );
      props.history.push("/api/machines");
    } catch (err) {
      console.error(err.response.body);
      setError(err.response.body);
    }
  }

  return (
    <div className="main">
      {error && (
        <Alert
          severity="error"
          onClick={(event) => {
            setError(null);
            event.preventDefault();
          }}
        >
          {error}
        </Alert>
      )}
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        className="form"
      >
        <TextField
          label="name"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <TextField
          label="IP"
          onChange={(event) => {
            setIP(event.target.value);
          }}
        />
        <TextField
          label="port"
          onChange={(event) => {
            setPort(event.target.value);
          }}
        />
        <TextField
          label="user"
          onChange={(event) => {
            setUser(event.target.value);
          }}
        />
        <TextField
          label="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <span>
          Run via script?{" "}
          <Checkbox
            onChange={(event) => {
              setScriptUsage(event.target.checked);
            }}
          ></Checkbox>
        </span>

        <TextField
          disabled={!scriptUsage}
          label="script"
          onChange={(event) => {
            setScriptCommand(event.target.value);
          }}
        ></TextField>

        <Button type="submit" disabled={!validateForm()}>
          Register machine
        </Button>
      </form>
    </div>
  );
}

export default withRouter(RegisterMachine);
