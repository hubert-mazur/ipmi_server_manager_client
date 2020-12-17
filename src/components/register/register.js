import React, { useState } from "react";
import { TextField, Button, Checkbox } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import "./register.css";

export default function (props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState(null);

  function validateForm() {
    return (
      email.length > 0 &&
      password.length > 0 &&
      name.length > 0 &&
      lastName.length > 0
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/register",
        JSON.stringify({
          email: email,
          password: password,
          name: name,
          lastName: lastName,
          admin: admin,
        })
      );

      props.history.push("/login");
    } catch (err) {
      if (err) {
        console.error(err.response.body);
        setError(err.response.body);
      }
    }
  }

  return (
    <div className="Login">
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
          id="name"
          label="name"
          type="name"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <TextField
          id="lastName"
          label="lastName"
          type="lastName"
          onChange={(event) => {
            setLastName(event.target.value);
          }}
        />
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
        <span>
          {" "}
          Administrative privileges{" "}
          <Checkbox
            onChange={(event) => {
              setAdmin(event.target.checked);
            }}
          ></Checkbox>
        </span>

        <Button type="submit" disabled={!validateForm()}>
          Register
        </Button>
      </form>
    </div>
  );
}
