import { Route, Routes } from "react-router-dom";
import ShowGroups from "./ShowGroups";

export default function () {
  return (
    <Routes>
      <Route index element={<ShowGroups />} />
    </Routes>
  );
}
