import { useRef, useState } from "react";
import "./index.css";
import { login } from "../api";
import { jwt_token, userDataStore } from "../data";
import { Store } from "react-data-stores";

export default function () {
  const [_, setUserData] = userDataStore.useStore();

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [passwordVisible, setPassVisibility] = useState(false);
  const inputsControle = {
    password: useRef(""),
    error_message_info: useRef(""),
  };
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
            onClick={() => {
              setPassVisibility(!passwordVisible);
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
            if (formData.login.trim().length < 3 || formData.password.trim().length < 4) return (inputsControle.error_message_info.current.innerHTML = "all fealds are required and password must contains minimum of 4 characters");
            const [error, data] = await login(formData.login, formData.password);
            if (error) return (inputsControle.error_message_info.current.innerHTML = error.response?.data || error.message);
            setUserData(data);
            localStorage.setItem(jwt_token, data.token);
            Store.navigateTo("/");
          }}
          value="sign in"
        />
      </div>
    </div>
  );
}
