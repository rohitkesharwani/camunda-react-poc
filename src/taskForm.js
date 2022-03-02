import React, { useState } from "react";
import axios from "axios";

function TaskForm({taskFormHandler}) {
  const [orderId, setOrderId] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const submitHandler = () => {
    if (orderId && orderAmount) {
      axios
        .post("http://localhost:8081/place-order", 
          { orderId: orderId, orderAmount: orderAmount },
        )
        .then((res) => {
          console.log(res.data);
          taskFormHandler(false, res.data.orderId);
        });
    }
  };
  const inputChangeHandler = (e, type) => {
    switch (type) {
      case "orderId":
        setOrderId(e.target.value);
        break;
      case "orderAmount":
        setOrderAmount(e.target.value);
        break;
      default:
    }
  };
  return (
    <div className="formContainer">
      <form>
        <div className="formItem">
          <label className="label">OrderId</label>
          <input
            className="textBox"
            type="text"
            name="orderId"
            value={orderId}
            onChange={(e) => inputChangeHandler(e, "orderId")}
          />
        </div>
        <div className="formItem">
          <label className="label">Order Amount</label>
          <input
            className="textBox"
            type="text"
            name="orderAmount"
            value={orderAmount}
            onChange={(e) => inputChangeHandler(e, "orderAmount")}
          />
        </div>
        <div className="formItem center">
          <input type="button" value="Submit" onClick={submitHandler} />
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
