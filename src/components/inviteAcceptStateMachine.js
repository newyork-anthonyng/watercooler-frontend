import { Machine, assign } from "xstate";
import inviteAccept from "../api/inviteAccept";

const inviteStateMachine = Machine({
  id: "inviteAccept",
  context: {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    passwordConfirmation: "",
  },
  initial: "greeting",
  on: {
    INPUT_FIRST_NAME: {
      actions: "cacheFirstName",
      target: "ready.firstName.noError",
    },
    INPUT_LAST_NAME: {
      actions: "cacheLastName",
      target: "ready.lastName.noError",
    },
    INPUT_PHONE_NUMBER: {
      actions: "cachePhoneNumber",
      target: "ready.phoneNumber.noError",
    },
    INPUT_PASSWORD: {
      actions: "cachePassword",
      target: "ready.password.noError",
    },
    INPUT_PASSWORD_CONFIRMATION: {
      actions: "cachePasswordConfirmation",
      target: "ready.passwordConfirmation.noError",
    },
    SUBMIT: [
      { cond: "isNoFirstName", target: "ready.firstName.error.empty" },
      { cond: "isNoLastName", target: "ready.lastName.error.empty" },
      { cond: "isNoPhoneNumber", target: "ready.phoneNumber.error.empty" },
      { cond: "isNoPassword", target: "ready.password.error.empty" },
      {
        cond: "isNoPasswordConfirmation",
        target: "ready.passwordConfirmation.error.empty",
      },
      { target: "waitingResponse" },
    ],
  },
  states: {
    greeting: {
      on: {
        NEXT: "ready",
      },
    },
    ready: {
      type: "parallel",
      states: {
        firstName: {
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
        lastName: {
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
        phoneNumber: {
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
        passwordConfirmation: {
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
                    SUBMIT: "#inviteAccept.waitingResponse",
                  },
                },
              },
            },
          },
        },
      },
    },
    waitingResponse: {
      invoke: {
        src: "requestInviteAccept",
        onDone: {
          actions: "onSuccess",
          target: "success",
        },
        onError: [
          {
            cond: "isNoResponse",
            target: "ready.authService.error.communication",
          },
        ],
      },
    },
    success: { type: "final" },
  },
});

const initMachineOptions = {
  guards: {
    isNoFirstName: (context, _) => context.firstName.length === 0,
    isNoLastName: (context, _) => context.lastName.length === 0,
    isNoPhoneNumber: (context, _) => context.phoneNumber.length === 0,
    isNoPassword: (context, _) => context.password.length === 0,
    isNoPasswordConfirmation: (context, _) =>
      context.passwordConfirmation.length === 0,
    isNoResponse: (_, event) => event.data.code === 1,
  },
  services: {
    requestInviteAccept: (context, _) => inviteAccept(context),
  },
  actions: {
    cacheFirstName: assign((_, event) => ({
      firstName: event.firstName,
    })),
    cacheLastName: assign((_, event) => ({
      lastName: event.lastName,
    })),
    cachePhoneNumber: assign((_, event) => ({
      phoneNumber: event.phoneNumber,
    })),
    cacheEmail: assign((_, event) => ({
      email: event.email,
    })),
    cachePassword: assign((_, event) => ({
      password: event.password,
    })),
    cachePasswordConfirmation: assign((_, event) => ({
      passwordConfirmation: event.passwordConfirmation,
    })),
    onSuccess: () => {
      alert("signed in");
    },
  },
};

export { inviteStateMachine, initMachineOptions };
