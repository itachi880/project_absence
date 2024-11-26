import { useRef, useState } from "react";
import { GroupsDataStore, loadingFlag, userDataStore } from "../../../data";
import { updateGroupe } from "../../../api";
import { useParams } from "react-router-dom";
import { Store } from "react-data-stores";
export function Update() {
  const [userData, setUserData] = userDataStore.useStore();
  const [groups, setGroups] = GroupsDataStore.useStore();
  const [loading, setLoadingFlag] = loadingFlag.useStore();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    studyYear: new Date().getFullYear() + "",
  });
  const inputsControle = {
    error_message_info: useRef(""),
  };

  return (
    <>
      <div className="add-student">
        <div style={{ marginBottom: "20px" }}>
          <span className="error" ref={inputsControle.error_message_info}></span>
          <h1>update group</h1>
        </div>
        <div className="form">
          <div className="input">
            <span className={`input-titel ${formData.name.trim().length > 0 ? "input-full" : ""}`}> name</span>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="input">
            <span className={`input-titel ${formData.studyYear > 0 ? "input-full" : ""}`}>study year</span>
            <input type="text" value={formData.studyYear} onChange={(e) => setFormData({ ...formData, studyYear: e.target.value })} />
          </div>

          <input
            type="submit"
            onClick={() => {
              console.log(formData);
              setLoadingFlag({ state: true });
              updateGroupe(userData.token, id, formData)
                .then((res) => {
                  if (res[0]) return console.warn(res[0]);
                  if (res[1] != 200) return;
                  setGroups({
                    groups: groups.groups.map((e) => {
                      if (e._id == id) {
                        e.name = formData.name;
                        e.study_year = +formData.studyYear;
                      }
                      return e;
                    }),
                  });
                  Store.navigateTo("/groups");
                })
                .then(() => setLoadingFlag({ state: false }));
            }}
            value="update"
            style={{ position: "relative" }}
          />
        </div>
      </div>
    </>
  );
}
