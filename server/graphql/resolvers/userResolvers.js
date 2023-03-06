import User from "../../models/user.js";
import { hashPassword, getUtcDate, comparePassword } from "../../utils/util.js";
import otpGenerator from "otp-generator";
import sendEmail from "../../utils/emailUtility.js";
import config from "../../config/config.js";
import moment from "moment";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtKey = process.env.JWT_KEY;

const userResolvers = {
  Mutation: {
    async createUser(_, { firstName, lastName, email, password }) {
      // console.log("user::", firstName);
      try {
        if (!firstName || firstName == null || firstName == undefined) {
          throw new Error("First Name is required");
        } else if (!lastName || lastName == null || lastName == undefined) {
          throw new Error("Last Name is required");
        } else if (!email || email == null || email == undefined) {
          throw new Error("Email is required");
        } else if (!password || password == null || password == undefined) {
          throw new Error("Password is required");
        } else {
          const checkEmailExist = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") },
          });

          if (checkEmailExist) {
            throw new Error("Email already exist");
          }
          let hash = await hashPassword(password);
          let otpNumber = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
          });
          let utcDate = getUtcDate();

          let { delivered } = await sendEmail(
            email,
            config.email.signupSubject,
            config.email.template.emailSignupOtp(otpNumber)
          );

          if (!delivered) {
            throw new Error("Email not sent");
          } else {
            const user = new User({
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: hash,
              otpCode: otpNumber,
              otpCreateTime: utcDate,
            });
            //   console.log("user:::0", user);
            const result = await user.save();
            //   console.log("result:::", result);
            return result;
          }
        }
      } catch (error) {
        console.log("error::", error);
        throw new Error(error.message);
      }
    },
    async verifyUsersOtp(_, { email, otpCode }) {
      try {
        if (!otpCode || otpCode == null || otpCode == undefined) {
          throw new Error("Otp code is required");
        } else if (!email || email == null || email == undefined) {
          throw new Error("Email is required");
        } else {
          const userRecord = await User.findOne({
            otpCode: otpCode,
            email: { $regex: new RegExp(`^${email}$`, "i") },
          });
          if (!userRecord) {
            throw new Error("Invalid otp");
          }
          if (userRecord.Is_OTP_Verified === true) {
            throw new Error("Otp already verified");
          }
          var utcMoment = moment.utc();
          var utcDate = new Date(utcMoment.format());
          var diff =
            (utcDate.getTime() - userRecord.otpCreateTime.getTime()) / 1000;
          const diffInMinute = diff / 60;

          if (diffInMinute > config.otpExpireTime)
            throw new Error("Otp Expired");

          userRecord.isOTPVerified = true;
          userRecord.otpCode = 0;
          const result = await userRecord.save();
          return result;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async resendUserOtp(_, { email }) {
      try {
        if (!email) {
          throw new Error("Email is required");
        }

        const userRecord = await User.findOne({
          email: { $regex: new RegExp(`^${email}$`, "i") },
        });

        if (!userRecord) {
          throw new Error("User not found on this email");
        }

        if (userRecord.isOTPVerified === true) {
          throw new Error("Your account is already verified");
        }

        let otpNumber = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        let utcDate = getUtcDate();

        let { delivered } = await sendEmail(
          email,
          config.email.resendOtpSubject,
          config.email.template.resendOtp(otpNumber)
        );

        if (!delivered) {
          throw new Error("We are facing some network problems to send email.");
        } else {
          userRecord.otpCode = otpNumber;
          userRecord.otpCreateTime = utcDate;
          const result = await userRecord.save();
          return result;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async login(_, { email, password }) {
      try {
        if (!email || email == null || email == undefined) {
          throw new Error("Email is required");
        } else if (!password || password == null || password == undefined) {
          throw new Error("Password is required");
        } else {
          const userExist = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") },
          });
          //   console.log("user:::", userExist);
          if (!userExist) {
            throw new Error("Your Email is not valid");
          }

          let id = await userExist._id;
          let firstName = userExist.firstName;

          const passwordIsValid = bcrypt.compareSync(
            password,
            userExist.password
          );

          if (!passwordIsValid) {
            throw new Error("Your password is not valid");
          }

          if (userExist.isOTPVerified === false) {
            throw new Error(
              "Your account is not verified yet, please verify your account first"
            );
          }
          let user = userExist;
          const jwtToken = Jwt.sign(
            {
              email,
              id,
              // user,
            },
            jwtKey,
            {
              expiresIn: "1d",
            }
          );

          userExist.token = jwtToken;
          const result = await userExist.save();
          return result;
          //   const token = getToken(email, id, userExist);
          //   return { ...userExist, token };
          //   console.log("token:::", jwtToken);
          //   return { ...userExist, jwtToken };
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async forgotCredential(_, { email }) {
      try {
        if (!email || email == null || email == undefined) {
          throw new Error("Email is required");
        } else {
          const userRecord = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") },
          });

          if (!userRecord) {
            throw new Error(
              "Couldn’t find any account associated with this email"
            );
          }

          let otpNumber = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
          });

          let utcDate = getUtcDate();

          let { delivered } = await sendEmail(
            email,
            config.email.forgotSubject,
            config.email.template.emailForgotPassword(otpNumber)
          );

          if (!delivered) {
            throw new Error(
              "We are facing some network problems to send email."
            );
          }

          userRecord.otpCode = otpNumber;
          userRecord.otpCreateTime = utcDate;
          const result = await userRecord.save();
          return result;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async updatePassword(_, { password, otpCode }) {
      try {
        if (!password || password == null || password == undefined) {
          throw new Error("Email is required");
        } else if (!otpCode || otpCode == null || otpCode == undefined) {
          throw new Error("Otp code is required");
        } else {
          const userRecord = await User.findOne({ otpCode: otpCode });

          if (!userRecord) {
            throw new Error(
              "The number that you've entered doesn't match your code. Please try again."
            );
          }

          var utcMoment = moment.utc();
          var utcDate = new Date(utcMoment.format());
          var diff =
            (utcDate.getTime() - userRecord.otpCreateTime.getTime()) / 1000;
          const diffInMinute = diff / 60;

          if (diffInMinute > config.otpExpireTime)
            throw new Error(
              "Your OTP code has been expired. Click on send again to get new code"
            );

          let hash = await hashPassword(password);
          userRecord.password = hash;
          userRecord.otpCode = 0;
          const result = await userRecord.save();
          return result;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async updateEmailOnProfile(_, { email }, context) {
      try {
        const user = context.user;
        // console.log("user::", context.user);
        if (!context.loggedIn) {
          throw new Error("Please Login Again");
        } else if (!email || email == null || email == undefined) {
          throw new Error("Email is required");
        } else {
          const checkEmailExist = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") },
          });

          const userRecord = await User.findOne({ _id: user.id });

          if (checkEmailExist) {
            throw new Error("Email already exist");
          }

          let otpNumber = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
          });

          let utcDate = getUtcDate();

          let { delivered } = await sendEmail(
            email,
            config.email.updateEmailSubject,
            config.email.template.emailSignupOtp(otpNumber)
          );

          if (!delivered) {
            throw new Error(
              "We are facing some network problems to send email."
            );
          }

          // const result = await User.findOneAndUpdate(
          //   { _id: user.id },
          //   {
          //     $set: {
          //       otpCreateTime: utcDate,
          //       otpCode: otpNumber,
          //     },
          //   }
          // );

          // console.log("result::", result);

          // return result;
          userRecord.otpCode = otpNumber;
          userRecord.otpCreateTime = utcDate;
          const result = await userRecord.save();
          console.log("update email on profile otp::", result);
          return result;
        }
      } catch (error) {
        console.log("error::", error);
        throw new Error(error.message);
      }
    },
    async verifyOtpOnProfile(_, { email, otpCode }, context) {
      const user = context.user;
      try {
        if (!context.loggedIn) {
          throw new Error("Please Login Again");
        } else if (!email || email == null || email == undefined) {
          throw new Error("Email is required");
        } else if (!otpCode || otpCode == null || otpCode == undefined) {
          throw new Error("Otp code is required");
        } else {
          const userRecord = await User.findOne({
            _id: user.id,
          });

          if (!userRecord) {
            throw new Error(
              "The number that you've entered doesn't match your code. Please try again."
            );
          }

          var utcMoment = moment.utc();
          var utcDate = new Date(utcMoment.format());
          var diff =
            (utcDate.getTime() - userRecord.otpCreateTime.getTime()) / 1000;
          const diffInMinute = diff / 60;
          if (diffInMinute > config.otpExpireTime)
            throw new Error(
              "Your OTP code has been expired. Click on send again to get new code"
            );

          // const result = await User.findByIdAndUpdate(
          //   { _id: user.id },
          //   {
          //     $set: {
          //       email: email,
          //       otpCode: 0,
          //     },
          //   }
          // );
          userRecord.email = email;
          userRecord.otpCode = 0;
          const result = await userRecord.save();
          console.log("verify otp result::", result);

          return result;
          // return result;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async resendOtpOnProfile(_, { email }, context) {
      const user = await context.user;
      console.log("user::", user);
      try {
        if (!context.loggedIn) {
          throw new Error("Please Login Again");
        } else if (!email || email == null || email == undefined) {
          throw new Error("Email is required");
        } else {
          const userRecord = await User.findOne({
            _id: user.id,
          });

          if (!userRecord) {
            throw new Error("User not found");
          }

          let otpNumber = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
          });
          let utcDate = getUtcDate();
          let { delivered } = await sendEmail(
            email,
            config.email.resendOtpSubject,
            config.email.template.resendOtp(otpNumber)
          );

          if (!delivered) {
            throw new Error(
              "We are facing some network problems to send email."
            );
          } else {
            userRecord.otpCode = otpNumber;
            userRecord.otpCreateTime = utcDate;
            const result = await userRecord.save();
            console.log("result::", result);
            return result;
          }

          // const result = await User.findByIdAndUpdate(
          //   { _id: user.id },
          //   {
          //     $set: {
          //       otpCreate_Time: utcDate,
          //       otpCode: otpNumber,
          //     },
          //   }
          // );

          // return result;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async updatePasswordOnProfile(
      _,
      { oldPassword, password, confirmPassword },
      context
    ) {
      const user = context.user;
      try {
        if (!context.loggedIn) {
          throw new Error("Please Login Again");
        } else if (
          !oldPassword ||
          oldPassword == null ||
          oldPassword == undefined
        ) {
          throw new Error("Old password is required");
        } else if (!password || password == null || password == undefined) {
          throw new Error("Password is required");
        } else if (
          !confirmPassword ||
          confirmPassword == null ||
          confirmPassword == undefined
        ) {
          throw new Error("Confirm password is required");
        } else if (password !== confirmPassword) {
          throw new Error(
            "`The password and confirm password do not match.Please try again."
          );
        } else {
          let userRecord = await User.findOne({ _id: user.id });

          if (!userRecord) {
            throw new Error("User not found");
          }

          let passwordCompare = await comparePassword(
            oldPassword,
            userRecord.password
          );

          if (!passwordCompare) {
            throw new Error("You entered the wrong old password");
          }

          let hash = await hashPassword(password);
          userRecord.password = hash;
          const result = await userRecord.save();

          return result;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

export default userResolvers;
