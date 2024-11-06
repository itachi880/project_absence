import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUsersByGroupID } from "../../../api";
import { jwt_token } from "../../../data";

export default function () {
  const { id } = useParams();
  useEffect(() => {
    getUsersByGroupID(id, localStorage.getItem(jwt_token)).then(console.log);
  }, []);
  return <>show by {id} </>;
}
