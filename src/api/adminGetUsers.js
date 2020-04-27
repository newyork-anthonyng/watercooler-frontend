const BASE_URL = "http://localhost:3000";
const USERS_URL = `${BASE_URL}/users`;

const UNAUTHORIZED_CODE = 1;
const SOMETHING_WENT_WRONG_CODE = 2;

const getUsers = () => {
  return new Promise((resolve, reject) => {
    fetch(USERS_URL, {
      method: "GET",
      credentials: "include",
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
      .then((response) => {
        resolve(response);
      })
      .catch(() => reject({ code: SOMETHING_WENT_WRONG_CODE }));
  });
};

export default getUsers;
