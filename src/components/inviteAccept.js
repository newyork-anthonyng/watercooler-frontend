import React from "react";
import { useMachine } from "@xstate/react";
import {
  inviteStateMachine,
  initMachineOptions,
} from "./inviteAcceptStateMachine";

const InviteAcceptForm = () => {
  const [state, send] = useMachine(inviteStateMachine, initMachineOptions);

  const handleJoin = () => {
    send({ type: "NEXT" });
  };
  const handleFirstNameChange = (e) => {
    send({ type: "INPUT_FIRST_NAME", firstName: e.target.value });
  };
  const handleLastNameChange = (e) => {
    send({ type: "INPUT_LAST_NAME", lastName: e.target.value });
  };
  const handlePhoneNumberChange = (e) => {
    send({ type: "INPUT_PHONE_NUMBER", phoneNumber: e.target.value });
  };
  const handlePasswordChange = (e) => {
    send({ type: "INPUT_PASSWORD", password: e.target.value });
  };
  const handlePasswordConfirmationChange = (e) => {
    send({
      type: "INPUT_PASSWORD_CONFIRMATION",
      passwordConfirmation: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    send({ type: "SUBMIT" });
  };

  if (state.matches("greeting")) {
    return (
      <div>
        <h1>Hi</h1>
        <p>
          You've been invited by <b>SOMEONE</b> to join the <b>SOMETHING</b>.
          Click below to accept your invite, and create your account!
        </p>
        <button onClick={handleJoin}>Accept & join</button>
      </div>
    );
  }

  if (state.matches("success")) {
    return (
      <div>
        <h1>Thank you</h1>
        <h2>Your form was submitted successfully.</h2>
        <p>We are delivering a confirmation to the email you specified.</p>
        <p>
          Please click the verification link in that email to finish registering
          your account!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {state.matches("ready.companyName.error.empty") && (
          <div>Company name shouldn't be empty</div>
        )}
        {state.matches("ready.companyName.error.companyNameTaken") && (
          <div>Company name is already taken</div>
        )}
        <label>
          Company Name
          <input type="text" value={"Something"} />
        </label>
      </div>
      <div>
        <label>
          Email
          <input type="text" value={"Something"} />
        </label>
      </div>
      <div>
        {state.matches("ready.firstName.error.empty") && (
          <div>First name shouldn't be empty</div>
        )}
        <label>
          First Name
          <input
            type="text"
            value={state.context.firstName}
            onChange={handleFirstNameChange}
          />
        </label>
      </div>
      <div>
        {state.matches("ready.lastName.error.empty") && (
          <div>Last name shouldn't be empty</div>
        )}
        <label>
          Last Name
          <input
            type="text"
            value={state.context.lastName}
            onChange={handleLastNameChange}
          />
        </label>
      </div>
      <div>
        {state.matches("ready.phoneNumber.error.empty") && (
          <div>Phone number shouldn't be empty</div>
        )}
        <label>
          Phone Number
          <input
            type=""
            value={state.context.phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </label>
      </div>
      <div>
        {state.matches("ready.password.error.empty") && (
          <div>Password shouldn't be empty</div>
        )}
        <label>
          Password
          <input
            type="password"
            value={state.context.password}
            onChange={handlePasswordChange}
          />
        </label>
      </div>
      <div>
        {state.matches("ready.passwordConfirmation.error.empty") && (
          <div>Password confirmation shouldn't be empty</div>
        )}
        <label>
          Re-Enter Password
          <input
            type="password"
            value={state.context.passwordConfirmation}
            onChange={handlePasswordConfirmationChange}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={state.matches("waitingResponse")}
        onClick={handleSubmit}
      >
        Create Account
      </button>
      {state.matches("waitingResponse") && <p>Joining team...</p>}
    </form>
  );
};

export default InviteAcceptForm;
