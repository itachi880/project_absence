import "./index.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroupByID, getUsersByGroupID } from "../../../api";
import { GroupsDataStore, jwt_token, studentsByGroup } from "../../../data";
import { PopUp, spans, TableByJson } from "../../../utils";
import { Store } from "react-data-stores";
export default function () {
  const { id } = useParams();
  const [groups, setGroups] = GroupsDataStore.useStore();
  const [studens, setStudents] = studentsByGroup.useStore();
  const [isDataLoaded, setDataLoadedFlag] = useState(false);
  useEffect(() => {
    if (studens[id]) return setDataLoadedFlag(true);
    getUsersByGroupID(id, localStorage.getItem(jwt_token)).then((res) => {
      setStudents({ [id]: res[1]?.data });

      if (groups.groups.find((group) => group._id == id)) return setDataLoadedFlag(true);
      getGroupByID(localStorage.getItem(jwt_token), id).then((res) => {
        setGroups({ groups: [...groups.groups, res[1]] }, true);
      });
    });
  }, []);
  return (
    <div className="table-container">
      <PopUp color="var(--maybe-color)" isLoading={!isDataLoaded} message="loading groups..." removeOnClick={false} timer={false} />
      <TableByJson
        data={
          studens[id]?.map((student) => {
            delete student.profile;
            return { ...student, justification_days_left: student.justification_days_left + " jour", first_name: student.first_name + " " + student.last_name, group: groups.groups.filter((group) => group._id == id)[0]?.name, is_deleted: student.is_deleted ? spans["false"]({ text: "archived" }) : spans["true"]({ text: "active" }), displine_points: student.displine_points + "/20" };
          }) || undefined
        }
        exclude={["createdAt", "updatedAt", "__v", "_id", "absences", "role", "last_name"]}
        replace_column_names={{ is_deleted: "status", justification_days_left: "limite de certifi", first_name: "name", displine_points: "note dicipline" }}
        dataTdsOnclick={(index, obj, e) => {
          Store.navigateTo("/users/show/" + obj._id + "/from/" + id);
        }}
        order={["first_name", "login", "is_deleted", "group", "cin", "justification_days_left", "displine_points"]}
      />
    </div>
  );
}
