import { useRef, useState } from "react";

export default function () {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const loadingBarRef = useRef("");
  const inputsControle = {
    error_message_info: useRef(""),
  };
  return (
    <div className="login">
      <div className="loading-bar" ref={loadingBarRef}></div>
      <div>
        <span className="error" ref={inputsControle.error_message_info}></span>
        <h1>inscription</h1>
      </div>
      <div className="form">
        <div className="input">
          <span className={`input-titel ${formData.login.trim().length > 0 ? "input-full" : ""}`}>first name</span>
          <input
            type="text"
            value={formData.login}
            onChange={(e) => {
              setFormData({ ...formData, login: e.target.value });
            }}
          />
        </div>
        <div className="input">
          <span className={`input-titel ${formData.login.trim().length > 0 ? "input-full" : ""}`}>last name</span>
          <input
            type="text"
            value={formData.login}
            onChange={(e) => {
              setFormData({ ...formData, login: e.target.value });
            }}
          />
        </div>
        <div className="input">
          <span className={`input-titel ${formData.login.trim().length > 0 ? "input-full" : ""}`}>Email</span>
          <input
            type="text"
            value={formData.login}
            onChange={(e) => {
              setFormData({ ...formData, login: e.target.value });
            }}
          />
        </div>
        <div className="input">
          <span className={`input-titel ${formData.login.trim().length > 0 ? "input-full" : ""}`}>CIN</span>
          <input
            type="text"
            value={formData.login}
            onChange={(e) => {
              setFormData({ ...formData, login: e.target.value });
            }}
          />
        </div>
        <input
          type="submit"
          onClick={async () => {
            if (formData.login.trim().length < 3 || formData.password.trim().length < 4) return (inputsControle.error_message_info.current.innerHTML = "all fealds are required and password must contains minimum of 4 characters");
            loadingBarRef.current.classList?.add("active");
            loadingBarRef.current.classList?.remove("active");
          }}
          value="inscrire"
        />
      </div>
    </div>
  );
}
