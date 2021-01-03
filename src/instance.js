import axios from "axios";

export default axios.create({
  headers: {
    "Content-Type": "application/json",
    "auth-token": localStorage.getItem("jwt"),
  },
});
