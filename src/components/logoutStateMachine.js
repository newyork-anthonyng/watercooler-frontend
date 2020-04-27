import logout from "../api/logout";

import { Machine } from "xstate";
const logoutMachine = Machine({
  id: "logout",
  initial: "ready",
  on: {
    CLICK_LOGOUT: {
      target: "waitingResponse",
    },
  },
  states: {
    ready: {
      initial: "noError",
      states: {
        noError: {},
        error: {},
      },
    },
    waitingResponse: {
      invoke: {
        src: "requestLogout",
        onDone: {
          actions: "onSuccess",
          target: "success",
        },
        onError: "ready.error",
      },
    },
    success: { type: "final" },
  },
});

const initMachineOptions = {
  services: { requestLogout: logout },
  actions: {
    onSuccess: () => {
      //   alert("Logging off");
    },
  },
};

export { logoutMachine, initMachineOptions };
