import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser {
    getUser {
      user{
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
     
    }
  }
  
`;

export const GET_USER_BOOKS = gql`
  query GetUserBooks {
    getUserBooks {
      googleBookId
      authors
      title
      description
      image
      link
    }
  }
`;