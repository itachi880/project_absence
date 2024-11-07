import "./index.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUsersByGroupID } from "../../../api";
import { getServerLink, GroupsDataStore, jwt_token, studentsByGroup } from "../../../data";
import { TableByJson } from "../../../utils";
export default function () {
  const { id } = useParams();
  const [groups, setGroups] = GroupsDataStore.useStore();
  const [studens, setStudents] = studentsByGroup.useStore();
  const [selected, setSelected] = useState(groups.groups.filter((obj) => obj._id == id)[0] || []);
  useEffect(() => {
    getUsersByGroupID(id, localStorage.getItem(jwt_token)).then((res) => {
      setStudents({ [selected[0]?.name]: res[1]?.data });
    });
  }, []);
  return (
    <div className="table-container">
      <TableByJson
        data={
          studens[selected[0]?.name]?.map((student) => {
            return { ...student, profile: <img src={getServerLink("profile/") + student.profile} />, is_deleted: student.is_deleted ? "archive" : "active" };
          }) || undefined
        }
        exclude={["createdAt", "updatedAt", "__v", "_id", "absences", "role"]}
        replace_column_names={{ is_deleted: "status", justification_days_left: "limite de certifi" }}
      />
    </div>
  );
}
