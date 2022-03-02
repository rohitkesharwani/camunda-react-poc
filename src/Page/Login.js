import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

function Login() {
  const users = [
    {
      id: "dinesh1",
      name: "dinesh",
      pass: "dinesh",
      userGroup: "deliveryMasters",
    },
    {
      id: "kapil2",
      name: "kapil",
      pass: "kapil",
      userGroup: "scrumMasters",
    },
    {
      id: "aditya3",
      name: "aditya",
      pass: "aditya",
      userGroup: "userMasters",
    },
  ];
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();
  const changeHandler = (e) => {
    // console.log(e.target.id, "ddd")
    if (e.target.id === "username") {
      setUsername(e.target.value);
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
    }
  };
  const submitHandler = (e) => {
    const loginUser = users.find(
      (user) => user.name === username && user.pass === password
    );
    if (loginUser) {
      sessionStorage.setItem("user", JSON.stringify(loginUser));
      history.push("/userauth");
    }
  };
  return (
    <div className="App">
      <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="username"
            type="text"
            placeholder="Username"
            onChange={changeHandler}
            value={username}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            type="password"
            placeholder="******************"
            onChange={changeHandler}
            value={password}
          />
          <p className="text-red text-xs italic">Please choose a password.</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={submitHandler}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
