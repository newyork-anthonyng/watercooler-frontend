const BASE_URL = "http://localhost:3000";
const VERIFY_URL = `${BASE_URL}/verify-additional-information`;

const SOMETHING_WENT_WRONG_CODE = 1;

const inviteAccept = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
  passwordConfirmation,
}) => {
  return new Promise((resolve, reject) => {
    fetch(VERIFY_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          password,
          password_confirmation: passwordConfirmation,
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return reject({ code: SOMETHING_WENT_WRONG_CODE });
        }

        resolve();
      })
      .catch(() => reject({ code: SOMETHING_WENT_WRONG_CODE }));
  });
};

export default inviteAccept;
