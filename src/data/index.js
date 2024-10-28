import { createStore } from "react-data-stores";
export const userDataStore = createStore({
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWU3MTZiNGY4MjdmNDQwMjNjNmJmYyIsInJvbGUiOiJHUyIsImlhdCI6MTczMDA1MTAxNiwiZXhwIjoxNzMwMTM3NDE2fQ.zv3_ibYP_kg9daeOFL_BaZs235s66gPS22RyOpOuF2A",
  data: {
    group: null,
    _id: "671e716b4f827f44023c6bfc",
    first_name: "Alice",
    last_name: "Johnson",
    login: "alice.johnson",
    cin: "CIN123456",
    justification_days_left: 10,
    absences: [],
    is_deleted: false,
    role: "GS",
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
