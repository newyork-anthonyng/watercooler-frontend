const BASE_URL = "http://localhost:3000";
const LOGOUT_URL = `${BASE_URL}/logout`;

const logoff = () => {
  return new Promise((resolve, reject) => {
    fetch(LOGOUT_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

export default logoff;
