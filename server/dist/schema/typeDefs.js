const gql = String.raw;
const typeDefs = gql `
  type Book {
    googleBookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Response {
    user: User
    message: String
  }

  input SaveBookInput {
    googleBookId: ID
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }

  type Query {
    getUser: Response
    getUserBooks: [Book]
  }

  type Mutation {
    registerUser(username: String, email: String, password: String): Response
    loginUser(email: String, password: String!): Response
    logoutUser: Response
    saveBook(input: SaveBookInput): Response
    deleteBook(googleBookId: ID): Response
  }
`;
export default typeDefs;
