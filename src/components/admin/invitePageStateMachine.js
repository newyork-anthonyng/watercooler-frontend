import { Machine, assign } from "xstate";
import inviteUser from "../../api/inviteUser";

const inviteStateMachine = Machine({
  id: "invite",
  context: {
    email: "",
  },
  initial: "loading",

  on: {
    INPUT_EMAIL: {
      actions: "cacheEmail",
      target: ["ready.email.noError", "ready.inviteService.noError"],
    },
    SUBMIT: [
      { cond: "isNoEmail", target: "ready.email.error.empty" },
      { target: "waitingResponse" },
    ],
  },

  states: {
    loading: {
      invoke: {
        src: "fetchInfo",
        onDone: {
          target: "ready",
        },
        onError: [
          {
            cond: "isNotAuthorized",
            target: "unauthorized",
          },
        ],
      },
    },
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

        inviteService: {
          initial: "noError",
          states: {
            noError: {},
            error: {},
          },
        },
      },
    },
    unauthorized: {
      type: "final",
    },
    waitingResponse: {
      invoke: {
        src: "inviteUser",
        onDone: {
          actions: "onSuccess",
          target: "invited",
        },
        onError: [
          { cond: "isNotAuthorized", target: "unauthorized" },
          {
            cond: "isErrorInvitingUser",
            target: "ready.inviteService.error",
          },
        ],
      },
    },
    invited: { type: "final" },
  },
});

const initMachineOptions = {
  guards: {
    isNotAuthorized: (context, event) => event.data.code === 1,
    isErrorInvitingUser: (context, event) => true,
    isNoEmail: (context, _) => context.email.length === 0,
  },
  services: {
    fetchInfo: (_context, _event) => {
      console.log("fetching information");
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 500);
      });
    },
    inviteUser: (context, _event) => inviteUser(context.email),
    onSuccess: (_context, _event) => {
      alert("Successfully invited user");
    },
  },
  actions: {
    cacheEmail: assign((_, event) => ({
      email: event.email,
    })),
  },
};

export { inviteStateMachine, initMachineOptions };
