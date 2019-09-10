/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = `subscription OnCreateUser {
  onCreateUser {
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
export const onUpdateUser = `subscription OnUpdateUser {
  onUpdateUser {
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
export const onDeleteUser = `subscription OnDeleteUser {
  onDeleteUser {
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
export const onCreateVote = `subscription OnCreateVote {
  onCreateVote {
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
export const onUpdateVote = `subscription OnUpdateVote {
  onUpdateVote {
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
export const onDeleteVote = `subscription OnDeleteVote {
  onDeleteVote {
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
export const onCreateMessage = `subscription OnCreateMessage {
  onCreateMessage {
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
export const onUpdateMessage = `subscription OnUpdateMessage {
  onUpdateMessage {
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
export const onDeleteMessage = `subscription OnDeleteMessage {
  onDeleteMessage {
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
