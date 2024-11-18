import "./index.css";
import { PopUp, spans, TableByJson } from "../../../utils";
import { useEffect, useState } from "react";
import { getGroups } from "../../../api";
import { forbedenRoutesFor, GroupsDataStore, loadingFlag, userDataStore } from "../../../data";
import { Store } from "react-data-stores";

export default function () {
  const [userData, setUserData] = userDataStore.useStore();
  const [groups, setGroups] = GroupsDataStore.useStore();
  const [loading, setLoadingFlag] = loadingFlag.useStore();
  useEffect(() => {
    if (forbedenRoutesFor[userData.data.role]?.includes("/groups")) {
      Store.navigateTo("/");
      return;
    }
    setLoadingFlag({ state: true });
    if (groups.groups.length > 1) return setLoadingFlag({ state: false });

    getGroups(userData.token, true).then((res) => {
      if (res[0]) return;
      setGroups({ groups: res[1] }, true);
      setLoadingFlag({ state: false });
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
