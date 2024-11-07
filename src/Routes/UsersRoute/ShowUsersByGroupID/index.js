import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUsersByGroupID } from "../../../api";
import { GroupsDataStore, jwt_token } from "../../../data";

export default function () {
  const { id } = useParams();
  const [groups, setGroups] = GroupsDataStore.useStore();
  const selected = groups.groups.filter((obj) => obj._id == id);
  useEffect(() => {
    getUsersByGroupID(id, localStorage.getItem(jwt_token)).then(console.log);
  }, []);
  return (
    <>
      {selected[0].name}
      {id}{" "}
    </>
  );
}
