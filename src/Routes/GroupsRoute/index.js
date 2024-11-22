import { Route, Routes } from "react-router-dom";
import ShowGroups from "./ShowGroups";
import AddGroup from "./AddGroup";

export default function () {
  return (
    <Routes>
      <Route index element={<ShowGroups />} />
      <Route path="add" element={<AddGroup />} />
    </Routes>
  );
}
