import { createStore } from "react-data-stores";

export const userDataStore = createStore({
  token: undefined,
  data: {
    group: null,
    _id: "",
    first_name: "",
    last_name: "",
    login: "",
    cin: "",
    justification_days_left: 0,
    absences: [],
    is_deleted: false,
    role: "",
    profile: null,
  },
});
export const getServerLink = (path) => {
  return "http://localhost:5000/" + path;
};
export const roles = {
  generale_survience: "GS",
  formateur: "FR",
  etudient: "student",
};
export const jwt_token = "jwt_token";
