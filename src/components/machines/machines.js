import { React, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  MenuItem,
  Select,
  CircularProgress,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@material-ui/core";
import {
  PlayCircleFilled,
  Settings,
  PowerOff,
  FlashOff,
  Tune,
  DeleteForever,
  Check,
  Refresh,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import axios from "../../instance";
import "./machines.css";

function Explore(props) {
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("all");
  const [inProgress, setInProgress] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [sensor, setSensor] = useState([]);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [chosenMachine, setChosenMachine] = useState("");

  const [name, setNameField] = useState("");
  const [IP, setIPField] = useState("");
  const [user, setUserField] = useState("");
  const [password, setPasswordField] = useState("");
  const [scriptField, setScriptField] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const setSuccessTimeout = (machine) => {
    machine["operationSuccess"] = true;
    setTimeout(() => {
      machine["operationSuccess"] = false;
    }, 5000);
  };

  const handleOpenDialog = async (machine) => {
    await sensors(machine);
  };

  const handleClose = () => {
    setDialog(false);
  };

  const handleSettingsDialogOpen = (machine) => {
    setChosenMachine(machine);
    setSettingsDialog(true);
  };

  const handleSettingsDialogClose = (machine) => {
    setSettingsDialog(false);
  };

  const setName = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/machine/${chosenMachine._id}/name`,
        { name: name },
        {}
      );
      // console.error(res.data.body);
      setMachines([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body);
    }
  };

  const setIP = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/machine/${chosenMachine._id}/IP`,
        { IP: IP },
        {}
      );
      // console.error(res.data.body);
      setMachines([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body);
    }
  };

  const setUser = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/machine/${chosenMachine._id}/user`,
        { user: user },
        {}
      );
      // console.error(res.data.body);
      setMachines([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body);
    }
  };

  const setPassword = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/machine/${chosenMachine._id}/password`,
        { password: password },
        {}
      );

      console.error(res.data.body);
      setMachines([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body);
    }
  };

  const setScript = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/machine/${chosenMachine._id}/script`,
        { script: scriptField },
        {}
      );

      console.error(res.data.body);
      setMachines([]);
      getData();
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body);
    }
  };

  const getData = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/machine/`, {});

      const machines = res.data.body;

      for (let i = 0; i < machines.length; i++) {
        const status = await getMachineStatus(machines[i]);
        machines[i]["status"] = status;
      }

      setMachines(machines);
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body);
      if (err.response.status == 401) {
        props.history.push("/login");
      }
    }
  };

  const getAssignedMachines = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/owned`,
        {}
      );

      const machines = res.data.body;

      for (let i = 0; i < machines.length; i++) {
        const status = await getMachineStatus(machines[i]);
        machines[i]["status"] = status;
      }
      console.error(machines);
      setMachines(machines);
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const handleSearch = (value) => {
    if (value == "all") getData();
    else if (value == "assigned") getAssignedMachines();
  };

  const deleteMachine = async (machine_id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/machine/${machine_id}`,
        {}
      );
      setMachines([]);
      if (search == "all") getData();
      else if (search == "assigned") getAssignedMachines();
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body.stderr);
    }
  };

  const getMachineStatus = async (machine) => {
    setInProgress(true);
    machine["operationInProgress"] = true;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/${machine._id}/chassis/power/status`,
        {}
      );
      // console.error(res);
      machine["operationInProgress"] = false;
      return res.data.body["Chassis power status"];
      // setMachineStatus(res.da)
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body.stderr);
      return "err";
    } finally {
      machine["operationInProgress"] = false;
      setInProgress(false);
    }
  };

  const bootMachine = async (machine) => {
    setInProgress(true);
    machine["operationInProgress"] = true;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/${machine._id}/chassis/power/on`,
        {}
      );
      machine.status = "on";
      machine["operationInProgress"] = false;
      setMachines(...[machines]);
      setSuccessTimeout(machine);
    } catch (err) {
      console.error(err.response);
      setError(err.response.data.body.stderr);
    } finally {
      machine["operationInProgress"] = false;
      setInProgress(false);
    }
  };

  const shutDown = async (machine) => {
    setInProgress(true);
    machine["operationInProgress"] = true;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/${machine._id}/chassis/power/soft`,
        {}
      );
      setSuccessTimeout(machine);
      machine.status = "off";
      machine["operationInProgress"] = false;
      setMachines(...[machines]);
    } catch (err) {
      console.error(err.response.data.body.stderr);
      setError(err.response.data.body.stderr);
    } finally {
      machine["operationInProgress"] = false;
      setInProgress(false);
    }
  };

  const restartMachine = async (machine) => {
    setInProgress(true);
    machine["operationInProgress"] = true;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/${machine._id}/chassis/power/reset`,
        {}
      );
      setSuccessTimeout(machine);
      machine.status = "on";
      machine["operationInProgress"] = false;
      setMachines(...[machines]);
    } catch (err) {
      console.error(err.response.data.body.stderr);
      setError(err.response.data.body.stderr);
    } finally {
      machine["operationInProgress"] = false;
      setInProgress(false);
    }
  };

  const powerOff = async (machine) => {
    setInProgress(true);
    machine["operationInProgress"] = true;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/${machine._id}/chassis/power/off`,
        {}
      );
      setSuccessTimeout(machine);
      machine.status = "off";
      machine["operationInProgress"] = false;
      setMachines(...[machines]);
    } catch (err) {
      console.error(err.response.data.body.stderr);
      setError(err.response.data.body.stderr);
    } finally {
      machine["operationInProgress"] = false;
      setInProgress(false);
    }
  };

  const sensors = async (machine) => {
    setInProgress(true);
    machine["operationInProgress"] = true;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/${machine._id}/sensor`,
        {}
      );
      machine["operationInProgress"] = false;
      setSuccessTimeout(machine);
      setSensor(res.data.body);
      setDialog(true);
      // console.error(res.data.body);
    } catch (err) {
      console.error(err.response.data.body.stderr);
      setError(err.response.data.body.stderr);
    } finally {
      machine["operationInProgress"] = false;
      setInProgress(false);
    }
  };

  const bootParamSet = async (machine, param) => {
    setInProgress(true);
    machine["operationInProgress"] = true;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/${machine._id}/chassis/bootdev/${param}`,
        {}
      );
      setSuccessTimeout(machine);
      machine["operationInProgress"] = false;
    } catch (err) {
      console.error(err.response.data.body.stderr);
      setError(err.response.data.body.stderr);
    } finally {
      machine["operationInProgress"] = false;
      setInProgress(false);
    }
  };

  if (!machines) return <CircularProgress></CircularProgress>;
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

      <Select
        defaultValue="all"
        onChange={(event) => {
          setMachines([]);
          handleSearch(event.target.value);
          setSearch(event.target.value);
        }}
      >
        <MenuItem value="all">All machines</MenuItem>
        <MenuItem value="assigned">Assigned machines</MenuItem>
      </Select>

      <div className="">
        <table>
          <tr style={{ backgroundColor: "cornflowerblue" }}>
            <td>Name</td>
            <td>IP</td>
            <td>Port</td>
            <td>User</td>
            <td>Password</td>
            <td>Script</td>
            <td>Status</td>
          </tr>
          {machines.map((machines) => (
            <tr>
              <td>{machines.name}</td>
              <td>{machines.IP}</td>
              <td>{machines.port}</td>
              <td>{machines.user}</td>
              <td>{machines.password}</td>
              <td>{machines.scriptUsage ? "true" : "false"}</td>
              <td
                style={{
                  color:
                    machines.status == "on"
                      ? "green"
                      : machines.status == "off"
                      ? "orange"
                      : "red",
                }}
              >
                {machines.status}
              </td>
              <td>
                <PlayCircleFilled
                  onClick={(event) => {
                    bootMachine(machines);
                    // machines.status = 'on'
                    // setMachines([machines]);
                  }}
                  className="icon"
                ></PlayCircleFilled>
              </td>
              <td>
                <PowerOff
                  onClick={(event) => {
                    powerOff(machines);
                  }}
                  className="icon"
                ></PowerOff>
              </td>

              <td>
                <FlashOff
                  onClick={(event) => {
                    shutDown(machines);
                  }}
                  className="icon"
                ></FlashOff>
              </td>

              <td>
                <Refresh
                  onClick={(event) => {
                    restartMachine(machines);
                  }}
                  className="icon"
                ></Refresh>
              </td>
              <td>
                <Tune
                  className="icon"
                  onClick={(event) => {
                    handleOpenDialog(machines);
                  }}
                ></Tune>
              </td>
              <td>
                <Settings
                  onClick={(event) => {
                    handleSettingsDialogOpen(machines);
                  }}
                  className="icon"
                ></Settings>
              </td>
              <td>
                <DeleteForever
                  className="icon"
                  onClick={(event) => {
                    deleteMachine(machines._id);
                  }}
                ></DeleteForever>
              </td>
              <td>
                <Select
                  placeholder="boot dev"
                  onChange={(event) => {
                    bootParamSet(machines, event.target.value);
                  }}
                >
                  <MenuItem selected={true} value="none">
                    none
                  </MenuItem>
                  <MenuItem value="pxe">pxe</MenuItem>
                  <MenuItem value="disk">disk</MenuItem>
                  <MenuItem value="safe">safe</MenuItem>
                  <MenuItem value="diag">diag</MenuItem>
                  <MenuItem value="cdrom">cdrom</MenuItem>
                  <MenuItem value="bios">bios</MenuItem>
                  <MenuItem value="floppy">floppy</MenuItem>
                </Select>
              </td>
              <td>
                {machines["operationInProgress"] && (
                  <CircularProgress></CircularProgress>
                )}{" "}
                {machines["operationSuccess"] && (
                  <Check style={{ fill: "green" }}></Check>
                )}
              </td>
            </tr>
          ))}
        </table>
      </div>
      <Dialog
        onClose={(event) => {
          handleClose();
        }}
        open={dialog}
      >
        <DialogTitle>Sensors reading</DialogTitle>

        <List>
          <table>
            <tr style={{ backgroundColor: "cornflowerblue" }}>
              <td>Name</td>
              <td>Value</td>
              <td>Unit</td>
              <td>State</td>
              <td>High</td>
              <td>Critical</td>
            </tr>
            {sensor.map((sensor) => (
              <tr
                style={{
                  height: 50,
                  backgroundColor:
                    parseFloat(sensor[0][2]) > parseFloat(sensor[0][8])
                      ? "orange"
                      : "lightgreen",
                }}
              >
                <td style={{ columnWidth: 200, textAlign: "center" }}>
                  {sensor[0][0]}
                </td>
                <td style={{ fontWeight: "bold", textAlign: "center" }}>
                  {sensor[0][1]}
                </td>
                <td style={{ textAlign: "center" }}>{sensor[0][2]}</td>
                <td style={{ textAlign: "center" }}>{sensor[0][3]}</td>
                <td style={{ textAlign: "center" }}>
                  {(sensor[0][8] + "").trim() != "na" && sensor[0][8]}
                </td>
                <td style={{ textAlign: "center" }}>
                  {(sensor[0][9] + "").trim() != "na" && sensor[0][9]}
                </td>
              </tr>
            ))}
          </table>
        </List>
      </Dialog>

      <Dialog
        open={settingsDialog}
        onClose={(event) => {
          handleSettingsDialogClose(machines);
        }}
      >
        <DialogTitle>Machine credentials modifier</DialogTitle>
        <DialogContent>
          <span style={{ display: "block" }}>
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
          <span style={{ display: "block" }}>
            <TextField
              label="IP"
              margin="dense"
              onChange={(event) => {
                setIPField(event.target.value);
              }}
            ></TextField>
            <Button
              onClick={(event) => {
                setIP();
              }}
            >
              Update
            </Button>
          </span>
          <span style={{ display: "block" }}>
            <TextField
              label="user"
              margin="dense"
              onChange={(event) => {
                setUserField(event.target.value);
              }}
            ></TextField>
            <Button
              onClick={(event) => {
                setUser();
              }}
            >
              Update
            </Button>
          </span>
          <span style={{ display: "block" }}>
            <TextField
              label="password"
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
          <span style={{ display: "block" }}>
            <TextField
              label="script"
              margin="dense"
              onChange={(event) => {
                setScriptField(event.target.value);
              }}
            ></TextField>
            <Button
              onClick={(event) => {
                setScript();
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

export default withRouter(Explore);
