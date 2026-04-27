const { gql } = require('apollo-server-express');
const runsStore = require('./data/runsStore');

const typeDefs = gql`
  type Runner {
    id: ID!
    name: String!
    level: String!
    runs: [Run]
  }

  type Run {
    id: ID!
    runnerId: Int!
    name: String!
    date: String!
    distance: String
    type: String!
    location: String
    runner: Runner
  }

  type PaginatedRuns {
    totalItems: Int!
    totalPages: Int!
    currentPage: Int!
    data: [Run]
  }

  type Query {
    runners: [Runner]
    run(id: ID!): Run
    runs(page: Int, limit: Int): PaginatedRuns
  }

  type Mutation {
    addRun(
      name: String!, 
      runnerId: Int!, 
      date: String!, 
      distance: String, 
      type: String!, 
      location: String
    ): Run
    deleteRun(id: ID!): Boolean
  }
`;

const resolvers = {
    Query: {
        runners: () => runsStore.getAllRunners(),
        // Ensure the ID is parsed as an Integer before searching the store
        run: (_, { id }) => runsStore.getById(parseInt(id)),
        runs: (_, { page, limit }) => runsStore.getPaginated(page || 1, limit || 7),
    },
    Mutation: {
        addRun: (_, args) => runsStore.add(args),
        deleteRun: (_, { id }) => runsStore.remove(parseInt(id)),
    },
    // Fix relationship parsing
    Run: {
        runner: (parent) => runsStore.getAllRunners().find(r => parseInt(r.id) === parseInt(parent.runnerId))
    },
    Runner: {
        runs: (parent) => runsStore.getRunsByRunner(parseInt(parent.id))
    }
};

module.exports = { typeDefs, resolvers };