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
export const getGroups = async (token, archived = false) => {
  const result = [null, null];
  await axios
    .get(getServerLink("groups/getAll"), {
      params: {
        token,
        archived,
      },
    })
    .then((data) => {
      result[1] = data.data;
    })
    .catch((err) => {
      result[0] = err;
    });
  return result;
};
export const getUsersByGroupID = async (id, token) => {
  const result = [null, null];
  await axios
    .get(getServerLink("students/getByGroupID"), {
      params: {
        token,
        id,
      },
    })
    .then((data) => {
      result[1] = data.data;
    })
    .catch((err) => {
      result[0] = err;
    });
  return result;
};
export const getUserAbsenceByID = async (token, id) => {
  const result = [null, null];

  await axios
    .get(getServerLink("absence/getByID"), {
      params: {
        token,
        id,
      },
    })
    .then((res) => {
      result[1] = res.data;
    })
    .catch((e) => {
      result[0] = e;
    });

  return result;
};
// get group id
export const getGroupByID = async (token, id) => {
  const result = [null, null];

  await axios
    .get(getServerLink("groups/getByID"), {
      params: {
        token,
        id,
      },
    })
    .then((res) => {
      result[1] = res.data;
    })
    .catch((e) => {
      result[0] = e;
    });

  return result;
};
