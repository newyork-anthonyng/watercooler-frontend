import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import verifyInvite from "../api/verifyInvite";
import AdditionalInformation from "./additionalInformation";

const verifyStateMachine = (invitationHash) =>
  Machine({
    id: "verifyInvitation",
    context: {
      invitationHash,
      data: undefined,
    },
    initial: "loading",
    states: {
      loading: {
        invoke: {
          src: "loadInvitation",
          onError: "error",
          onDone: [
            {
              actions: "cacheResponse",
              cond: "isFurtherInformationNeeded",
              target: "additionalInformation",
            },
            { target: "success" },
          ],
        },
      },
      error: {},
      additionalInformation: {},
      success: {},
    },
  });

const initMachineOptions = {
  actions: {
    cacheResponse: assign((_, event) => {
      return { data: event.data };
    }),
  },
  guards: {
    isFurtherInformationNeeded: (context, event) => {
      return event.data;
    },
  },
  services: {
    loadInvitation: (context, _event) => verifyInvite(context.invitationHash),
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

  if (state.matches("additionalInformation")) {
    return (
      <div>
        <AdditionalInformation
          teamName={state.context.data.team}
          email={state.context.data.email}
        />
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
