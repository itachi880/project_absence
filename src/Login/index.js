import { useState } from "react";
import "./index.css";
export default function () {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  return (
    <div className="login">
      <h1>Sign in</h1>
      <div className="form">
        <div className="input">
          <input
            type="text"
            value={formData.login}
            onChange={(e) => {
              setFormData({ ...formData, login: e.target.value });
            }}
            placeholder="Email"
          />
        </div>
        <div className="input">
          <input
            type="text"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
            placeholder="Password"
          />
          <span>Show</span>
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
