import { gql } from "apollo-server-express";

const userTypeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String
    otpCode: String
    otpCreateTime: String
    isOTPVerified: Boolean
    token: String
    posts: [Post]
  }

  type Post {
    id: ID!
    title: String!
    message: String!
    creator: String!
    tags: [String]!
    likeCount: Int
    user: User!
  }

  type Mail {
    to: String
    subject: String
    html: String
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }

  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): User
    verifyUsersOtp(email: String!, otpCode: String!): User
    resendUserOtp(email: String!): User
    login(email: String!, password: String!): User
    forgotCredential(email: String!): User
    updatePassword(password: String!, otpCode: String!): User
    updateEmailOnProfile(email: String): User
    verifyOtpOnProfile(email: String!, otpCode: String!): User
    resendOtpOnProfile(email: String!): User
    updatePasswordOnProfile(
      oldPassword: String
      password: String!
      confirmPassword: String!
    ): User
    sendEmail(to: String, subject: String, html: String): Mail
  }
`;

export default userTypeDefs;
