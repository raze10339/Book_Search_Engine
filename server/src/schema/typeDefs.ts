const gql = String.raw;

const typeDefs = gql`
 
  type Book {
    googleBookId: ID! 
    authors: [String!] 
    description: String
    title: String!
    image: String
    link: String
  }

 
  type User {
    _id: ID! 
    username: String!
    email: String!
    bookCount: Int! 
    savedBooks: [Book!] 
  }

 
  type Response {
    user: User
    message: String
  }

 
  input SaveBookInput {
    googleBookId: ID!
    authors: [String!]
    title: String!
    description: String
    image: String
    link: String
  }

 
  type Query {
    GetUser: Response 
    GetUserBooks: [Book] 
  }

 
  type Mutation {
    RegisterUser(username: String!, email: String!, password: String!): Response 
    LoginUser(email: String!, password: String!): Response 
    LogoutUser: Response
    SaveBook(input: SaveBookInput!): Response 
    DeleteBook(googleBookId: ID!): Response
  }
`;

export default typeDefs;