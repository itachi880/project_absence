import { getServerLink, userDataStore } from "../data";
import "./index.css";
export default function () {
  const [userData, setUserData] = userDataStore.useStore();
  if (!userData.token)
    return (
      <nav className={"nav_bar"}>
        <Center />
      </nav>
    );
  return (
    <nav className={"nav_bar"}>
      <div className={"section left"}>
        <div className="container">
          <span className="profile">
            <img src={userData.data.profile ? getServerLink("profile_image/" + userData.data.profile) : require("../assets/no-profile-picture-icon.webp")} alt="Profile" />
            <span className="profile-name">{userData.data.first_name + " " + userData.data.last_name}</span>
          </span>
          <i
            className="fa-solid fa-right-from-bracket"
            title="LOG OUT"
            onClick={() => {
              setUserData({});
            }}
          ></i>
        </div>
      </div>
      <Center />
      <div className={"section rigth"}>options</div>
    </nav>
  );
}
function Center() {
  return (
    <div className="section center">
      <img className={"platform_logo"} alt="platform logo (ofppt)" src={require("../assets/ofppt.png")} />
    </div>
  );
}
