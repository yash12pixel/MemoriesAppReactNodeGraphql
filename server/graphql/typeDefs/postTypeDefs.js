import { gql } from "apollo-server-express";

const postTypeDefs = gql`
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

  type File {
    public_id: String
    asset_id: String
    version_id: String
    width: String
    height: String
    format: String
    original_filename: String
    url: String
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

  input CreatePost {
    title: String!
    message: String!
    creator: String!
    tags: [String]!
  }

  input UpdatePost {
    title: String
    message: String
    creator: String
    tags: [String]
  }

  type Query {
    getPostsByUser(id: ID): User
    getPost(id: ID!): Post
  }

  type Mutation {
    createPost(
      title: String!
      message: String!
      creator: String!
      tags: [String]!
    ): Post
    updatePost(
      id: ID!
      title: String!
      message: String!
      creator: String!
      tags: [String]!
    ): Post
    deletePost(id: ID): Post
    likePost(id: ID): Post
  }
`;

export default postTypeDefs;
