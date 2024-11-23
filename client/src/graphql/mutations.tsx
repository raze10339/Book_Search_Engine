import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          googleBookId
          authors
          title
          description
          image
          link
        }
      }
      message
    }
  }
`;

export const REGISTER_USER = gql`
  mutation registerUser($username: String!, $email: String!, $password: String!) {
    registerUser(username: $username, email: $email, password: $password) {
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          googleBookId
          authors
          title
          description
          image
          link
        }
      }
      message
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation logoutUser {
    logoutUser {
      message
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($input: SaveBookInput!) {
    saveBook(input: $input) {
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          googleBookId
          authors
          title
          description
          image
          link
        }
      }
      message
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deleteBook($googleBookId: ID!) {
    deleteBook(googleBookId: $googleBookId) {
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          googleBookId
          authors
          title
          description
          image
          link
        }
      }
      message
    }
  }
`;
