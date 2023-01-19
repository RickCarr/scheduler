import { findByTestId } from "@testing-library/react";

export default function getAppointmentsForDay(state, day) {
  const filteredApts = state.days.filter(days => days.name === day);
  return (state.days.length === 0 || filteredApts.length === 0 ? [] :
    filteredApts[0].appointments.map((id) => state.appointments[id]
    ));
}

export function getInterview(state, interview) {
  if (!interview) return null;
  const apt = Object.values(state.appointments).find(index => index.interview && index.interview.interviewer === interview.interviewer);
  return {
    "student": apt.interview.student,
    "interviewer": state.interviewers[apt.interview.interviewer]
  };
}

export function getInterviewersForDay(state, day) {
  const filteredDays = state.days.filter(days => days.name === day);   
  return (state.days.length === 0 || filteredDays.length === 0 ? [] :
    filteredDays[0].interviewers.map((id) => state.interviewers[id]));
}