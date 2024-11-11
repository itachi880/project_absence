import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./index.css";
import { absences, jwt_token, studentsByGroup, userDataStore } from "../../../data";
import { getUserAbsenceByID } from "../../../api";

export default function MyCalendar() {
  const { id, group } = useParams();
  const [studentsData, setStudentsData] = studentsByGroup.useStore();
  const [datesToMark, setDatesToMarke] = useState([{ date: "", events: [] }]);
  const [datesToMarkCheck, setDatesToMarkeCheck] = useState([]);
  const [absencesStore, setAbsencesStore] = absences.useStore();
  const [selectedDate, setSelectedDate] = useState("");
  useEffect(() => {
    const studentAbsence = studentsData[group]?.find((obj) => obj._id == id)?.absences || [];
    if (studentAbsence.length === 0) return;
    if (absencesStore.data.fi) return;
    getUserAbsenceByID(localStorage.getItem(jwt_token), studentAbsence[studentAbsence.length - 1]).then((res) => {
      if (res[0]) return console.log(res[0]);
      setAbsencesStore({ data: [res[1]] }, false);
    });
  }, []);
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
    <div className="calander-container">
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
        }}
      />
      <div className="day-data">
        {datesToMark
          .find(({ date, events }, index) => selectedDate == date)
          ?.events.map((event) => {
            return (
              <>
                <span>the session number :{event}</span>
                <hr />
              </>
            );
          }) || <>no absence</>}
      </div>
    </div>
  );
}
