import { Route, Routes } from "react-router-dom";
import { userDataStore } from "../../data";
import ShowUsersByGroupID from "./ShowUsersByGroupID";
import ShowUserByID from "./ShowUserByID";
import AddStudents from "./AddStudents";

export default function () {
  const [userDataHere, setUserData1] = userDataStore.useStore();

  return (
    <Routes>
      <Route index element={<> user</>} />
      <Route path="/add" element={<AddStudents />} />
      <Route path="/show/group/:id" element={<ShowUsersByGroupID />} />
      <Route path="/show/:id/from/:group" element={<ShowUserByID />} />
    </Routes>
  );
}
