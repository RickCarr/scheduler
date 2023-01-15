import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";

import DayList from "./DayList";
import Appointment from "./Appointment";
import getAppointmentsForDay from "./helpers/selectors";

export default function Application(props) {  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState(prev => ({ ...prev, day }));
  // const setDays = days => setState(prev => ({ ...prev, days }));
  
  
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {      
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  }, []);

const dailyAppointments = getAppointmentsForDay(state, state.day);

const appointmentArray = dailyAppointments.map(appointment =>{
 
  console.log("interviewers", state.interviewers, "appointment", appointment);
return (
  <Appointment  
    key={appointment.id}
    {...appointment}
  />
  )

}
);
return (
  <main className="layout">
    <section className="sidebar">      
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={state.days}
          value={state.day}
          onChange={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
    </section>
    <section className="schedule">
      {appointmentArray}
      <Appointment key="last" time="5pm" />
    </section>
  </main>
);
}
