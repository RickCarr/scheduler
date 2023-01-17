import './styles.scss';

import React from 'react';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';

import useVisualMode from 'hooks/useVisualMode';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

//jsx, within funcitons, state first, then other functions, then return
export default function Appointment(props) {  
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = function(name, interviewer) {    
    const interview = {
      student: name,
      interviewer
    };    
    props.bookInterview(props.id, interview);
    transition(SHOW);
  }

  return (
    <>
      <article className="appointment">
        <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === CREATE && 
          <Form 
            interviewers={props.interviewers} 
            onCancel={back} 
            onSave={save}
          />}
        {console.log(Form)}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer.name}
          />
        )}
      </article>
    </>
  );
}