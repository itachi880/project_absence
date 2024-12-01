import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./index.css";
import { absences, GroupsDataStore, justificationsStore, jwt_token, loadingFlag, roles, statusCertif, studentsByGroup, userDataStore } from "../../../data";
import { getGroupByID, getJustificationByID, getUserAbsenceByID, getUsersByGroupID } from "../../../api";
import { spans } from "../../../utils";

export default function () {
  const date = new Date();
  const { id, group } = useParams(); //// id users
  const [userData] = userDataStore.useStore(); //
  const [studentsData, setStudentsData] = studentsByGroup.useStore();
  const [datesToMark, setDatesToMarke] = useState([{ date: "", events: [], justif_id: "" }]);
  const [datesToMarkCheck, setDatesToMarkeCheck] = useState([]);
  const [absencesStore, setAbsencesStore] = absences.useStore();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateObj, setSelectedDateObj] = useState(new Date());
  const [groups, setGroups] = GroupsDataStore.useStore();
  const [loading, setLoadingFlag] = loadingFlag.useStore();

  useEffect(() => {
    if (!studentsData[group]) {
      setLoadingFlag({ state: true });
      getUsersByGroupID(group, userData.token).then(async (res) => {
        if (res[0]) {
          console.log(res[0]);
          setLoadingFlag({ state: false });
          return;
        }
        const [error, data] = await getGroupByID(userData.token, group);
        if (error) return setLoadingFlag({ state: false });
        setLoadingFlag({ state: false });
        setStudentsData({ [group]: res[1].data }, false); // false = add // true = update
        setGroups({ groups: [...groups.groups, data] });
      });
    }
    const studentAbsence = studentsData[group]?.find((obj) => obj._id === id)?.absences || [];
    if (studentAbsence.length === 0) return;
    if (absencesStore.data.fi) return; // to do ??
    setLoadingFlag({ state: true });
    getUserAbsenceByID(userData.token, studentAbsence[studentAbsence.length - 1]).then((res) => {
      setLoadingFlag({ state: false });
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
                  justif_id: absence.justification_id,
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
  // useEffect(() => {}, []);
  return (
    <div className="show-user-by-id wrapper">
      <ShowUser groups={groups} studentsData={studentsData || []} group={group} id={id} />
      <ShowJustifCard datesToMark={datesToMark} selectedDate={selectedDate} />

      <div className="calander">
        <div className="studant-info">
          {/**
           * hna les donne dyal etudent
           */}
        </div>

        <Calendar
          defaultView="month"
          minDetail="decade"
          className={"calander-comp"}
          tileDisabled={({ date, view }) => view == "month" && date.getDay() == 0}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;
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
            <td>{datesToMark.find(({ date }) => selectedDate === date)?.events.includes(1) ? spans["false"]({ text: "Absent" }) : date.getTime() < selectedDateObj.getTime() ? spans["maybe"]({ text: "Pas Encore" }) : spans["true"]({ text: "Present" })}</td>
          </tr>
          <tr>
            <td>10:30 AM - 1:00 PM</td>
            <td>{datesToMark.find(({ date }) => selectedDate === date)?.events.includes(2) ? spans["false"]({ text: "Absent" }) : date.getTime() < selectedDateObj.getTime() ? spans["maybe"]({ text: "Pas Encore" }) : spans["true"]({ text: "Present" })}</td>
          </tr>
          <tr>
            <td>1:30 PM - 4:30 PM</td>
            <td>{datesToMark.find(({ date }) => selectedDate === date)?.events.includes(3) ? spans["false"]({ text: "Absent" }) : date.getTime() < selectedDateObj.getTime() ? spans["maybe"]({ text: "Pas Encore" }) : spans["true"]({ text: "Present" })}</td>
          </tr>
          <tr>
            <td>4:30 PM - 6:30 PM</td>
            <td>{datesToMark.find(({ date }) => selectedDate === date)?.events.includes(4) ? spans["false"]({ text: "Absent" }) : date.getTime() < selectedDateObj.getTime() ? spans["maybe"]({ text: "Pas Encore" }) : spans["true"]({ text: "Present" })}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const ShowUser = ({ studentsData = [], groups, group, id }) => {
  const d = studentsData[group]?.filter((student) => student._id === id)[0] || undefined;
  const [_, setLoadingFlag] = loadingFlag.useStore();

  useEffect(() => {
    setLoadingFlag({ state: true });
  }, []);
  if (!d) return null;

  return (
    <div
      className="user-card"
      onLoad={() => {
        setLoadingFlag({ state: false });
      }}
    >
      <div className="student-info">
        <div className="student-profile">
          <img src={require("../../../assets/no-profile-picture-icon.webp")} />
        </div>
        <div className="attrebuts">
          {(d.first_name + " " + d.last_name).toLocaleUpperCase()}
          <div>
            <spans.true
              text={
                groups?.groups?.filter((e) => {
                  return e._id === group;
                })[0]?.name
              }
            />
            <spans.maybe text={d.cin} />
          </div>
        </div>
        {d.displine_points ? (
          <div className="section discipline">
            <i className="fa-solid fa-star"></i> {d.displine_points}/20
          </div>
        ) : (
          ""
        )}
        <div className="section absence-unjustified">
          <i className="fa-solid fa-circle-exclamation"></i> 0h
        </div>
        <div className="section absence-justified">
          <i className="fa-solid fa-circle-check"></i> 0h
        </div>
      </div>
    </div>
  );
};
function ShowJustifCard({ datesToMark = [], selectedDate = "" }) {
  const certif = datesToMark.find((date) => {
    return date.date == selectedDate;
  });
  const [loading, setLoadingFlag] = loadingFlag.useStore();
  const [certifStore, setCertifStore] = justificationsStore.useStore();
  const [selectedCertif, setSelectedCertif] = useState(null);
  const [userData, setUserData] = userDataStore.useStore();
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    if (!certif?.justif_id) return;
    const index = certifStore.data.findIndex((item) => item._id == certif?.justif_id);
    //ila l9it certif deja kayna f base local manjibohach mn base donne fserveur dik index ila kant -1 ya3ni certif makaynach ila kant 0+ m3naha l9inaha
    if (index > -1) return setSelectedCertif(certifStore.data[index]);
    setLoadingFlag({ state: true });
    getJustificationByID(certif?.justif_id, userData.token).then((res) => {
      if (res[0] || !res[1]?._id) return;
      setSelectedCertif(res[1]);
      setCertifStore({ data: [...certifStore.data, res[1]] });
      setLoadingFlag({ state: false });
    });
  }, [certif]);

  return (
    <div className="justifications">
      {certif?.justif_id && selectedCertif?.start_date ? (
        <>
          <table className="certificate-table">
            <thead>
              <tr>
                <th>Details</th>
                <th>Information</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Start Date</td>
                <td>{selectedCertif?.start_date.split("T")[0]}</td>
              </tr>
              <tr>
                <td>Days Covered</td>
                <td>{selectedCertif?.justification_date} Days</td>
              </tr>
              <tr>
                <td>Additional Info</td>
                <td>{selectedCertif?.details}</td>
              </tr>
              {selectedCertif?.media ? (
                <tr>
                  <td>PDF</td>
                  <td>
                    <a href={selectedCertif?.media} className="pdf-link" target="_blank">
                      View PDF
                    </a>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={"2"}>no document</td>
                </tr>
              )}
              <tr>
                <td>status</td>
                <td className="status">
                  {selectedCertif?.status == statusCertif.no_valide ? <spans.false text={"pas valide"} /> : selectedCertif?.status == statusCertif.panding ? <spans.maybe text={"en cours"} /> : <spans.true text={"valide"} />}

                  {userData?.data?.role == roles.generale_survience ? (
                    <>
                      <div className="icon-container" onClick={() => setIsHovered((e) => !e)}>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </div>
                      <div className={`confirm-certif ${isHovered ? "" : "confirm-certif-none"}`}>
                        <button className="validate-button">validated</button>
                        <button className="validate-button">not validated</button>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ) : certif?.events?.length > 0 ? (
        <h3>ce jour n'est pas justifie</h3>
      ) : (
        <h3>Not absence this sceance</h3>
      )}
    </div>
  );
}
