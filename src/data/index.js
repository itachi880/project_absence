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
export const GroupsDataStore = createStore({
  groups: [
    { createdAt: undefined, is_deleted: "", name: "", study_year: 0, updatedAt: undefined, __v: 0, _id: "" }


  ],
  pageCount: 0,
  finish: false,
});
export const studentsByGroup = createStore({
  dev106: [
    {
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
      displine_points: 0,
    },
  ],
});
export const absences = createStore({
  data: [
    {
      _id: "",
      student_id: "",
      group: "", //group id
      month: "", // Format: YYYY-MM
      absences_justifiees: 0,
      total_absences: 0,
      absences: [
        {
          date: 1, //1-31
          sessions: [], //[1,2,3,4]// session pare numero de 7issa
          justification_id: "", // id de fichies imkn ikon null
        },
      ],
    },
  ],
});
export const justificationsStore = createStore({
  data: [],
});
export const getServerLink = (path) => {
  return "http://localhost:5000/" + path;
};
export const roles = {
  generale_survience: "GS",
  formateur: "FR",
  etudient: "student",
};
export const statusCertif = { panding: "pending", valide: "validated", no_valide: "not validated" };
export const jwt_token = "jwt_token";
export const forbedenRoutesFor = {
  [roles.etudient]: ["/groups"],
  [roles.formateur]: [],
  [roles.generale_survience]: [],
};
export const loadingFlag = createStore({ state: false });
