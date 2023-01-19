import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState(prev => ({ ...prev, day }));

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  //vars to be used for both Book & Cancel interview
  const currentDayIndex = state.days.findIndex(day => day.name === state.day);
  const daysCopy = [...state.days];

  const bookInterview = (id, interview, edit) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        if (!edit) { daysCopy[currentDayIndex].spots--; }
        setState({
          ...state,
          appointments,
          days: daysCopy
        });
      }
      );
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        daysCopy[currentDayIndex].spots++;
        setState({
          ...state,
          appointments,
          days: daysCopy
        });
      }
      );
  };
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
};
