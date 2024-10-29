import { useRef, useState } from "react";
import "./index.css";
export default function () {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [passwordVisible, setPassVisibility] = useState(false);
  const inputsControle = {
    password: useRef(""),
  };
  return (
    <div className="login">
      <h1>Sign in</h1>
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
          onClick={() => {
            console.log(formData);
          }}
          value="sign in"
        />
      </div>
    </div>
  );
}
