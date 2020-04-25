const isNoResponse = () => Math.random() >= 0.75;

const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email !== "admin") {
        return reject({ code: 1 });
      }

      if (password !== "admin") {
        return reject({ code: 2 });
      }

      if (isNoResponse()) {
        return reject({ code: 3 });
      }

      resolve();
    }, 1500);
  });
};

export default signIn;
