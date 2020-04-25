import { Machine, assign } from "xstate";
import signup from "../api/signup";

const signupStateMachine = Machine({
  id: "signup",
  context: {
    companyName: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    passwordConfirmation: "",
  },
  initial: "ready",
  on: {
    INPUT_COMPANY_NAME: {
      actions: "cacheCompanyName",
      target: [],
    },
    INPUT_EMAIL: {
      actions: "cacheEmail",
      target: [],
    },
    INPUT_FIRST_NAME: {
      actions: "cacheFirstName",
      target: [],
    },
    INPUT_LAST_NAME: {
      actions: "cacheLastName",
      target: [],
    },
    INPUT_PHONE_NUMBER: {
      actions: "cachePhoneNumber",
      target: [],
    },
    INPUT_PASSWORD: {
      actions: "cachePassword",
      target: [],
    },
    INPUT_PASSWORD_CONFIRMATION: {
      actions: "cachePasswordConfirmation",
      target: [],
    },
    SUBMIT: [
      { cond: "isNoCompanyName", target: [] },
      { cond: "isNoEmail", target: "ready.email.error.empty" },
      { cond: "isNoFirstName", target: [] },
      { cond: "isNoLastName", target: [] },
      { cond: "isNoPhoneNumber", target: [] },
      { cond: "isNoPassword", target: [] },
      { cond: "isNoPasswordConfirmation", target: [] },
      { target: "waitingResponse" },
    ],
  },
  states: {
    ready: {
      type: "parallel",
      states: {
        companyName: {
          initial: "noError",
          states: {
            noError: {},
            error: {
              intial: "empty",
              states: { empty: {} },
            },
          },
        },
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
        firstName: {
          initial: "noError",
          states: {
            noError: {},
            error: {
              initial: "empty",
              states: { empty: {} },
            },
          },
        },
        lastName: {
          initial: "noError",
          states: {
            noError: {},
            error: {
              initial: "empty",
              states: { empty: {} },
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
                    SUBMIT: "#login.waitingResponse",
                  },
                },
                companyNameTaken: {},
                emailTaken: {},
              },
            },
          },
        },
      },
    },
    waitingResponse: {
      invoke: {
        src: "requestSignUp",
        onDone: {
          actions: "onSuccess",
        },
        onError: [
          {
            cond: "isCompanyNameTaken",
            target: "ready.authService.error.companyNameTaken",
          },
          {
            cond: "isEmailTaken",
            target: "ready.authService.error.emailTaken",
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

const initMachineOptions = {
  guards: {
    isNoCompanyName: (context, _) => context.companyName.length === 0,
    isNoEmail: (context, _) => context.email.length === 0,
    isNoFirstName: (context, _) => context.firstName.length === 0,
    isNoLastName: (context, _) => context.lastName.length === 0,
    isNoPhoneNumber: (context, _) => context.phoneNumber.length === 0,
    isNoPassword: (context, _) => context.password.length === 0,
    isNoPasswordConfirmation: (context, _) =>
      context.passwordConfirmation.length === 0,
    isCompanyNameTaken: () => {},
    isEmailTaken: () => {},
    isNoResponse: (_, event) => event.data.code === 3,
  },
  services: {
    requestSignUp: (context, _) => signup(context.email, context.password),
  },
  actions: {
    cacheCompanyName: assign((_, event) => ({
      companyName: event.companyName,
    })),
    cacheEmail: assign((_, event) => ({
      email: event.email,
    })),
    cacheFirstName: assign((_, event) => ({
      firstName: event.firstName,
    })),
    cacheLastName: assign((_, event) => ({
      lastName: event.lastName,
    })),
    cachePhoneNumber: assign((_, event) => ({
      phoneNumber: event.phoneNumber,
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

export { signupStateMachine, initMachineOptions };
