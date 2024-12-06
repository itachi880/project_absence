import "./index.css";
import { spans, TableByJson } from "../../../utils";
import { useEffect, useState } from "react";
import { deleteGroup, getGroups, undoGroupDelete } from "../../../api";
import { forbedenRoutesFor, GroupsDataStore, loadingFlag, studentsByGroup, userDataStore } from "../../../data";
import { Store } from "react-data-stores";
let canSearch = true;
let searchString = "";
export default function () {
  const [userData, setUserData] = userDataStore.useStore();
  const [groups, setGroups] = GroupsDataStore.useStore();
  const [studentsStore, setStudentsStoreData] = studentsByGroup.useStore();
  const [loading, setLoadingFlag] = loadingFlag.useStore();
  const [getArchived, setFlagGetArchived] = useState(false);
  const [toTableRender, setTableTorender] = useState([]);
  const [searchData, setSearchData] = useState([]);
  useEffect(() => {
    if (forbedenRoutesFor[userData.data.role]?.includes("/groups")) {
      Store.navigateTo("/");
      return;
    }
  }, []);
  useEffect(() => {
    if (groups[!getArchived ? "finish" : "finishDeleted"]) return;
    setLoadingFlag({ state: true });
    getGroups(userData.token, getArchived, !getArchived ? groups.pageCount : groups.pageCountDeleted).then((res) => {
      if (res[0]) return setLoadingFlag({ state: false });
      console.log(res);
      if (res[1].groups.length == 0) {
        setLoadingFlag({ state: false });
        !getArchived ? setGroups({ finish: true }, false) : setGroups({ finishDeleted: true }, false);
        return;
      }
      const exestingOnes = [];
      setGroups(
        {
          groups: [...groups.groups, ...res[1].groups].filter((group) => {
            if (!exestingOnes.includes(group._id)) {
              exestingOnes.push(group._id);
              return true;
            }
            return false;
          }),
          [!getArchived ? "pageCount" : "pageCountDeleted"]: groups[!getArchived ? "pageCount" : "pageCountDeleted"] + 1,
        },
        false
      );
      setLoadingFlag({ state: false });
    });
  }, [getArchived]);

  useEffect(() => {
    setSearchData(
      groups.groups.map((e, i) => ({
        index: i,
        keys: Object.values(e).map((e) => {
          if (typeof e == "boolean") return "";
          if (typeof e == "number") return e + "/" + (e + 1);
          return e.toLowerCase();
        }),
      }))
    );
    console.log(searchData);
  }, [studentsStore, groups.groups]);
  function handleTableSearch(searchQuery) {
    if (searchQuery.trim().length == 0) return setTableTorender([]);
    if (!canSearch) return;
    const indexes = [];
    const searchPaterns = searchQuery.split(" ").filter((e) => e.trim().length != 0);
    searchData.forEach((group) => {
      group.keys.forEach((key) => {
        if (searchPaterns.filter((pattern) => key.includes(pattern.toLowerCase())).length > 0 && !indexes.includes(group.index)) {
          indexes.push(group.index);
        }
      });
    });
    setTableTorender(indexes.map((index) => groups.groups[index]));
  }
  return (
    <div className="show_groups">
      <div className="table_container">
        <button
          onClick={() => {
            setFlagGetArchived((prev) => !prev);
            setGroups({ finish: false }, false);
          }}
        >
          see Archive {getArchived ? "enable" : "disable"}
        </button>
        <div className="table-input">
          {<i className="fa-solid fa-magnifying-glass search-icon"></i>}
          <input type="text" placeholder="Search" />
          <spans.true
            onClick={(e) => {
              e = e.currentTarget.previousElementSibling;
              searchString = e.value;
              handleTableSearch(e.value);
            }}
            text={<p className="">OK</p>}
          />
        </div>

        <TableByJson
          replace_column_names={{ is_deleted: "status", study_year: "study years" }}
          data={(searchString.trim().length == 0 ? groups.groups : toTableRender.length > 0 ? toTableRender : []) //reason is the [] will result in nodatacomponent to render because it has no elements
            .filter((e) => e.is_deleted == getArchived)
            .map((group) => ({
              ...group,
              is_deleted: !group.is_deleted ? <spans.true text={"Active"} /> : <spans.false text={"archive"} />,
              study_year: group.study_year + "/" + (group.study_year + 1),
              Delete: (
                <spans.false
                  text={<i className="fa-solid fa-trash-can"></i>}
                  onClick={() => {
                    setLoadingFlag({ state: true });
                    deleteGroup(userData.token, group._id).then((res) => {
                      setLoadingFlag({ state: false });
                      if (res[0]) return console.warn(res[0]);
                      if (res[1] !== 200) return;
                      setGroups(
                        {
                          groups: groups.groups.map((e) => {
                            if (e._id == group._id) e.is_deleted = true;
                            return e;
                          }),
                        },
                        false
                      );
                      setStudentsStoreData({
                        [group._id]:
                          studentsStore[group._id]?.map((e) => {
                            e.is_deleted = true;
                            return e;
                          }) || [],
                      });
                    });
                  }}
                />
              ),
              reset: (
                <spans.true
                  onClick={() =>
                    undoGroupDelete(userData.token, group._id).then((res) => {
                      if (res[0]) return console.warn(res[0]);
                      setGroups({
                        groups: groups.groups.map((e) => {
                          if (e._id == group._id) e.is_deleted = false;
                          return e;
                        }),
                      });
                      setStudentsStoreData({
                        [group._id]:
                          studentsStore[group._id]?.map((e) => {
                            e.is_deleted = false;
                            return e;
                          }) || [],
                      });
                    })
                  }
                  text={<i className="fa-solid fa-rotate-left"></i>}
                />
              ),
              update: (
                <spans.true
                  onClick={() => {
                    // console.log("hello ..");
                    Store.navigateTo(`/groups/update/${group._id}`);
                  }}
                  text={<i className="fa-solid fa-pen-to-square"></i>}
                ></spans.true>
              ),
            }))}
          nonClickableTd={["Delete", "reset", "update"]}
          exclude={["updatedAt", "__v", "createdAt", "_id"]}
          dataTdsOnclick={(index, obj) => {
            Store.navigateTo(`/users/show/group/${obj._id}`);
          }}
        />
        {!groups.finish ? (
          <button
            onClick={(e) => {
              e.target.disabled = true;
              setLoadingFlag({ state: true });
              getGroups(userData.token, getArchived, !getArchived ? groups.pageCount : groups.pageCountDeleted).then((res) => {
                if (res[0]) return;
                if (res[1].groups.length == 0) {
                  setLoadingFlag({ state: false });
                  setGroups({ finish: true }, false);
                  return;
                }
                const exestingOnes = [];
                setGroups(
                  {
                    groups: [...groups.groups, ...res[1].groups].filter((group) => {
                      if (!exestingOnes.includes(group._id)) {
                        exestingOnes.push(group._id);
                        return true;
                      }
                      return false;
                    }),
                    [!getArchived ? "pageCount" : "pageCountDeleted"]: groups[!getArchived ? "pageCount" : "pageCountDeleted"] + 1,
                  },
                  false
                );
                setLoadingFlag({ state: false });
                e.target.disabled = false;
              });
            }}
          >
            load more
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
