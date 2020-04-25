import React from "react";
import { useMachine } from "@xstate/react";
import { loginStateMachine, initMachineOptions } from "./loginStateMachine";

const LogInForm = () => {
  const [state, send] = useMachine(loginStateMachine, initMachineOptions);

  const handleEmailChange = (e) => {
    send({ type: "INPUT_EMAIL", email: e.target.value });
  };
  const handlePasswordChange = (e) => {
    send({ type: "INPUT_PASSWORD", password: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    send({ type: "SUBMIT" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Email:
          <input
            type="text"
            value={state.context.email}
            onChange={handleEmailChange}
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            value={state.context.password}
            onChange={handlePasswordChange}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={state.matches("waitingResponse")}
        onClick={handleSubmit}
      >
        Login
      </button>

      {state.matches("waitingResponse") && <p>Signing in...</p>}
      {state.matches("ready.authService.error.communication") &&
        "Something happened with the network call. Try again."}
      {state.matches("ready.authService.error.authentication") &&
        "Email/password combination do not match."}
      {state.matches("ready.email.error.empty") && "Email is blank."}
      {state.matches("ready.password.error.empty") && "Password is blank."}
    </form>
  );
};

export default LogInForm;
