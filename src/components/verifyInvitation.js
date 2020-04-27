import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import verifyInvite from "../api/verifyInvite";

const verifyStateMachine = (invitationHash) =>
  Machine({
    id: "verifyInvitation",
    context: {
      invitationHash,
    },
    initial: "loading",
    states: {
      loading: {
        invoke: {
          src: "loadInvitation",
          onError: "error",
          onDone: "success",
        },
      },
      error: {},
      success: {},
    },
  });

const initMachineOptions = {
  services: {
    loadInvitation: (context, event) => verifyInvite(context.invitationHash),
  },
};

function VerifyInvitationPage() {
  const { invitationHash } = useParams();
  const [state] = useMachine(
    verifyStateMachine(invitationHash),
    initMachineOptions
  );

  if (state.matches("error")) {
    return (
      <div>
        <h1>Invitation isn't valid</h1>
      </div>
    );
  }

  if (state.matches("loading")) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>
        Email verified! Go login now. <Redirect to="/login">Login</Redirect>
      </h1>
    </div>
  );
}

export default VerifyInvitationPage;
