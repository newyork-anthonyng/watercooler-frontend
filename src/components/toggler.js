import React from "react";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";

const isNoResponse = () => Math.random() >= 0.75;

const signIn = (email, password) => {
  console.log("email", email, "password", password);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email !== "admin") {
        return reject({ code: 1 });
      }

      if (password !== "admin") {
        console.log("i am rejecting: incorrect password");
        return reject({ code: 2 });
      }

      if (isNoResponse()) {
        return reject({ code: 3 });
      }

      resolve();
    }, 1500);
  });
};

const toggleMachine = Machine({
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
                noAccount: {},
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
                incorrect: {},
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
                internal: {},
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
            target: "ready.email.error.noAccount",
          },
          {
            cond: "isIncorrectPassword",
            target: "ready.password.error.incorrect",
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

const Toggler = () => {
  const [state, send] = useMachine(toggleMachine, initMachineOptions());

  console.log(state.value);
  return (
    <div>
      {(state.matches("waitingResponse") ||
        state.value === "waitingResponse") && <h1>Loading...</h1>}
      {state.matches("ready.authService.error.communication") && (
        <p>Issue logging in. Try again.</p>
      )}
      {state.matches("ready.email.error") && (
        <div>
          {state.matches("ready.email.error.empty") && "Email is empty"}
          {state.matches("ready.email.error.noAccount") &&
            "Account does not exist with this email"}
        </div>
      )}
      {state.matches("ready.password.error") && (
        <div>
          {state.matches("ready.password.error.empty") && "Password is empty"}
          {state.matches("ready.password.error.incorrect") &&
            "Email/password combination does not match"}
        </div>
      )}
      <label>
        email:
        <input
          type="text"
          value={state.context.email}
          onChange={(e) => {
            send({
              type: "INPUT_EMAIL",
              email: e.target.value,
            });
          }}
        />
      </label>

      <label>
        password:
        <input
          type="password"
          value={state.context.password}
          onChange={(e) => {
            send({ type: "INPUT_PASSWORD", password: e.target.value });
          }}
        />
      </label>

      <button
        onClick={() => {
          send({ type: "SUBMIT" });
        }}
      >
        Login
      </button>
    </div>
  );
};

export default Toggler;
