import { React, useState, useEffect } from "react";
import {
  Checkbox,
  CircularProgress,
  Dialog,
  List,
  ListItem,
} from "@material-ui/core";
import { DeleteForever, Remove, Storage, Add } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import "./userManagement.css";

function UserManagement(props) {
  const [users, setUsers] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [error, setError] = useState(null);
  const [unassigned, setUnAssigned] = useState(false);
  const [machines, setMachines] = useState([]);
  const [chosenUser, setChosenUser] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users", {});

      setUsers([res.data.body]);
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const deleteUser = async (user_id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/users/${user_id}`,
        {}
      );
      // console.log(res.data.body);
      //   console.error(res.data.body);
      setUsers([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const getMachines = async () => {
    console.error(chosenUser)
    try {
      let res = null;
      if (unassigned)
        res = await axios.get(
          `http://localhost:3000/api/machine/unassigned`,
          {}
        );
      else res = await axios.get(`http://localhost:3000/api/machine`, {});
      // console.log(res.data.body);
      setMachines(res.data.body);
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const getMachinesToDelete = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/owned`,
        {}
      );

      setMachines(res.data.body);
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const handleAssignChange = async (value) => {
    setUnAssigned(value);
    // console.error(value);
    setMachines([]);
    getMachines();
  };

  const assignMachineToUser = async (user_id, machine_id) => {
    console.error(user_id);
    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/${user_id}/machines`,
        { machine_id: machine_id },
        {}
      );
      // console.log(res.data.body);
      setMachines([]);
      getMachines();
      setUsers([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const removeMachineFromUser = async (user_id, machine_id) => {
    try {
      console.error(user_id);
      const res = await axios.delete(
        `http://localhost:3000/api/users/${user_id}/machines/${machine_id}`,
        {}
      );
      // console.log(res.data.body);
      setMachines([]);
      getMachines();
      setUsers([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const handleClose = () => {
    setDialog(false);
    setUsers([]);
    getData();
  };

  if (!users.length) return <CircularProgress></CircularProgress>;
  return (
    <div className="main">
      {error && (
        <Alert
          severity="error"
          onClick={(event) => {
            setError(null);
          }}
        >
          {error.data.body}
        </Alert>
      )}

      {users[0].map((users) => (
        <div className="user">
          <h3>
            {users.name} {users.lastName}
          </h3>
          <h3>{users.email}</h3>
          <h3>Administrative: {users.isAdmin ? "true" : "false"}</h3>
          <h3>Machines assigned: {users.machines.length}</h3>
          <span>
            {" "}
            Delete user
            <DeleteForever
              style={{ fill: "red" }}
              className="icon"
              onClick={(event) => {
                deleteUser(users["_id"]);
              }}
            ></DeleteForever>
          </span>
          <span>
            {" "}
            Assign machine to user
            <Storage
              style={{ fill: "blue" }}
              className="icon"
              onClick={(event) => {
                setChosenUser(users._id);
                setDialog(true);
                getMachines();
              }}
            ></Storage>
          </span>
        </div>
      ))}

      <Dialog onClose={handleClose} open={dialog}>
        <span>
          {" "}
          unassigned only
          <Checkbox
            onChange={(event) => {
              handleAssignChange(event.target.checked);
            }}
          ></Checkbox>
        </span>

        <List>
          {machines.map((machines) => (
            <ListItem>
              <Add
                className="icon"
                style={{ fill: "green" }}
                onClick={(event) => {
                  assignMachineToUser(chosenUser, machines._id);
                }}
              ></Add>
              {machines.name} {machines.IP}
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
}

export default UserManagement;
