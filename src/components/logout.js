import React from "react";
import { useMachine } from "@xstate/react";
import { logoutMachine, initMachineOptions } from "./logoutStateMachine";
import { Redirect } from "react-router-dom";

function Logout() {
  const [state, send] = useMachine(logoutMachine, initMachineOptions);
  const handleButtonClick = () => {
    send({ type: "CLICK_LOGOUT" });
  };

  if (state.matches("success")) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <button
        onClick={handleButtonClick}
        disabled={state.matches("waitingResponse")}
      >
        {state.matches("waitingResponse") ? "Logging off" : "Log off"}
      </button>
      {state.matches("ready.error") && (
        <div>Problem logging off. Try again</div>
      )}
    </div>
  );
}

export default Logout;
