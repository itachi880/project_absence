import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./index.css";
import { absences, GroupsDataStore, jwt_token, studentsByGroup, userDataStore } from "../../../data";
import { getGroupByID, getUserAbsenceByID, getUsersByGroupID } from "../../../api";
import { spans } from "../../../utils";

export default function MyCalendar() {
  const date = new Date();
  const { id, group } = useParams(); //// id users
  const [userData, setUserData] = userDataStore.useStore(); //
  const [studentsData, setStudentsData] = studentsByGroup.useStore();
  const [datesToMark, setDatesToMarke] = useState([{ date: "", events: [] }]);
  const [datesToMarkCheck, setDatesToMarkeCheck] = useState([]);
  const [absencesStore, setAbsencesStore] = absences.useStore();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateObj, setSelectedDateObj] = useState(new Date());
  const [groups, setGroups] = GroupsDataStore.useStore();

  useEffect(() => {
    if (!studentsData[group]) {
      getUsersByGroupID(group, userData.token).then(async (res) => {
        if (res[0]) return console.log(res[0]);
        const [error, data] = await getGroupByID(userData.token, group);
        setStudentsData({ [group]: res[1].data }, false); // false = add // true = update
        if (error) return;
        setGroups({ groups: [...groups.groups, data] });
      });
    }
    const studentAbsence = studentsData[group]?.find((obj) => obj._id == id)?.absences || [];
    if (studentAbsence.length === 0) return;
    if (absencesStore.data.fi) return;
    getUserAbsenceByID(localStorage.getItem(jwt_token), studentAbsence[studentAbsence.length - 1]).then((res) => {
      if (res[0]) return console.log(res[0]);
      setAbsencesStore({ data: [res[1]] }, false);
    });
  }, [studentsData]);
  useEffect(() => {
    const events = [];
    const dates = [];
    // Ensure absencesStore.data is an array and exists
    if (Array.isArray(absencesStore.data) && absencesStore.data.length > 0) {
      absencesStore.data
        .filter((absences) => absences.student_id === id)
        .forEach((absences) => {
          if (Array.isArray(absences.absences)) {
            absences.absences.forEach((absence) => {
              if (Array.isArray(absence.sessions) && absence.sessions.length > 0) {
                events.push({
                  date: absences.month + "-" + absence.date || "may undifined",
                  events: absence.sessions || [],
                });
                dates.push(absences.month + "-" + absence.date);
              }
            });
          }
        });
    }
    setDatesToMarkeCheck(dates);
    setDatesToMarke(events);
  }, [absencesStore]);

  return (
    <>
      <ShowUser groups={groups} studentsData={studentsData} group={group} id={id} />
      <div className="calander-container">
        <div className="calander">
          <div className="studant-info">
            {/**
             * hna les donne dyal etudent
             */}
          </div>

          <Calendar
            tileContent={({ date, view }) => {
              if (view != "month") return null;
              const formatedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
              if (!datesToMarkCheck.includes(formatedDate)) return null;

              return (
                <span className="tile-content">
                  <span className="event-dot"></span>
                </span>
              );
            }}
            onClickDay={(date) => {
              setSelectedDate(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
              setSelectedDateObj(date);
            }}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Horaire</th>
              <th>Statut d'absence</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>8:30 AM - 10:30 AM</td>
              <td>{datesToMark.find(({ date }) => selectedDate == date)?.events.includes(1) ? spans["false"]({ text: "Absent" }) : date.getTime() < selectedDateObj.getTime() ? spans["maybe"]({ text: "Pas Encore" }) : spans["true"]({ text: "Present" })}</td>
            </tr>
            <tr>
              <td>10:30 AM - 1:00 PM</td>
              <td>{datesToMark.find(({ date }) => selectedDate == date)?.events.includes(2) ? spans["false"]({ text: "Absent" }) : date.getTime() < selectedDateObj.getTime() ? spans["maybe"]({ text: "Pas Encore" }) : spans["true"]({ text: "Present" })}</td>
            </tr>
            <tr>
              <td>1:30 PM - 4:30 PM</td>
              <td>{datesToMark.find(({ date }) => selectedDate == date)?.events.includes(3) ? spans["false"]({ text: "Absent" }) : date.getTime() < selectedDateObj.getTime() ? spans["maybe"]({ text: "Pas Encore" }) : spans["true"]({ text: "Present" })}</td>
            </tr>
            <tr>
              <td>4:30 PM - 6:30 PM</td>
              <td>{datesToMark.find(({ date }) => selectedDate == date)?.events.includes(4) ? spans["false"]({ text: "Absent" }) : date.getTime() < selectedDateObj.getTime() ? spans["maybe"]({ text: "Pas Encore" }) : spans["true"]({ text: "Present" })}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

const ShowUser = ({ studentsData, groups, group, id }) => {
  const d = studentsData[group].filter((student) => student._id == id)[0];
  return (
    <>
      <h4>donnees du stagaire</h4>
      <p>
        <strong>Nom :</strong>
        {d.first_name + " " + d.last_name}
      </p>
      <p>
        <strong>Login :</strong> {d.login}
      </p>
      <p>
        <strong>Group :</strong>{" "}
        {groups.groups.filter((e) => {
          return e._id == group;
        })[0].name || "Aucun groupe"}
      </p>
    </>
  );
};
