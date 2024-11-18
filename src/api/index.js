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
export const getGroups = async (token, archived = false) => {
  if (!token) return ["data incompleat", null];

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
