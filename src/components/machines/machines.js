import { React, useState, useEffect } from "react";
import { MenuItem, Select, CircularProgress } from "@material-ui/core";
import {
  PlayCircleFilled,
  Settings,
  PowerOff,
  FlashOff,
  Tune,
  DeleteForever,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import "./machines.css";

function Explore(props) {
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("all");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/machine/`, {});
      setMachines(res.data.body);
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const getAssignedMachines = async () => {
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
      setError(err.response);
    }
  };

  const bootMachine = async (machine_id) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/${machine_id}/chassis/power/on`,
        {}
      );
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const shutDown = async (machine_id) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/${machine_id}/chassis/power/soft`,
        {}
      );
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const powerOff = async (machine_id) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/${machine_id}/chassis/power/off`,
        {}
      );
    } catch (err) {
      console.error(err.response);
      setError(err.response);
    }
  };

  const bootParamSet = async (machine_id, param) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/machine/${machine_id}/chassis/bootdev/${param}`,
        {}
      );
    } catch (err) {
      console.error(err.response);
      setError(err.response);
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
          {error.data.body}
        </Alert>
      )}

      <Select
        defaultValue="other"
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
          <tr>
            <td>Name</td>
            <td>IP</td>
            <td>Port</td>
            <td>User</td>
            <td>Password</td>
          </tr>
          {machines.map((machines) => (
            <tr>
              <td>{machines.name}</td>
              <td>{machines.IP}</td>
              <td>{machines.port}</td>
              <td>{machines.user}</td>
              <td>{machines.password}</td>

              <td>
                <PlayCircleFilled
                  onClick={(event) => {
                    bootMachine(machines._id);
                  }}
                  style={{ fill: "brown" }}
                  className="icon"
                ></PlayCircleFilled>
              </td>
              <td>
                <PowerOff
                  onClick={(event) => {
                    powerOff(machines._id);
                  }}
                  style={{ fill: "brown" }}
                  className="icon"
                ></PowerOff>
              </td>
              <td>
                <Settings style={{ fill: "brown" }} className="icon"></Settings>
              </td>
              <td>
                <FlashOff
                  onClick={(event) => {
                    shutDown(machines._id);
                  }}
                  style={{ fill: "brown" }}
                  className="icon"
                ></FlashOff>
              </td>
              <td>
                <Tune style={{ fill: "brown" }} className="icon"></Tune>
              </td>
              <td>
                <DeleteForever
                  style={{ fill: "brown" }}
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
                    bootParamSet(machines._id, event.target.value);
                  }}
                >
                  <MenuItem value="none">none</MenuItem>
                  <MenuItem value="pxe">pxe</MenuItem>
                  <MenuItem value="disk">disk</MenuItem>
                  <MenuItem value="safe">safe</MenuItem>
                  <MenuItem value="diag">diag</MenuItem>
                  <MenuItem value="cdrom">cdrom</MenuItem>
                  <MenuItem value="bios">bios</MenuItem>
                  <MenuItem value="floppy">floppy</MenuItem>
                </Select>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}

export default Explore;
