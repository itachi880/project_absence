import "./App.css";
import NavBar from "./NavBar";
import Login from "./Login";
import { Route, Routes, useNavigate } from "react-router-dom";
import { jwt_token, userDataStore } from "./data";
import { useEffect } from "react";
import { Store } from "react-data-stores";
import { auth_token } from "./api";
import UsersRoute from "./Routes/UsersRoute";
import GroupsRoute from "./Routes/GroupsRoute";

function App() {
  Store.navigateTo = useNavigate();
  const [userData, setUserData] = userDataStore.useStore();
  async function checkUser_JWT_Localstorage() {
    let [error, data] = [null, null];
    if (!localStorage.getItem(jwt_token)) return [true, null];
    [error, data] = await auth_token(localStorage.getItem(jwt_token));
    if (error) return;
    setUserData({ token: localStorage.getItem(jwt_token), data: data.data });
  }
  useEffect(() => {
    checkUser_JWT_Localstorage();
  }, []);
  useEffect(() => {
    if (!userData.token) return Store.navigateTo("/login" + "?backLink=" + window.location.pathname);
    const backLink = new URLSearchParams(window.location.search);
    Store.navigateTo(backLink.get("backLink") || "/");
    // if (forbedenRoutesFor[userData.data.role].includes(window.location.pathname)) {
    //   Store.navigateTo("/");
    //   return;
    // }
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
        <Route path="/groups/*" element={<GroupsRoute />} />
        <Route path="/users/*" element={<UsersRoute />} />
        <Route element={<>not found</>} path="/*" />
      </Routes>
    </div>
  );
}

export default App;
