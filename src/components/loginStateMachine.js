import { Machine, assign } from "xstate";
import signIn from "../api/login";

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
      target: ["ready.email.noError", "ready.authService.noError"],
    },
    INPUT_PASSWORD: {
      actions: "cachePassword",
      target: ["ready.password.noError", "ready.authService.noError"],
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
          target: "success",
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
    success: {
      type: "final",
    },
  },
});

const initMachineOptions = {
  guards: {
    isNoEmail: (context, _) => context.email.length === 0,
    isNoPassword: (context, _) => context.password.length === 0,
    isNoAccount: (_, event) => {
      return event.data.code === 1;
    },
    isIncorrectPassword: (_, event) => event.data.code === 1,
    isNoResponse: (_, event) => event.data.code === 2,
  },
  services: {
    requestSignIn: (context, _) => signIn(context.email, context.password),
  },
  actions: {
    cacheEmail: assign((_, event) => ({
      email: event.email,
    })),
    cachePassword: assign((_, event) => ({
      password: event.password,
    })),
    onSuccess: () => {
      // alert("signed in");
    },
  },
};

export { loginStateMachine, initMachineOptions };
