import { Route, Routes } from "react-router-dom";
import { userDataStore } from "../../data";
import ShowUsersByGroupID from "./ShowUsersByGroupID";
import ShowUserByID from "./ShowUserByID";

export default function () {
  const [userDataHere, setUserData1] = userDataStore.useStore();

  return (
    <Routes>
      <Route index element={<> user</>} />
      <Route
        path="add"
        element={(() => {
          return <h1>add user</h1>;
        })()}
      />
      <Route path="/show/group/:id" element={<ShowUsersByGroupID />} />
      <Route path="/show/:id/from/:group" element={<ShowUserByID />} />
    </Routes>
  );
}
