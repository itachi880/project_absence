import { useEffect, useRef, useState } from "react";
import { GroupsDataStore, loadingFlag, roles, studentsByGroup, userDataStore } from "../../../data";
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
    role: roles.etudient,
  });
  const [userData, setUserData] = userDataStore.useStore();
  const [loading, setLoadingFlag] = loadingFlag.useStore();
  const [studentsStore, setStudentsStoreData] = studentsByGroup.useStore();
  const inputsControle = {
    error_message_info: useRef(""),
  };
  const [search, setSearch] = useState({ na: [], keys: ["na"] }); //de:[{},{}],keys:["de","id"],id:[{},{}]
  const [currentSearch, setCurrentSearch] = useState([{ name: "", _id: "" }]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const handleSearch = async (value) => {
    if (value.trim().length < 2) return;
    setFetchFlag(true);
    const result = search[search.keys.find((key) => value.toLowerCase().trim().includes(key.toLowerCase()))]?.filter((obj) => obj.name.toLowerCase().includes(value.toLowerCase()) && !obj.is_deleted) || [];

    if (result.length > 0) {
      console.log("Search results local:", result);
      setCurrentSearch(result.filter((res) => !res.is_deleted).map((e) => ({ name: e.name, _id: e._id })));
      setFetchFlag(false);
      return;
    }
    const [error, data] = await searchGroupsByName(value);

    if (error) {
      setFetchFlag(false);
      console.error("Error searching groups:", error);
      return;
    }
    setSearch({ ...search, [value.toLowerCase().trim()]: data, keys: [...search.keys, value.toLowerCase().trim()] });
    console.log("Search results server:", data);
    setCurrentSearch(data.filter((e) => !e.is_deleted).map((e) => ({ name: e.name, _id: e._id })));

    setFetchFlag(false);
  };
  useEffect(() => {
    if (groups.groups.length < 0)
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
    groups.groups.forEach((group) => {
      const groupShortName = (group.name[0] + group.name[1]).toLowerCase();
      if (search.keys.includes(groupShortName)) {
        if (search[groupShortName].filter((e) => e._id == group._id).length == 0) search[groupShortName].push(group);
        return;
      }
      search.keys.push(groupShortName);
      search[groupShortName] = [group];
    });
  }, []);

  return (
    <div className="add-student">
      <div style={{ marginBottom: "20px" }}>
        <span className="error" ref={inputsControle.error_message_info}></span>
        <h1>add user</h1>
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
        <div className="input select">
          <RoleSelect
            options={Object.entries(roles).map((e) => {
              e[0] = e[0].replaceAll("_", " ");
              return e;
            })}
            onChange={(e) => {
              setFormData({ ...formData, role: e });
            }}
            select_innerHtml="etudient"
          >
            <span className={`input-titel ${formData.role.trim().length > 0 ? "input-full" : ""}`}>{"user type"}</span>
          </RoleSelect>
        </div>
        {formData.role == roles.etudient ? (
          <>
            <div className="input">
              <span className={`input-titel`}>group</span>

              <input
                type="text"
                onChange={async (e) => {
                  if (e.target.value.trim().length > 0) e.target.previousSibling?.classList?.add("input-full");
                  else e.target.previousSibling?.classList?.remove("input-full");
                  await handleSearch(e.target.value);
                  setFormData({ ...formData, group: currentSearch[0]._id });
                }}
                list="currentsearch"
              />
            </div>
            <datalist id="currentsearch">
              {currentSearch.map((e) => (
                <option>{e.name}</option>
              ))}
            </datalist>
          </>
        ) : (
          ""
        )}
        <input
          type="submit"
          onClick={() => {
            if (formData.login?.trim()?.length < 3 || formData.cin?.trim()?.length < 3 || formData.first_name?.trim()?.length < 3 || formData.last_name?.trim()?.length < 3 || (formData.group?.trim()?.length < 3 && formData.role == roles.etudient)) return (inputsControle.error_message_info.current.innerHTML = "all fealds are required");
            setLoadingFlag({ state: true });
            addStudent(formData.first_name, formData.last_name, formData.cin, formData.login, formData.group, formData.role, userData.token)
              .then((res) => {
                if (res[0]) return alert("user not added");
                if (studentsStore[formData.group]?.length) setStudentsStoreData({ [formData.group]: [...studentsStore[formData.group], { ...formData, _id: res[1]._id }] });
                else setStudentsStoreData({ [formData.group]: [{ ...formData, _id: res[1]._id }] });
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
function RoleSelect({
  options = [["key", "value"]],
  onChange = (e) => {
    console.log("change event not initialized value:" + e);
  },
  select_innerHtml = "select option",
  children = "",
}) {
  return (
    <>
      {children}
      <div
        className="selected-option"
        onClick={(e) => {
          e.target.parentElement.classList.toggle("active");
          e.target.nextSibling.classList.toggle("hide");
        }}
      >
        {select_innerHtml}
      </div>
      <ul className="drop-down hide">
        {options.map((e) => (
          <li
            onClick={(event) => {
              onChange(e[1]);
              event.target.parentElement.parentElement.childNodes[1].innerHTML = e[0];
            }}
          >
            {e[0]}
          </li>
        ))}
      </ul>
    </>
  );
}
