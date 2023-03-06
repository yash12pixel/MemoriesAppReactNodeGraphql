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

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input UserUpdateInput {
    firstName: String
    lastName: String
    email: String
    password: String
  }

  input VerifyOtp {
    email: String!
    otpCode: String!
  }

  input ResendOtp {
    email: String
  }

  input Login {
    email: String!
    password: String!
  }

  input UpdatePassword {
    password: String!
    otpCode: String!
  }

  input updatePasswordOnProfile {
    oldPassword: String
    password: String!
    confirmPassword: String!
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
    updateUser(id: ID!, input: UserUpdateInput): User
    deleteUser(id: ID!): Boolean
  }
`;

export default userTypeDefs;
