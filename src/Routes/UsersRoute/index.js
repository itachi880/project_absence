import { Route, Routes } from "react-router-dom";

export default function () {
  return (
    <Routes>
      <Route index element={<> user</>} />
      <Route path="add" element={<>add user</>} />
    </Routes>
  );
}
