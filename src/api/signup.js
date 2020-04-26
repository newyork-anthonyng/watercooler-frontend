const BASE_URL = "http://localhost:3000";
const SIGNUP_URL = `${BASE_URL}/teams`;

const TEAM_NAME_TAKEN = 1;
const EMAIL_ADDRESS_TAKEN = 2;
const SOMETHING_WENT_WRONG_CODE = 3;

const signup = ({
  companyName,
  email,
  firstName,
  lastName,
  phoneNumber,
  password,
  passwordConfirmation,
}) => {
  return new Promise((resolve, reject) => {
    let cachedResponseHeaders = null;

    fetch(SIGNUP_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team: {
          name: companyName,
        },
        user: {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      }),
    })
      .then((response) => {
        cachedResponseHeaders = {
          ok: response.ok,
          status: response.status,
        };

        return response.json();
      })
      .then((response) => {
        if (cachedResponseHeaders.ok) {
          return resolve();
        }
        if (teamNameTaken(response)) {
          return reject({ code: TEAM_NAME_TAKEN });
        }
        if (emailAddressTaken(response)) {
          return reject({ code: EMAIL_ADDRESS_TAKEN });
        }
        return reject({ code: SOMETHING_WENT_WRONG_CODE });
      })
      .catch(() => reject({ code: SOMETHING_WENT_WRONG_CODE }));
  });
};

function teamNameTaken(response) {
  const nameValidationErrors = (response.team && response.team.name) || [];
  return nameValidationErrors.includes("has already been taken");
}

function emailAddressTaken(response) {
  const emailValidationErrors = (response.user && response.user.email) || [];
  return emailValidationErrors.includes("has already been taken");
}

export default signup;
