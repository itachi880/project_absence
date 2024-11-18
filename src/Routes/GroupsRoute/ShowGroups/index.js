import "./index.css";
import { spans, TableByJson } from "../../../utils";
import { useEffect } from "react";
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

    getGroups(userData.token, false, 0).then((res) => {
      if (res[0]) return;
      setGroups({ groups: res[1].groups.filter((e) => !groups.groups.find((o) => o._id == e._id)), pageCount: groups.pageCount + 1 }, false);
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
      {!groups.finish ? (
        <button
          onClick={() => {
            setLoadingFlag({ state: true });
            getGroups(userData.token, false, groups.pageCount).then((res) => {
              if (res[0]) return;
              if (res[1].groups.length == 0) {
                setLoadingFlag({ state: false });
                setGroups({ finish: true }, false);
                return;
              }
              setGroups({ groups: [...groups.groups, ...res[1].groups], pageCount: groups.pageCount + 1 }, false);
              setLoadingFlag({ state: false });
            });
          }}
        >
          load more
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
