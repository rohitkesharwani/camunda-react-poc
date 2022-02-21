import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function ProcessRunner({processId, processHandler}) {
  const [userAcceptance, setUserAccept] = useState(false);
  const [label, setLabel] = useState('');
  const [userId, setUserId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [taskId,setTaskId] = useState(0);
  const [taskDisabled, setTaskDisabled] = useState(true)

  useEffect(()=>{
    if (processId) {
        axios
          .get(`http://localhost:8081/orders/task/${processId}`)
          .then((res) => {
            const { label, id} = res.data.formFields[0];
              const taskId = res.data.taskId;
              setTaskId(taskId);
              setLabel(label);
              setUserId('chetan')
          }).catch(e => console.log(`getting error in api http://localhost:8081/orders/task/${taskId}`));;
      }
  }, [processId, taskId]);

  const completeTask = () => {
    if (taskId && userId) {
      axios
        .post(`http://localhost:8081/orders/task/${taskId}/complete`,{approveOrder: userAcceptance})
        .then((res) => {
          setShowMessage(true);
        }).catch(e => console.log(`getting error in api http://localhost:8081/orders/task/${taskId}/complete`));
    }
  };
  const claimTask = (e) => {
    e.preventDefault();
    if (taskId && userId) {
      axios
        .get(`http://localhost:8081/orders/task/${taskId}/claim/${userId}`)
        .then((res) => {
          console.log("claim:", `http://localhost:8081/orders/task/${taskId}/claim/${userId}`);
          setTaskDisabled(false)
        }).catch(e => console.log(`getting error in api /task/${taskId}/claim/${userId}`));
    }
  };

  const userAceptHandler = (userSelect) => {
    console.log("userAcceptance", userSelect);
    setUserAccept(userSelect);
    completeTask();
  }


  const changeHandler = (e) => {
   
  };

  return (
    <div className="formContainer">
        {showMessage ? 
        <h2>Process Completed</h2>
        : 
        <div>
           <div> <button className="position-right" disabled={!taskDisabled} onClick={claimTask}>claimTask</button></div>
        <form>
         
        <div className="formItem">
          <label className="label width-200">{label}</label>
          {/* <input
            type="checkbox"
            name="confirm"
            onChange={changeHandler}
          /> */}
          <button className="button accept mr-20" disabled={taskDisabled} onClick={e =>userAceptHandler(true)}>Accept</button>
          <button className="button reject" disabled={taskDisabled} onClick={e =>userAceptHandler(false)}>Reject</button>
        </div>
        {/* <div className="formItem center">
          <input type="button" value="Submit" onClick={submitHandler} />
        </div> */}
      </form>
      </div>
        }
    </div>
  );
}

export default ProcessRunner;
