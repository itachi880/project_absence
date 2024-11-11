import "./index.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUsersByGroupID } from "../../../api";
import { GroupsDataStore, jwt_token, studentsByGroup } from "../../../data";
import { spans, TableByJson } from "../../../utils";
import { Store } from "react-data-stores";
export default function () {
  const { id } = useParams();
  const [groups, setGroups] = GroupsDataStore.useStore();
  const [studens, setStudents] = studentsByGroup.useStore();
  useEffect(() => {
    getUsersByGroupID(id, localStorage.getItem(jwt_token)).then((res) => {
      setStudents({ [id]: res[1]?.data });
    });
  }, []);
  return (
    <div className="table-container">
      <TableByJson
        data={
          studens[id]?.map((student) => {
            delete student.profile;
            return { ...student, justification_days_left: student.justification_days_left + " jour", first_name: student.first_name + " " + student.last_name, group: groups.groups.filter((group) => group._id == id)[0].name, is_deleted: student.is_deleted ? spans["false"]({ text: "archived" }) : spans["true"]({ text: "active" }) };
          }) || undefined
        }
        exclude={["createdAt", "updatedAt", "__v", "_id", "absences", "role", "last_name"]}
        replace_column_names={{ is_deleted: "status", justification_days_left: "limite de certifi", first_name: "name" }}
        dataTdsOnclick={(index, obj, e) => {
          Store.navigateTo("/users/show/" + obj._id + "/from/" + id);
        }}
      />
    </div>
  );
}
