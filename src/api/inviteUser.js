const BASE_URL = "http://localhost:3000";
const LOGIN_URL = `${BASE_URL}/teams/invite`;

const UNAUTHORIZED_CODE = 1;
const SOMETHING_WENT_WRONG_CODE = 2;

const invite = (email) => {
  return new Promise((resolve, reject) => {
    fetch(LOGIN_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emails: [email],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            return reject({ code: UNAUTHORIZED_CODE });
          } else {
            return reject({ code: SOMETHING_WENT_WRONG_CODE });
          }
        }

        return resolve();
      })
      .catch(() => reject({ code: SOMETHING_WENT_WRONG_CODE }));
  });
};

export default invite;
