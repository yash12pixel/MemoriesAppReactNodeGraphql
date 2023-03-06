import { gql } from "@apollo/client";

export const GET_POSTS_BY_USER = gql`
  query getPostsByUser {
    getPostsByUser {
      id
      firstName
      lastName
      email
      password
      otpCode
      otpCreateTime
      isOTPVerified
      token
      posts {
        creator
        id
        likeCount
        message
        tags
        title
      }
    }
  }
`;

export const GET_POST = gql`
  query getPost($id: ID!) {
    getPost(id: $id) {
      id
      title
      message
      creator
      tags
      likeCount
    }
  }
`;
