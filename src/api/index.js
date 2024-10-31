import axios from "axios";
import { getServerLink } from "../data";
export const login = async (login, password) => {
  const result = [null, null];
  await axios
    .post(getServerLink("login/email"), { login, password })
    .then((data) => {
      result[1] = data.data;
    })
    .catch((err) => {
      result[0] = err;
    });
  return result;
};
export const auth_token = async (token) => {
  const result = [null, null];
  await axios
    .post(getServerLink("login/token"), { token })
    .then((data) => {
      result[1] = data.data;
    })
    .catch((err) => {
      result[0] = err;
    });
  return result;
};
