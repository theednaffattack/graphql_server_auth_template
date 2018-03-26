export default `

  type Subscription {
    voteHappened: PollOption!
  }

  type User {
    id: Int!
    username: String
    email: String!
  }

  type Poll {
    name: String!,
    id: Int!,
    options: [PollOption!]!
  }

  type PollOption {
    id: Int!
    text: String!
    votes: Int!
    pollId: Int!
  }

  type AuthPayload {
    token: String!
    refreshToken: String!
  }

  type Error {
    field: String!
    message: String!
  }

  type LoginResponse {
    ok: Boolean
    errors: [Error!]
    authPayload: AuthPayload!
  }

  type RegisterResponse {
    ok: Boolean
    errors: [Error!]
    user: User
  }

  type PollResponse {
    ok: Boolean
    errors: [Error!]
    poll: Poll
  }

  type Query {
    allPolls: [Poll!]!
    poll(id: Int!): Poll
  }

  type Mutation {
    vote(pollOptionId: Int!): Boolean!
    createPoll(name: String!, options: [String!]): PollResponse!
    register(username: String!, email: String!, password: String!): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
