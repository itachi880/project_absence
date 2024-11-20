import axios from "axios";
import { getServerLink } from "../data";
export const login = async (login, password) => {
  if (!login || !password) return ["data incompleat", null];

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
  if (!token) return ["data incompleat", null];

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
export const getGroups = async (token, archived = false, pageNumber = 0) => {
  if (!token) return ["data incompleat", null];

  const result = [null, null];
  await axios
    .get(getServerLink("groups/getAll"), {
      params: {
        token,
        archived,
        pageNumber,
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
  if (!token || !id) return ["data incompleat", null];

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
  if (!token || !id) return ["data incompleat", null];

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
export const getGroupByID = async (token, id) => {
  if (!token || !id) return ["data incompleat", null];
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
export const getJustificationByID = async (id, token) => {
  if (!id || !token) return [true, null];
  const result = [null, null];
  await axios
    .get(getServerLink("certifications/getByID"), { params: { id, token } })
    .then((res) => {
      result[1] = res.data;
    })
    .catch((err) => {
      result[0] = err;
    });
  return result;
};
export const addStudent = async (first_name, last_name, cin, login, group, token) => {
  if (!token) return [true, null];
  const result = [null, null];
  await axios
    .post(getServerLink("students/add"), { first_name, last_name, cin, login, group, token, password: cin })
    .then((res) => {
      result[1] = res.data;
    })
    .catch((e) => {
      result[0] = e;
    });
  return result;
};
export const searchGroupsByName = async (query) => {
  if (!query) return [true, null];
  const result = [null, null];
  await axios
    .get(getServerLink("groups/searchGroups"), { params: { query } })
    .then((res) => {
      result[1] = res.data;
    })
    .catch((e) => {
      result[0] = e;
    });
  return result;
};
