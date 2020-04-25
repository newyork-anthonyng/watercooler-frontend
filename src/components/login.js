import React from "react";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";

const isNoResponse = () => Math.random() >= 0.75;

const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email !== "admin") {
        return reject({ code: 1 });
      }

      if (password !== "admin") {
        return reject({ code: 2 });
      }

      if (isNoResponse()) {
        return reject({ code: 3 });
      }

      resolve();
    }, 1500);
  });
};

const loginStateMachine = Machine({
  id: "login",
  context: {
    email: "",
    password: "",
  },
  initial: "ready",
  on: {
    INPUT_EMAIL: {
      actions: "cacheEmail",
      target: "ready.email.noError",
    },
    INPUT_PASSWORD: {
      actions: "cachePassword",
      target: "ready.password.noError",
    },
    SUBMIT: [
      { cond: "isNoEmail", target: "ready.email.error.empty" },
      { cond: "isNoPassword", target: "ready.password.error.empty" },
      { target: "waitingResponse" },
    ],
  },
  states: {
    ready: {
      type: "parallel",
      states: {
        email: {
          initial: "noError",
          states: {
            noError: {},
            error: {
              initial: "empty",
              states: {
                empty: {},
              },
            },
          },
        },
        password: {
          initial: "noError",
          states: {
            noError: {},
            error: {
              initial: "empty",
              states: {
                empty: {},
              },
            },
          },
        },
        authService: {
          initial: "noError",
          states: {
            noError: {},
            error: {
              initial: "communication",
              states: {
                communication: {
                  on: {
                    SUBMIT: "#login.waitingResponse",
                  },
                },
                authentication: {},
              },
            },
          },
        },
      },
    },
    waitingResponse: {
      invoke: {
        src: "requestSignIn",
        onDone: {
          actions: "onSuccess",
        },
        onError: [
          {
            cond: "isNoAccount",
            target: "ready.authService.error.authentication",
          },
          {
            cond: "isIncorrectPassword",
            target: "ready.authService.error.authentication",
          },
          {
            cond: "isNoResponse",
            target: "ready.authService.error.communication",
          },
        ],
      },
    },
  },
});

const initMachineOptions = () => ({
  guards: {
    isNoEmail: (context, event) => context.email.length === 0,
    isNoPassword: (context, event) => context.password.length === 0,
    isNoAccount: (context, event) => {
      return event.data.code === 1;
    },
    isIncorrectPassword: (context, event) => event.data.code === 2,
    isNoResponse: (context, event) => event.data.code === 3,
  },
  services: {
    requestSignIn: (context, event) => signIn(context.email, context.password),
  },
  actions: {
    cacheEmail: assign((context, event) => ({
      email: event.email,
    })),
    cachePassword: assign((context, event) => ({
      password: event.password,
    })),
    onSuccess: () => {
      alert("signed in");
    },
  },
});

const LogInForm = () => {
  const [state, send] = useMachine(loginStateMachine, initMachineOptions());

  const handleEmailChange = (e) => {
    send({ type: "INPUT_EMAIL", email: e.target.value });
  };
  const handlePasswordChange = (e) => {
    send({ type: "INPUT_PASSWORD", password: e.target.value });
  };
  const handleSubmit = () => {
    send({ type: "SUBMIT" });
  };

  return (
    <div>
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
    </div>
  );
};

export default LogInForm;
