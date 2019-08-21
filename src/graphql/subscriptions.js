/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = `subscription OnCreateUser {
  onCreateUser {
    id
    username
    registered
    vote {
      id
      isComing
      user {
        id
        username
        registered
      }
    }
  }
}
`;
export const onUpdateUser = `subscription OnUpdateUser {
  onUpdateUser {
    id
    username
    registered
    vote {
      id
      isComing
      user {
        id
        username
        registered
      }
    }
  }
}
`;
export const onDeleteUser = `subscription OnDeleteUser {
  onDeleteUser {
    id
    username
    registered
    vote {
      id
      isComing
      user {
        id
        username
        registered
      }
    }
  }
}
`;
export const onCreateVote = `subscription OnCreateVote {
  onCreateVote {
    id
    isComing
    user {
      id
      username
      registered
      vote {
        id
        isComing
      }
    }
  }
}
`;
export const onUpdateVote = `subscription OnUpdateVote {
  onUpdateVote {
    id
    isComing
    user {
      id
      username
      registered
      vote {
        id
        isComing
      }
    }
  }
}
`;
export const onDeleteVote = `subscription OnDeleteVote {
  onDeleteVote {
    id
    isComing
    user {
      id
      username
      registered
      vote {
        id
        isComing
      }
    }
  }
}
`;
