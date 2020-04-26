const isNoResponse = () => Math.random() >= 0.75;

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
    setTimeout(() => {
      if (email === "admin") {
        return reject({ code: 1 });
      }

      if (companyName === "admin") {
        return reject({ code: 2 });
      }

      if (isNoResponse()) {
        return reject({ code: 3 });
      }

      resolve();
    }, 1500);
  });
};

export default signup;
