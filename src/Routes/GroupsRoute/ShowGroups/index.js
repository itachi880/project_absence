import "./index.css";
import { TableByJson } from "../../../utils";
import { useEffect, useState } from "react";
import { getGroups } from "../../../api";
import { userDataStore } from "../../../data";
import { Store } from "react-data-stores";

export default function () {
  const [userData, setUserData] = userDataStore.useStore();
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    getGroups(userData.token, true).then((res) => {
      if (res[0]) return;
      setGroups(res[1]);
    });
  }, []);
  return (
    <div className="table_container" onClick={() => console.log(userData)}>
      <TableByJson
        replace_column_names={{ is_deleted: "status", study_year: "study years" }}
        data={groups.map((group) => ({
          ...group,
          is_deleted: !group.is_deleted ? <span className="true">active</span> : <span className="false">archive</span>,
        }))}
        exclude={["updatedAt", "__v", "createdAt", "_id"]}
        dataTdsOnclick={(index, obj, event) => {
          Store.navigateTo(`/users/show/group/${obj._id}`);
        }}
      />
    </div>
  );
}
