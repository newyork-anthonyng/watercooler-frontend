const isNoResponse = () => Math.random() >= 0.75;

const inviteAccept = ({
  firstName,
  lastName,
  phoneNumeber,
  password,
  passwordConfirmation,
}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (firstName === "admin") {
        return reject({ code: 1 });
      }

      resolve();
    }, 1500);
  });
};

export default inviteAccept;
