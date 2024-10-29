import "./App.css";
import NavBar from "./NavBar";
import Login from "./Login";
import { Route, Routes, useNavigate } from "react-router-dom";
import { userDataStore } from "./data";
import { useEffect } from "react";
function App() {
  const navigator = useNavigate();
  const [userData, _] = userDataStore.useStore();
  useEffect(() => {
    if (!userData.token) navigator("/login");
  }, [userData]);
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route element={<Login />} path="/login" />
      </Routes>
    </div>
  );
}

export default App;
