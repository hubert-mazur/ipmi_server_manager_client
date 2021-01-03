import { React, useState, useEffect } from "react";
import {
  Checkbox,
  CircularProgress,
  Dialog,
  List,
  ListItem,
  DialogTitle,
  TextField,
  DialogContent,
  Button,
} from "@material-ui/core";
import {
  DeleteForever,
  Remove,
  Storage,
  Add,
  Settings,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import axios from "../../instance";
import "./userManagement.css";

function UserManagement(props) {
  const [users, setUsers] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [error, setError] = useState(null);
  const [unassigned, setUnAssigned] = useState(false);
  const [machines, setMachines] = useState([]);
  const [chosenUser, setChosenUser] = useState(null);
  const [deletionDialog, setDeletionDialog] = useState(false);
  const [modifyDialog, setModifyDialog] = useState(false);

  const [name, setNameField] = useState("");
  const [lastName, setLastNameField] = useState("");
  const [email, setEmailField] = useState("");
  const [oldPassword, setOldPasswordField] = useState("");
  const [password, setPasswordField] = useState("");

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
    console.error(user_id);
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/users/${user_id}`,
        {}
      );
      console.log(res.data.body);
      //   console.error(res.data.body);
      setUsers([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const handleOpenDialog = async (user) => {
    setChosenUser(user);
    await getMachines();
    setDialog(true);
  };

  const handleOpenDeletionDialog = async (user) => {
    setChosenUser(user);
    await getMachinesToDelete(user);
    setDeletionDialog(true);
  };

  const handleCloseDeletionDialog = async (user) => {
    setDeletionDialog(false);
  };

  const handleOpenModifyDialog = async (user) => {
    setChosenUser(user);
    setModifyDialog(true);
  };

  const handleCloseModifyDialog = async (user) => {
    setModifyDialog(false);
  };

  const setName = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/users/${chosenUser._id}/name`,
        { name: name },
        {}
      );
      // console.error(res.data.body);
      setUsers([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body);
    }
  };

  const setLastName = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/users/${chosenUser._id}/lastName`,
        { lastName: lastName },
        {}
      );
      // console.error(res.data.body);
      setUsers([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body);
    }
  };

  const setEmail = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/users/${chosenUser._id}/email`,
        { email: email },
        {}
      );
      // console.error(res.data.body);
      setUsers([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body);
    }
  };

  const setPassword = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/users/${chosenUser._id}/password`,
        { oldPassword: oldPassword, password: password },
        {}
      );
      // console.error(res.data.body);
      setUsers([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body);
    }
  };

  const getMachines = async (assignment = unassigned) => {
    try {
      let res = null;
      if (assignment)
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

  const getMachinesToDelete = async (user) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/owned/${user._id}`,
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
    await getMachines(value);
  };

  const assignMachineToUser = async (user, machine_id) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/${user._id}/machines`,
        { machine_id: machine_id },
        {}
      );
      // console.log(res.data.body);
      setMachines([]);
      await getMachines();
      setUsers([]);
      await getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const removeMachineFromUser = async (user, machine_id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/users/${user._id}/machines/${machine_id}`,
        {}
      );
      // console.log(res.data.body);
      setMachines([]);
      await getMachinesToDelete(user);
      setUsers([]);
      await getData();
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
          {error}
        </Alert>
      )}
      <table>
        <tr style={{ backgroundColor: "cornflowerblue" }}>
          <td>Name</td>
          <td>Last name</td>
          <td>email</td>
          <td>Administrator</td>
          <td>Machines</td>
        </tr>
        {users[0].map((users) => (
          <tr>
            <td>{users.name}</td>
            <td>{users.lastName}</td>
            <td>{users.email}</td>
            <td>{users.isAdmin ? "true" : "false"}</td>
            <td>{users.machines.length}</td>

            <td>
              <Storage
                style={{ fill: "green" }}
                className="icon"
                onClick={(event) => {
                  handleOpenDialog(users);
                }}
              ></Storage>
            </td>
            <td>
              <Storage
                style={{ fill: "red" }}
                className="icon"
                onClick={(event) => {
                  handleOpenDeletionDialog(users);
                }}
              ></Storage>
            </td>
            <td>
              <Settings
                style={{ fill: "brown" }}
                className="icon"
                onClick={(event) => {
                  handleOpenModifyDialog(users);
                }}
              ></Settings>
            </td>
            <td>
              <DeleteForever
                style={{ fill: "red" }}
                className="icon"
                onClick={(event) => {
                  deleteUser(users["_id"]);
                }}
              ></DeleteForever>
            </td>
          </tr>
        ))}
      </table>

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

      <Dialog onClose={handleCloseDeletionDialog} open={deletionDialog}>
        <List>
          {machines.map((machines) => (
            <ListItem>
              <Remove
                className="icon"
                style={{ fill: "red" }}
                onClick={(event) => {
                  removeMachineFromUser(chosenUser, machines._id);
                }}
              ></Remove>
              {machines.name} {machines.IP}
            </ListItem>
          ))}
        </List>
      </Dialog>

      <Dialog
        open={modifyDialog}
        onClose={(event) => {
          handleCloseModifyDialog(machines);
        }}
      >
        <DialogTitle>User credentials modifer </DialogTitle>
        <DialogContent>
          <span style={{display: "block"}}>
          <TextField
            label="name"
            margin="dense"
            onChange={(event) => {
              setNameField(event.target.value);
            }}
          ></TextField>
          <Button
            onClick={(event) => {
              setName();
            }}
          >
            Update
          </Button>
          </span>
          <span style={{display: "block"}}>
          <TextField
            label="lastName"
            margin="dense"
            onChange={(event) => {
              setLastNameField(event.target.value);
            }}
          ></TextField>
          <Button
            onClick={(event) => {
              setLastName();
            }}
          >
            Update
          </Button>
          </span>
          <span style={{display: "block"}}>
          <TextField
            label="email"
            margin="dense"
            onChange={(event) => {
              setEmailField(event.target.value);
            }}
          ></TextField>
          <Button
            onClick={(event) => {
              setEmail();
            }}
          >
            Update
          </Button>
          </span>
          <span style={{display: "block"}}>
          <TextField
            label="oldPassword"
            margin="dense"
            onChange={(event) => {
              setOldPasswordField(event.target.value);
            }}
          ></TextField>

          <TextField
            label="newPassword"
            margin="dense"
            onChange={(event) => {
              setPasswordField(event.target.value);
            }}
          ></TextField>
          <Button
            onClick={(event) => {
              setPassword();
            }}
          >
            Update
          </Button>
          </span>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserManagement;
