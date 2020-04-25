import React from "react";
import { useMachine } from "@xstate/react";
import { signupStateMachine, initSignupOptions } from "./signupStateMachine";

const LogInForm = () => {
  const [state, send] = useMachine(signupStateMachine, initSignupOptions);

  const handleCompanyNameChange = (e) => {
    send({ type: "INPUT_COMPANY_NAME", companyName: e.target.value });
  };
  const handleEmailChange = (e) => {
    send({ type: "INPUT_EMAIL", email: e.target.value });
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
  const handleSubmit = () => {
    send({ type: "SUBMIT" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Company Name
          <input
            type="text"
            value={state.context.companyName}
            onChange={handleCompanyNameChange}
          />
        </label>
      </div>
      <div>
        <label>
          Email
          <input
            type="text"
            value={state.context.email}
            onChange={handleEmailChange}
          />
        </label>
      </div>
      <div>
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
