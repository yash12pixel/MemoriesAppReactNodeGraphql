import { gql } from "apollo-server-express";

const postTypeDefs = gql`
  scalar Upload

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
    selectedFile: File
    likeCount: Int
    user: User!
  }

  type File {
    public_id: String!
    asset_id: String
    version_id: String
    width: String!
    height: String!
    format: String
    filename: String
    url: String!
    created_at: String
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
      selectedFile: Upload
    ): Post
    updatePost(
      id: ID!
      title: String!
      message: String!
      creator: String!
      tags: [String]!
      selectedFile: Upload
    ): Post
    deletePost(id: ID): Post
    likePost(id: ID): Post
  }
`;

export default postTypeDefs;
