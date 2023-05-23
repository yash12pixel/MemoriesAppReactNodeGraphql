import { gql } from "@apollo/client";

export const GET_POSTS_BY_USER = gql`
  query getPostsByUser($id: ID!) {
    getPostsByUser(id: $id) {
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
        selectedFile {
          public_id
          asset_id
          version_id
          width
          height
          format
          filename
          url
          created_at
        }
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
      selectedFile {
        public_id
        asset_id
        version_id
        width
        height
        format
        filename
        url
        created_at
      }
    }
  }
`;
