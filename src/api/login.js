const BASE_URL = "http://localhost:3000";
const LOGIN_URL = `${BASE_URL}/login`;

const UNAUTHORIZED_CODE = 1;
const SOMETHING_WENT_WRONG_CODE = 2;

const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    fetch(LOGIN_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
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

        return response.json();
      })
      .then((_) => {
        resolve();
      })
      .catch(() => reject({ code: SOMETHING_WENT_WRONG_CODE }));
  });
};

export default signIn;
