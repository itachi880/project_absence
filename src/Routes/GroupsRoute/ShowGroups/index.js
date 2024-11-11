import "./index.css";
import { spans, TableByJson } from "../../../utils";
import { useEffect } from "react";
import { getGroups } from "../../../api";
import { forbedenRoutesFor, GroupsDataStore, userDataStore } from "../../../data";
import { Store } from "react-data-stores";

export default function () {
  const [userData, setUserData] = userDataStore.useStore();
  const [groups, setGroups] = GroupsDataStore.useStore();
  useEffect(() => {
    if (forbedenRoutesFor[userData.data.role]?.includes("/groups")) {
      Store.navigateTo("/");
      return;
    }
    getGroups(userData.token, true).then((res) => {
      if (res[0]) return;
      console.log(res);
      setGroups({ groups: res[1] }, true);
    });
  }, []);
  return (
    <div className="table_container">
      <TableByJson
        replace_column_names={{ is_deleted: "status", study_year: "study years" }}
        data={groups.groups.map((group) => ({
          ...group,
          is_deleted: !group.is_deleted ? <spans.true text={"Active"} /> : <spans.false text={"archive"} />,
          study_year: group.study_year + "/" + (group.study_year + 1),
        }))}
        exclude={["updatedAt", "__v", "createdAt", "_id"]}
        dataTdsOnclick={(index, obj, event) => {
          Store.navigateTo(`/users/show/group/${obj._id}`);
        }}
      />
    </div>
  );
}
