import React, { useState, useEffect } from "react";
import axios from "axios";

function UserAuth() {
  const userId = JSON.parse(sessionStorage.user).name;
  const userGroup = JSON.parse(sessionStorage.user).userGroup;
  const [formData, setFormData] = useState([]);
  const [taskText, setTaskText] = useState("");
  // const [processId, setProcessId] = useState('');
  const [taskId, setTaskId] = useState("");
  const [taskDisabled, setTaskDisabled] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  // const [userAcceptance, setUserAcceptance] = useState(false);

  const startProcess = () => {
    if (userId) {
      axios
        .post(
          "http://localhost:8081/engine-rest/process-definition/key/Callaboration_poc/start",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(
            res.data,
            "http://localhost:8081/engine-rest/process-definition/key/Callaboration_poc/start"
          );
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
          console.log(
            "claim:",
            `http://localhost:8081/orders/task/${taskId}/claim/${userId}`
          );
          setTaskDisabled(false);
        })
        .catch((e) =>
          console.log(`getting error in api /task/${taskId}/claim/${userId}`)
        );
    }
  };

  const getUserTask = () => {
    if (userId && !formData.length) {
      axios
        .get(`http://localhost:8081/tasks/${userId}`)
        .then((res) => {
          console.log(res.data, `http://localhost:8081/tasks/${userId}`);
          setFormData(res.data.result);
          if (!taskId) {
            setTaskId(res.data.result[0].taskId);
          }
        })
        .catch((e) =>
          console.log("error in api", `http://localhost:8081/tasks/${userId}`)
        );
    }
  };

  const createform = () => {
    const formArr = formData.find((item) => taskId === item.taskId);
    return formArr.formFields.map((item, key) => {
      const inputType = item.type.name === "boolean" ? "checkbox" : "text";
      const className =
        item.type.name === "boolean"
          ? "ml-10"
          : "shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker";

      const changeHandler = (e) => {
        const val = inputType === "text" ? e.target.value : e.target.checked;
        setTaskText(val);
      };
      return (
        <div className="mb-4" key={key}>
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="taskText"
          >
            {item.label || "Enter task details"}
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

  const updateTaskID = (taskId) => {
    setTaskId(taskId);
  };
  const taskList = () => {
    return formData.map((item) => {
      return (
        <li
          className="border list-none rounded-sm px-3 py-3 hover:bg-white"
          onClick={(e) => updateTaskID(item.taskId)}
          key={item.taskId}
        >
          {item.taskId}
        </li>
      );
    });
  };

  useEffect(() => {
    getUserTask();
  });

  const completeTask = (param) => {
    if (taskId && userId) {
      axios
        .post(`http://localhost:8081/orders/task/${taskId}/complete`, param)
        .then((res) => {
          setShowMessage(true);
        })
        .catch((e) =>
          console.log(
            `getting error in api http://localhost:8081/orders/task/${taskId}/complete`
          )
        );
    }
  };
  const submitHandler = () => {
    let param = {};
    if (userGroup === "scrumMasters") {
      param = {
        scrumMasterApproved: taskText,
      };
    } else if (userGroup === "deliveryMasters") {
      param = {
        dmApproved: taskText,
      };
    } else if (userGroup === "userMasters") {
      param = {
        task: taskText,
      };
    }
    if (param) {
      completeTask(param);
    }
  };

  return (
    <div className="App">
      <div className="grid grid-cols-4">
        <div className="left-panel">
          <button
            className={`bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded w-auto`}
            type="button"
            onClick={startProcess}
            disabled={!taskDisabled}
          >
            Start Process
          </button>
          <ul>{taskList()}</ul>
        </div>
        <div className="rightPanel col-span-3">
          <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
            <div className="flex items-center justify-between ml-auto">
              <button
                className={`bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded ml-5`}
                type="button"
                onClick={claimTask}
                disabled={!taskDisabled}
              >
                Claim
              </button>
            </div>
            {taskId && createform()}
            <div className="flex items-center justify-between">
              <button
                className={`bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded`}
                type="button"
                onClick={submitHandler}
                disabled={taskDisabled}
              >
                Submit
              </button>
            </div>
          </div>
          {showMessage && 
          <h2>Completed the Task Id is: {taskId} </h2>
          }
          
        </div>
      </div>
    </div>
  );
}

export default UserAuth;
