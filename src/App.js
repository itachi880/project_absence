import "./App.css";
import NavBar from "./NavBar";
import Login from "./Login";
import { Route, Routes, useNavigate } from "react-router-dom";
import { userDataStore } from "./data";
import { useEffect } from "react";
import { Store } from "react-data-stores";
function App() {
  Store.navigateTo = useNavigate();
  const [userData, _] = userDataStore.useStore();
  useEffect(() => {
    console.log(userData);
    if (!userData.token) Store.navigateTo("/login");
    else Store.navigateTo("/");
  }, [userData]);
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<>not found</>} path="/*" />
      </Routes>
    </div>
  );
}

export default App;
