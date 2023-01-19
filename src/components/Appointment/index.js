import './styles.scss';

import React from 'react';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

import useVisualMode from 'hooks/useVisualMode';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

//jsx, within funcitons, state first, then other functions, then return
export default function Appointment(props) {  
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  const save = function(name, interviewer, edit) {        
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true);
    props
      .bookInterview(props.id, interview, edit)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  };

  const deleteInterview = function() {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }; 

  return (
    <>
      <article className="appointment" data-testid="appointment">
        <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === CREATE &&
          <Form
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
          />
        }
        {mode === SAVING && <Status message="Saving" />}
        {mode === ERROR_SAVE &&
          <Error
            message="Could not save appointment."
            onClose={back}
          />}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer.name}
            onEdit={() => transition(EDIT)}
            onDelete={() => transition(CONFIRM)}
          />
        )}
        {mode === CONFIRM &&
          <Confirm
            message="Are you sure you would like to delete?"
            onCancel={back}
            onConfirm={deleteInterview}
          />
        }
        {mode === DELETING && <Status message="Deleting" />}
        {mode === ERROR_DELETE &&
          <Error
            message="Could not delete appointment."
            onClose={back}
          />}
        {mode === EDIT &&
          <Form
            student={props.interview.student}
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
            edit={true}
          />}
      </article>
    </>
  );
}