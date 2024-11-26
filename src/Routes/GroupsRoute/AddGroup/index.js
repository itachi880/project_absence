import { useEffect, useRef, useState } from "react";
import { GroupsDataStore, loadingFlag, userDataStore } from "../../../data";
import { AddGroup, getGroups } from "../../../api/index";
import { Store } from "react-data-stores";
export default function () {
  const [groups, setGroups] = GroupsDataStore.useStore();
  const [formData, setFormData] = useState({
    name: "",
    studyYear: new Date().getFullYear() + "",
  });
  const [userData, setUserData] = userDataStore.useStore();
  const [loading, setLoadingFlag] = loadingFlag.useStore();
  const inputsControle = {
    error_message_info: useRef(""),
  };

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

  return (
    <div className="add-student">
      <div style={{ marginBottom: "20px" }}>
        <span className="error" ref={inputsControle.error_message_info}></span>
        <h1>add group</h1>
      </div>
      <div className="form">
        <div className="input">
          <span className={`input-titel ${formData.name.trim().length > 0 ? "input-full" : ""}`}> name</span>
          <input
            type="text"
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
        </div>
        <div className="input">
          <span className={`input-titel ${formData.studyYear > 0 ? "input-full" : ""}`}>study year</span>
          <input
            type="text"
            value={formData.studyYear}
            onChange={(e) => {
              setFormData({ ...formData, studyYear: e.target.value });
            }}
          />
        </div>

        <input
          type="submit"
          onClick={() => {
            console.log(formData);
            if (formData.name?.trim()?.length < 3 || (formData.studyYear?.trim()?.length < 3 && +formData.studyYear > 0)) return (inputsControle.error_message_info.current.innerHTML = "all fealds are required");
            setLoadingFlag({ state: true });
            AddGroup(formData.name, userData.token, formData.studyYear)
              .then((res) => {
                if (res[0]) return (inputsControle.error_message_info.current.innerHTML = res[0]?.data ?? res[0].message);
                setGroups({ groups: [...groups.groups, res[1]] });
                Store.navigateTo("/groups");
              })
              .then(() => setLoadingFlag({ state: false }));
          }}
          value="add"
          style={{ position: "relative" }}
        />
      </div>
    </div>
  );
}
