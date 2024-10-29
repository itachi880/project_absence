import { useRef, useState } from "react";
import "./index.css";
import { login } from "../api";
import { userDataStore } from "../data";

export default function () {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [passwordVisible, setPassVisibility] = useState(false);
  const inputsControle = {
    password: useRef(""),
    error_message_info: useRef(""),
  };
  const [userData, setUserData] = userDataStore.useStore();
  return (
    <div className="login">
      <div>
        <span className="error" ref={inputsControle.error_message_info}></span>
        <h1>Sign in</h1>
      </div>
      <div className="form">
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
        <div className="input password">
          <input
            type={passwordVisible ? "text" : "password"}
            ref={inputsControle.password}
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
          <span className={`input-titel ${formData.password.trim().length > 0 ? "input-full" : ""}`}>Password</span>
          <span
            onClick={(e) => {
              console.log(e.target.innerHTML.toLowerCase());
              if (passwordVisible) return setPassVisibility(false);
              setPassVisibility(true);
            }}
          >
            {passwordVisible ? "Hide" : "Show"}
          </span>
        </div>
        <div className="options">
          <span>Forgot password?</span>
        </div>
        <input
          type="submit"
          onClick={async () => {
            const [error, data] = await login(formData.login, formData.password);
            if (error) {
              inputsControle.error_message_info.current.innerHTML = error.response.data.message || error.message;
              return;
            }
            setUserData(data);
          }}
          value="sign in"
        />
      </div>
    </div>
  );
}
