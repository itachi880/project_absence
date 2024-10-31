import "./App.css";
import NavBar from "./NavBar";
import Login from "./Login";
import { Route, Routes, useNavigate } from "react-router-dom";
import { jwt_token, userDataStore } from "./data";
import { useEffect } from "react";
import { Store } from "react-data-stores";
import { auth_token } from "./api";

function App() {
  Store.navigateTo = useNavigate();
  const [userData, setUserData] = userDataStore.useStore();
  async function checkUser_JWT_Localstorage() {
    const [error, data] = await auth_token(localStorage.getItem("jwt_token"));
    if (error) return Store.navigateTo("/login");
    setUserData({ token: localStorage.getItem(jwt_token), data: data.data });
    Store.navigateTo("/");
  }
  useEffect(() => {
    checkUser_JWT_Localstorage();
  }, []);
  useEffect(() => {
    if (!userData.token) Store.navigateTo("/login");
  }, [userData]);
  return (
    <div className="App">
      <NavBar />
      {/* <BarChart
        container_html_properties={{ style: { width: "500px", hight: "100px" } }}
        data={[
          {
            id: 2,
            group_name: "dev101",
            avg_note: 20,
            color: "red",
          },
          {
            id: 3,
            group_name: "dev102",
            avg_note: 10,
            color: "green",
          },
          {
            id: 3,
            group_name: "dev103",
            avg_note: 10,
            color: "green",
          },
          {
            id: 3,
            group_name: "dev104",
            avg_note: 10,
            color: "green",
          },
          {
            id: 1,
            group_name: "dev105",
            color: "black",
            avg_note: 20,
          },
        ]}
        x_axes={"group_name"}
        y_axes={"avg_note"}
        PosibleColors={[
          {
            text: "Urgent",
            fillStyle: "red",
            strokeStyle: "black",
            lineWidth: 2,
            hidden: false,
          },
          {
            text: "Warning",
            fillStyle: "black",
            strokeStyle: "black",
            lineWidth: 2,
            hidden: false,
          },
          {
            text: "Safe",
            fillStyle: "green",
            strokeStyle: "black",
            lineWidth: 2,
            hidden: false,
          },
        ]}
      /> */}
      <Routes>
        <Route element={<Login />} path="/login" />

        <Route element={<>not found</>} path="/*" />
      </Routes>
    </div>
  );
}

export default App;
