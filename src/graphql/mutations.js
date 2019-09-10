/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
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
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
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
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
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
export const createVote = `mutation CreateVote($input: CreateVoteInput!) {
  createVote(input: $input) {
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
export const updateVote = `mutation UpdateVote($input: UpdateVoteInput!) {
  updateVote(input: $input) {
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
export const deleteVote = `mutation DeleteVote($input: DeleteVoteInput!) {
  deleteVote(input: $input) {
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
export const createMessage = `mutation CreateMessage($input: CreateMessageInput!) {
  createMessage(input: $input) {
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
export const updateMessage = `mutation UpdateMessage($input: UpdateMessageInput!) {
  updateMessage(input: $input) {
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
export const deleteMessage = `mutation DeleteMessage($input: DeleteMessageInput!) {
  deleteMessage(input: $input) {
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
