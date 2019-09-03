<script>
  import API, { graphqlOperation } from "@aws-amplify/api";
  import Auth from "@aws-amplify/auth";
  import { Hub } from "@aws-amplify/core";

  import { getUser, listVotes } from "./graphql/queries";
  import {
    createUser,
    updateUser,
    updateVote,
    createVote
  } from "./graphql/mutations";
  import { onUpdateVote, onCreateVote } from "./graphql/subscriptions";
  import { onMount, onDestroy } from "svelte";
  import Navbar from "./components/Navbar";
  import PlayerLogin from "./components/PlayerLogin";
  import PlayerVote from "./components/PlayerVote";

  let user = null;

  const username = "kilikia1";
  const password = "kilikia";
  let errorMessage;
  let votes = [];

  let updateVoteSub;
  let createVoteSub;

  let openWarningModal;

  $: votedUsers = votes.map(vote => vote.user.username);

  onMount(async () => {
    getUserData();
    Hub.listen("auth", handleAuth);

    try {
      const { data } = await API.graphql(graphqlOperation(listVotes));

      console.log("listVotes data", data);
      votes = data.listVotes.items;
      updateVoteSub = API.graphql(graphqlOperation(onUpdateVote)).subscribe({
        next: ({ value }) => {
          const updatedVote = value.data.onUpdateVote;
          const index = votes.findIndex(vote => vote.id === updatedVote.id);

          const updatedVotes = [
            ...votes.slice(0, index),
            updatedVote,
            ...votes.slice(index + 1)
          ];

          votes = updatedVotes;
        }
      });

      createVoteSub = API.graphql(graphqlOperation(onCreateVote)).subscribe({
        next: ({ value }) => {
          const newVote = value.data.onCreateVote;
          const prevVotes = votes.filter(vote => vote.id !== newVote.id);
          const updatedVotes = [...prevVotes, newVote];
          votes = updatedVotes;
        }
      });
    } catch (err) {
      console.error("Error onMount", err);
    }
  });

  onDestroy(() => {
    updateVoteSub.unsubscribe();
    createVoteSub.unsubscribe();
  });

  function handleAuth(authData) {
    console.log("handleAuth: authData: ", authData);
    switch (authData.payload.event) {
      case "signIn":
        console.log("signed in CASE");
        getUserData();
        registerNewUser(authData.payload.data);
        break;
      case "signUp":
        console.log("signed up", authData);
        break;
      case "signOut":
        console.log("signed out");
        user = null;
        break;
      default:
        return;
    }
  }

  async function getUserData() {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      console.log("currentAuthenticatedUser: ", userData);
      if (userData) {
        user = userData;
      }
    } catch (err) {
      console.log("err currentAuthenticatedUser: ", err);
    }
  }

  async function handleLogin({ detail: { username, password, isConfirmed } }) {
    try {
      console.log("username, password", username, password);

      const loginPassword = isConfirmed ? password.concat("808990") : "kilikia";
      const signedUser = await Auth.signIn({
        username,
        password: loginPassword
      });
      console.log("handleLogin: signedUser", signedUser);
      if (signedUser.challengeName === "NEW_PASSWORD_REQUIRED") {
        const loggedUser = await Auth.completeNewPassword(
          signedUser,
          password.concat("808990")
        );

        console.log("handleLogin: loggedUser", loggedUser);
      }
      openWarningModal = false;
    } catch (err) {
      console.log("auth err: ", err);
      errorMessage = err.message;
    }
  }

  async function handleSignout(e) {
    try {
      await Auth.signOut();
    } catch (err) {
      console.error("Signout ", err);
    }
  }

  async function registerNewUser(signInData) {
    console.log("signInData in registerNewUser", signInData);
    const getUserInput = {
      id: signInData.signInUserSession.idToken.payload.sub
    };
    console.log("getUserInput", getUserInput);
    const { data } = await API.graphql(graphqlOperation(getUser, getUserInput));
    // if we can't get a user (meaning the user hasn't been registered before), then we execute registerUser
    console.log("data in registerNewUser", data);
    if (!data.getUser) {
      try {
        const registerUserInput = {
          ...getUserInput,
          username: signInData.username,
          //email: signInData.signInUserSession.idToken.payload.email,
          confirmed: true
        };
        const newUser = await API.graphql(
          graphqlOperation(createUser, { input: registerUserInput })
        );
        console.log({ newUser });
      } catch (err) {
        console.error("Error registering new user", err);
      }
    } else if (!data.getUser.confirmed) {
      const updateUserInput = {
        ...getUserInput,
        confirmed: true
      };
      const updatedUser = await API.graphql(
        graphqlOperation(updateUser, { input: updateUserInput })
      );
      console.log({ updatedUser });
    }
  }

  async function handleVoteUpdate(vote, { detail }) {
    if (!user) return;
    if (user.attributes.sub !== vote.user.id) return;

    const updateVoteInput = {
      id: vote.id,
      isComing: detail
    };

    await API.graphql(graphqlOperation(updateVote, { input: updateVoteInput }));
  }

  async function handleVoteCreate({ detail }) {
    if (!user) return;

    const createVoteInput = {
      isComing: detail,
      voteUserId: user.attributes.sub
    };

    await API.graphql(graphqlOperation(createVote, { input: createVoteInput }));
  }

  function handlePlayerListClick() {
    if (!user) {
      openWarningModal = true;
    }
  }

  function handleWarningClick(e) {
    e.stopPropagation();
    openWarningModal = false;
  }
</script>

<style>

</style>

<div class="flex justify-between bg-indigo-900 h-10 px-8">
  <span class="flex items-center text-white h-10">Kilikia Football</span>
  {#if user}
    <span
      class="flex items-center text-white cursor-pointer"
      on:click={handleSignout}>
      Sign out
    </span>
  {:else if !openWarningModal}
    <div class="flex items-start">
      <PlayerLogin on:login={handleLogin} {errorMessage} navbarMode />
    </div>
  {/if}
</div>
<div class="flex flex-col mx-auto w-2/3 mt-8">
  <ul on:click={handlePlayerListClick} class="flex flex-col relative">
    {#if !user && openWarningModal}
      <div
        class="flex items-center justify-center bg-gray-600 w-full h-full
        absolute opacity-75">
        <button
          on:click={handleWarningClick}
          class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold
          hover:text-white py-2 px-4 border border-blue-500
          hover:border-transparent rounded">
          Ok
        </button>
        <PlayerLogin on:login={handleLogin} {errorMessage} />
      </div>
    {/if}
    {#each votes as vote}
      <li class="flex w-full h-12 cursor-pointer border-b border-grey-light">
        <span class="w-2/5 flex items-center">{vote.user.username}</span>
        <span class="w-3/5">
          <PlayerVote
            on:vote={details => handleVoteUpdate(vote, details)}
            vote={vote.isComing} />
        </span>
      </li>
    {/each}
    <!-- <div>
    <pre>{JSON.stringify(votedUsers, null, 2)}</pre>
  </div> -->
    {#if user && !votedUsers.includes(user.username)}
      <li class="flex w-full h-12 cursor-pointer border-b border-grey-light">
        <span class="w-2/5 flex items-center">{user.username}</span>
        <span class="w-3/5">
          <PlayerVote on:vote={handleVoteCreate} />
        </span>
      </li>
    {/if}
  </ul>
</div>
