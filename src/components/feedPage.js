import React from "react";
import LogoutButton from "./logout";
import { useMachine } from "@xstate/react";
import { Link } from "react-router-dom";
import { Machine } from "xstate";

const feedPageStateMachine = Machine({
  id: "feedPage",
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: "fetchInfo",
        onDone: "ready",
        onError: {
          cond: "isNotAuthorized",
          target: "unauthorized",
        },
      },
    },
    ready: {},
    unauthorized: { type: "final" },
  },
});

const machineOptions = {
  guards: {
    isNotAuthorized: () => true,
  },
  services: {
    fetchInfo: () => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
      });
    },
  },
};

function FeedPage() {
  const [state] = useMachine(feedPageStateMachine, machineOptions);

  if (state.matches("unauthorized")) {
    return (
      <div>
        You need to <Link to="/login">log in</Link> to see this page.
      </div>
    );
  }
  if (state.matches("loading")) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <LogoutButton />
      <h1>This is a private page!</h1>
    </div>
  );
}

export default FeedPage;
