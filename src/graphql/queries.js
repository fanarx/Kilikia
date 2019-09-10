/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    confirmed
    vote {
      id
      isComing
      user {
        id
        username
        confirmed
      }
      createdAt
    }
    messages {
      items {
        id
        content
        createdAt
      }
      nextToken
    }
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      username
      confirmed
      vote {
        id
        isComing
        createdAt
      }
      messages {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getVote = `query GetVote($id: ID!) {
  getVote(id: $id) {
    id
    isComing
    user {
      id
      username
      confirmed
      vote {
        id
        isComing
        createdAt
      }
      messages {
        nextToken
      }
    }
    createdAt
  }
}
`;
export const listVotes = `query ListVotes(
  $filter: ModelVoteFilterInput
  $limit: Int
  $nextToken: String
) {
  listVotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      isComing
      user {
        id
        username
        confirmed
      }
      createdAt
    }
    nextToken
  }
}
`;
export const getMessage = `query GetMessage($id: ID!) {
  getMessage(id: $id) {
    id
    content
    author {
      id
      username
      confirmed
      vote {
        id
        isComing
        createdAt
      }
      messages {
        nextToken
      }
    }
    createdAt
  }
}
`;
export const listMessages = `query ListMessages(
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      content
      author {
        id
        username
        confirmed
      }
      createdAt
    }
    nextToken
  }
}
`;
