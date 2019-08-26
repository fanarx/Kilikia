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
      }
    }
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
      }
    }
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
      }
    }
  }
}
`;
