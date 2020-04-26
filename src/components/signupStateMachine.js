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
      target: ["ready.companyName.noError"],
    },
    INPUT_EMAIL: {
      actions: "cacheEmail",
      target: ["ready.email.noError"],
    },
    INPUT_FIRST_NAME: {
      actions: "cacheFirstName",
      target: ["ready.firstName.noError"],
    },
    INPUT_LAST_NAME: {
      actions: "cacheLastName",
      target: ["ready.lastName.noError"],
    },
    INPUT_PHONE_NUMBER: {
      actions: "cachePhoneNumber",
      target: ["ready.phoneNumber.noError"],
    },
    INPUT_PASSWORD: {
      actions: "cachePassword",
      target: ["ready.password.noError"],
    },
    INPUT_PASSWORD_CONFIRMATION: {
      actions: "cachePasswordConfirmation",
      target: ["ready.passwordConfirmation.noError"],
    },
    SUBMIT: [
      { cond: "isNoCompanyName", target: "ready.companyName.error.empty" },
      { cond: "isNoEmail", target: "ready.email.error.empty" },
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
    ready: {
      type: "parallel",
      states: {
        companyName: {
          initial: "noError",
          states: {
            noError: {},
            error: {
              intial: "empty",
              states: { empty: {}, companyNameTaken: {} },
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
                emailTaken: {},
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
                    SUBMIT: "#signup.waitingResponse",
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
        src: "requestSignUp",
        onDone: {
          actions: "onSuccess",
        },
        onError: [
          {
            cond: "isCompanyNameTaken",
            target: "ready.companyName.error.companyNameTaken",
          },
          {
            cond: "isEmailTaken",
            target: "ready.email.error.emailTaken",
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
    isCompanyNameTaken: (_, event) => {
      return event.data.code === 2;
    },
    isEmailTaken: (_, event) => {
      return event.data.code === 1;
    },
    isNoResponse: (_, event) => event.data.code === 3,
  },
  services: {
    requestSignUp: (context, _) => signup(context),
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
