import React, { useState } from "react";
import TaskForm from "../taskForm";
import ProcessRunner from "../Component/processRunner";

function UserProcessFlow() {
  const [taskForm, setTaskForm] = useState(true);
  const [processId, setProcessId] = useState('')

  const taskFormHandler = (val, id) => {
    console.log('result', val, id);
    if(id){
      setTaskForm(val);
      setProcessId(id);
    }
  };
  const ProcessHandler = () => {
    console.log('result');
  }
  return (
    <div className="App">
      <h1 className="center padding-20">Camunda POC</h1>
      {taskForm ? (
        <TaskForm taskFormHandler={taskFormHandler} />
      ) : (
        <ProcessRunner processId={processId} ProcessHandler={ProcessHandler}/>
      )}
    </div>
  );
}

export default UserProcessFlow;
