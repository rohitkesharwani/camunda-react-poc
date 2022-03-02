import React, { useState, useEffect } from "react";
import axios from "axios";

function UserAuth() {
  const userId = JSON.parse(sessionStorage.user).name;
  const userGroup = JSON.parse(sessionStorage.user).userGroup;
  const [formData, setFormData] = useState([]);
  const [taskText, setTaskText] = useState('');
  // const [processId, setProcessId] = useState('');
  const [taskId, setTaskId] = useState('');
  const [taskDisabled, setTaskDisabled] = useState(true)
  const [showMessage, setShowMessage] = useState(false);
  // const [userAcceptance, setUserAcceptance] = useState(false);

  const startProcess = () => {
    if (sessionStorage.user.name) {
      axios
        .post(
          "http://localhost:8081/engine-rest/process-definition/key/Callaboration_poc/start"
        )
        .then((res) => {
          console.log(
            res.data,
            "http://localhost:8081/engine-rest/process-definition/key/Callaboration_poc/start"
          );
          //   taskFormHandler(false, res.data.orderId);
        })
        .catch((e) =>
          console.log(
            "error in api",
            "http://localhost:8081/engine-rest/process-definition/key/Callaboration_poc/start"
          )
        );
    }
  };

  const claimTask = () => {
    if (taskId && userId) {
      axios
        .get(`http://localhost:8081/orders/task/${taskId}/claim/${userId}`)
        .then((res) => {
          console.log("claim:", `http://localhost:8081/orders/task/${taskId}/claim/${userId}`);
          setTaskDisabled(false)
        }).catch(e => console.log(`getting error in api /task/${taskId}/claim/${userId}`));
    }
  };

  const getUserTask = () => {  
    if (userId && !formData.length) {
      axios
        .get(`http://localhost:8081/tasks/${userId}`)
        .then((res) => {
          console.log(res.data, `http://localhost:8081/tasks/${userId}`);
          setFormData(res.data.result);
          setTaskId(res.data.result[0].taskId);
        })
        .catch((e) =>
          console.log("error in api", `http://localhost:8081/tasks/${userId}`)
        );
    }
  };

  const createform = () => {
    return formData.map((item, key) => {
        const inputType = item.formFields[0].type.name === "boolean" ? "checkbox" : "text";
        const className =  item.formFields[0].type.name === "boolean" ? "ml-10" : "shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker";

        const changeHandler = (e) => {
            const val = inputType === 'text' ? e.target.value : e.target.checked;
            setTaskText(val)
        }
      return (
        <div className="mb-4" key={key}>
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="taskText"
          >
            {item.formFields[0].label || "Enter task details"}
          </label>

          <input
            className={className}
            id="taskText"
            type={inputType}
            placeholder=""
            onChange={changeHandler}
            value={taskText}
          />
        </div>
      );
    });
  };

  useEffect(() => {
    getUserTask();
  });

  const completeTask = (param) => {
    if (taskId && userId) {
      axios
        .post(`http://localhost:8081/orders/task/${taskId}/complete`,param)
        .then((res) => {
          setShowMessage(true);
        }).catch(e => console.log(`getting error in api http://localhost:8081/orders/task/${taskId}/complete`));
    }
  };
  const submitHandler = () => {
      let param = {};
        if(userGroup === 'scrumMasters'){
            param = {
                "scrumMasterApproved": taskText
            }
        }else if(userGroup === 'deliveryMasters'){
            param = {
                "dmApproved": taskText
            }
        }else if(userGroup === 'userMasters'){
            param = {
                "task": taskText
            }
        }
        if(param){
            completeTask(param);
        }
  }
  const disabledClass = taskDisabled === false ? "opacity-50 cursor-not-allowed" : '';
  return (
    <div className="App">
      <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div className="flex items-center justify-between">
          <button
            className={`bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded ml-auto ${disabledClass}`}
            type="button"
            onClick={startProcess}
          >
            Start Process
          </button>

          <button
            className={`bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded ml-5 ${disabledClass}`}
            type="button"
            onClick={claimTask}
          >
            Claim
          </button>
        </div>
        {createform()}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={submitHandler}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserAuth;
