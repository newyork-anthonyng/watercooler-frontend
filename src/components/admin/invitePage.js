import React from "react";
import { useMachine } from "@xstate/react";
import {
  inviteStateMachine,
  initMachineOptions,
} from "./invitePageStateMachine";
import { Link } from "react-router-dom";

const InvitePage = () => {
  const [state, send] = useMachine(inviteStateMachine, initMachineOptions);

  if (state.matches("unauthorized")) {
    return (
      <p>
        <Link to="/login">Log in</Link> to view this page.{" "}
      </p>
    );
  }

  if (state.matches("invited")) {
    return <p>{state.context.email} was invited!</p>;
  }

  const handleEmailChange = (e) => {
    send({ type: "INPUT_EMAIL", email: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit");
    send({ type: "SUBMIT" });
  };

  return (
    <div>
      <h1>Invite users to your team</h1>

      {state.matches("loading") && <p>Loading...</p>}
      {state.matches("ready") && (
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="text"
              onChange={handleEmailChange}
              value={state.context.email}
              placeholder="Enter email"
            />
          </label>
          <button type="submit">Invite</button>
        </form>
      )}
      {state.matches("waitingResponse") && <p>Inviting user...</p>}
      {state.matches("ready.inviteService.error") && (
        <p>Error inviting user. Try again later.</p>
      )}
      {state.matches("ready.email.error.empty") && <p>Email is blank.</p>}
    </div>
  );
};

export default InvitePage;
