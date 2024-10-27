import "./index.css";
export default function () {
  return (
    <nav className={"nav_bar"}>
      <Left />
      <Center />
      <Rigth />
    </nav>
  );
}
function Center() {
  return (
    <div className="section center">
      <img className={"platform_logo"} src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png" />
    </div>
  );
}
function Left() {
  return (
    <div className={"section left"}>
      <img src="profile.jpg" alt="Profile" class="profile-pic" />
      <span class="profile-name">John Doe</span>
      <i className="fa-solid fa-right-from-bracket"></i>
    </div>
  );
}
function Rigth() {
  return <div className={"section rigth"}>options</div>;
}
