import React, { useState } from "react";
import { Route } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import "./login.css";
import axios from "axios";

export default function (props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/login",
        JSON.stringify({ email: email, password: password })
      );
      localStorage.setItem("jwt", res.data);
      props.history.push("/api/users");
    } catch (err) {
      console.log(err.response.data.body);
      setError(err.response.data.body);
    }
  }

  return (
    <div className="Login">
      {error && (
        <Alert
          severity="error"
          onClick={(event) => {
            setError(null);
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
          id="email"
          label="email"
          type="email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <TextField
          id="password"
          label="password"
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <Button type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </form>
    </div>
  );
}
