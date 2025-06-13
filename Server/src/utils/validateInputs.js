import validator from 'validator';

export const validateInputs = (userName, userEmail, password) => {
      if (!userName || !userEmail || !password) {
        logger.error("All fields are required");
        throw new Error("All fields are required");
      }
      if (!validator.isEmail(userEmail)) {
        logger.error("Invalid email format");
        throw new Error("Invalid email format");
      }
      const isStrong = validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      });
      if (!isStrong) {
        logger.error(
          "Password must be at least 6 characters and include an uppercase letter, lowercase letter, and a number"
        );
        throw new Error(
          "Password must be at least 6 characters and include an uppercase letter, lowercase letter, and a number"
        );
      }
    };