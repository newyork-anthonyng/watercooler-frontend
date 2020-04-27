const BASE_URL = "http://localhost:3000";
const VERIFY_INVITY_URL = `${BASE_URL}/verify`;

const SOMETHING_WENT_WRONG_CODE = 1;

const verifyInvite = (invitationHash) => {
  return new Promise((resolve, reject) => {
    fetch(`${VERIFY_INVITY_URL}/${invitationHash}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return reject({ code: SOMETHING_WENT_WRONG_CODE });
        }

        return resolve();
      })
      .catch(() => reject({ code: SOMETHING_WENT_WRONG_CODE }));
  });
};

export default verifyInvite;
