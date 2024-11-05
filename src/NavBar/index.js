import { getServerLink, roles, userDataStore } from "../data";
import "./index.css";
export default function () {
  const [userData, setUserData] = userDataStore.useStore();
  const Options = {
    [roles.etudient]: <StudentOptions />,
    [roles.formateur]: <FROptions />,
    [roles.generale_survience]: <GS_Options />,
  };
  if (!userData.token)
    return (
      <nav className={"nav_bar"}>
        <OfpptLogo />
      </nav>
    );
  return (
    <nav className={"nav_bar"}>
      <div className={"section left"}>
        <div className="container">
          <span className="profile">
            <img src={userData.data.profile ? getServerLink("profile/" + userData.data.profile) : require("../assets/no-profile-picture-icon.webp")} alt="Profile" />
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
      <OfpptLogo />
      {Options[userData.data.role]}
    </nav>
  );
}
function OfpptLogo() {
  return (
    <div className="section center">
      <img className={"platform_logo"} alt="platform logo (ofppt)" src={require("../assets/ofppt.png")} />
    </div>
  );
}
function GS_Options() {
  const [userData, setUserData] = userDataStore.useStore();

  return <div className={"section rigth"}></div>;
}
function StudentOptions() {
  const [userData, setUserData] = userDataStore.useStore();

  return <div className={"section rigth"}>studens</div>;
}

function FROptions() {
  const [userData, setUserData] = userDataStore.useStore();

  return <div className={"section rigth"}>fr</div>;
}
