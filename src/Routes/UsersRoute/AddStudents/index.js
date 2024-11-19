import { useEffect, useRef, useState } from "react";
import { GroupsDataStore, jwt_token, loadingFlag, userDataStore } from "../../../data";
import { addStudent, getGroups } from "../../../api/index";
import { searchGroupsByName } from "../../../api/index";
import "./index.css";
export default function () {
  const [groups, setGroups] = GroupsDataStore.useStore();
  const [formData, setFormData] = useState({
    login: "",
    first_name: "",
    last_name: "",
    cin: "",
    group: "",
  });
  const [userData, setUserData] = userDataStore.useStore();
  const [loading, setLoadingFlag] = loadingFlag.useStore();
  const inputsControle = {
    error_message_info: useRef(""),
  };
  const [search, setSearch] = useState([]);
  useEffect(() => {
    getGroups(userData.token, false).then((res) => {
      if (res[0]) return;
      const exist = [];
      setGroups(
        {
          groups: [...res[1].groups, ...groups.groups].filter((group) => {
            if (!exist.includes(group._id)) {
              exist.push(group._id);
              return true;
            }
          }),
        },
        false
      );
    });
  }, []);
  const handleSearch = async (value) => {
    if (value.trim().length < 2) return;
    const result = search.filter((obj) => obj.name.toLowerCase().includes(value.toLowerCase()));
    if (result.length > 0) {
      console.log("Search results local:", result);
      return;
    }
    const [error, data] = await searchGroupsByName(value);
    if (error) return console.error("Error searching groups:", error);
    setSearch({ ...search, [value.toLowerCase().trim()]: data, keys: [...search.keys, value.toLowerCase().trim()] });
    console.log("Search results server:", data);
  };
  return (
    <div className="add-student">
      <div>
        <span className="error" ref={inputsControle.error_message_info}></span>
        <h1>inscription</h1>
      </div>
      <div className="form">
        <div className="input">
          <span className={`input-titel ${formData.first_name.trim().length > 0 ? "input-full" : ""}`}>first name</span>
          <input
            type="text"
            onChange={(e) => {
              setFormData({ ...formData, first_name: e.target.value });
            }}
          />
        </div>
        <div className="input">
          <span className={`input-titel ${formData.last_name.trim().length > 0 ? "input-full" : ""}`}>last name</span>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => {
              setFormData({ ...formData, last_name: e.target.value });
            }}
          />
        </div>
        <div className="input">
          <span className={`input-titel ${formData.login.trim().length > 0 ? "input-full" : ""}`}>Email</span>
          <input
            type="text"
            onChange={(e) => {
              setFormData({ ...formData, login: e.target.value });
            }}
          />
        </div>
        <div className="input">
          <span className={`input-titel ${formData.cin.trim().length > 0 ? "input-full" : ""}`}>CIN</span>
          <input
            type="text"
            onChange={(e) => {
              setFormData({ ...formData, cin: e.target.value });
            }}
          />
        </div>
        <div className="input">
          <select>
            <option hidden selected>
              selectionner le groupe
            </option>
            {groups.groups.map((e) => {
              return <option value={e._id}>{e.name}</option>;
            })}
          </select>
        </div>
        <datalist id="currentsearch">
          {currentSearch.map((e) => (
            <option>{e.name}</option>
          ))}
        </datalist>
        <input
          type="submit"
          onClick={() => {
            if (formData.login?.trim()?.length < 3 || formData.cin?.trim()?.length < 3 || formData.first_name?.trim()?.length < 3 || formData.last_name?.trim()?.length < 3 || formData.group?.trim()?.length < 3) return (inputsControle.error_message_info.current.innerHTML = "all fealds are required and password must contains minimum of 4 characters");
            setLoadingFlag({ state: true });

            addStudent(formData.first_name, formData.last_name, formData.cin, formData.login, formData.group, userData.token)
              .then(console.log)
              .then(() => setLoadingFlag({ state: false }));
          }}
          value="add"
          style={{ position: "relative" }}
        />
      </div>
    </div>
  );
}
