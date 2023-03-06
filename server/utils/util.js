import bcrypt from "bcryptjs";
import moment from "moment";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtKey = process.env.JWT_KEY;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const getUtcDate = () => {
  var utcMoment = moment.utc();
  var utcDate = new Date(utcMoment.format());
  return utcDate;
};

export const comparePassword = async (password, hash) => {
  // console.log("password::", password);
  // console.log("hash::", hash);

  let resut = bcrypt.compareSync(password, hash);
  return resut;
};

// const getToken = (email, id, user) => {
//   console.log("payload utils:::", email);
//   const token = jwt.sign(
//     {
//       email,
//       id,
//       user,
//     },
//     jwtKey,
//     {
//       expiresIn: "1d", // 1 Week
//     }
//   );
//   console.log("token:::", token);
//   return token;
// };

export const getPayload = (token) => {
  // console.log("token in payload::", token);
  try {
    const payload = Jwt.verify(token, jwtKey);
    // console.log("payload::", payload);
    return { loggedIn: true, payload };
  } catch (err) {
    // Add Err Message
    // console.log("error in payload:::", err);
    return { loggedIn: false };
  }
};
