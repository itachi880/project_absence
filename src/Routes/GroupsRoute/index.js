import { Route, Routes } from "react-router-dom";
import ShowGroups from "./ShowGroups";
import AddGroup from "./AddGroup";
import { Update } from "./ShowGroups/updateGroup";

export default function () {
  return (
    <Routes>
      <Route index element={<ShowGroups />} />
      <Route path="add" element={<AddGroup />} />
      <Route path="update/:id" element={<Update />} />
    </Routes>
  );
}
