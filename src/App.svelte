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
  import { fade } from "svelte/transition";
  import Navbar from "./components/Navbar";
  import PlayerLogin from "./components/PlayerLogin";
  import PlayerVote from "./components/PlayerVote";
  import VoteCounter from "./components/VoteCounter";
  import MessageBox from "./components/MessageBox";
  import OtherPlayerBox from "./components/OtherPlayerBox";
  import sign_close from "./images/sign_close.svg";

  let user = null;

  const username = "kilikia1";
  const password = "kilikia";
  let errorMessage;
  let votes = [];
  let otherVotes = [];

  let updateVoteSub;
  let openWarningModal;

  //let isLocalVoteUpdated = false;
  let isLoading = false;

  $: votedUsers = votes.map(vote => vote.user.username);

  onMount(async () => {
    await getUserData();
    Hub.listen("auth", handleAuth);
    await getVotes();
    try {
      await getUserVotes();
      updateVoteSub = API.graphql(graphqlOperation(onUpdateVote)).subscribe({
        next: ({ value }) => {
          const updatedVote = value.data.onUpdateVote;
          const index = votes.findIndex(vote => vote.id === updatedVote.id);
          let updatedVotes;
          if (index >= 0) {
            updatedVotes = [
              ...votes.slice(0, index),
              updatedVote,
              ...votes.slice(index + 1)
            ];
          } else {
            updatedVotes = [...votes, updatedVote];
          }

          votes = updatedVotes;
        }
      });
    } catch (err) {
      console.error("Error onMount", err);
    }
  });

  onDestroy(() => {
    updateVoteSub.unsubscribe();
  });

  async function getUserVotes() {
    if (user) {
      const hasUserVoted = votes.some(
        vote => vote.user.username === user.username
      );
      if (!hasUserVoted) {
        const createVoteInput = {
          voteUserId: user.attributes.sub
        };
        try {
          await API.graphql(
            graphqlOperation(createVote, { input: createVoteInput })
          );
          getVotes();
        } catch (err) {
          console.log("createVote err:", err);
        }
      }
    }
  }

  async function handleAuth(authData) {
    console.log("handleAuth: authData: ", authData);
    switch (authData.payload.event) {
      case "signIn":
        console.log("signed in CASE");
        await getUserData();
        getUserVotes();
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

  async function getVotes() {
    const { data } = await API.graphql(
      graphqlOperation(listVotes, { limit: 100 })
    );

    votes = data.listVotes.items.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
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
      isLoading = true;
      const loginPassword = isConfirmed ? password.concat("808990") : "kilikia";
      const signedUser = await Auth.signIn({
        username,
        password: loginPassword
      });
      if (signedUser.challengeName === "NEW_PASSWORD_REQUIRED") {
        const loggedUser = await Auth.completeNewPassword(
          signedUser,
          password.concat("808990")
        );

        console.log("handleLogin: loggedUser", loggedUser);
      }
      openWarningModal = false;
      isLoading = false;
    } catch (err) {
      console.log("auth err: ", err);
      errorMessage = err.message;
      isLoading = false;
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
    }
  }

  async function handleVoteUpdate(vote, { detail }) {
    if (!user) return;
    if (user.attributes.sub !== vote.user.id) return;
    const backupVotes = [...votes];
    const updateVoteInput = {
      id: vote.id,
      isComing: detail
    };
    try {
      const updatedVote = updateVoteInput;
      const index = votes.findIndex(vote => vote.id === updatedVote.id);

      const updatedVotes = [
        ...votes.slice(0, index),
        { ...updateVoteInput, user: vote.user },
        ...votes.slice(index + 1)
      ];
      votes = updatedVotes;

      await API.graphql(
        graphqlOperation(updateVote, { input: updateVoteInput })
      );
    } catch (err) {
      console.log("updateVote err:", err);
      votes = backupVotes;
    }
  }

  function handlePlayerListClick() {
    if (!user) {
      openWarningModal = true;
    }
  }

  function closeWarningModal(e) {
    e.stopPropagation();
    openWarningModal = false;
  }

  function isActive(vote) {
    return user.attributes.sub === vote.user.id;
  }
</script>

<div class="flex justify-between bg-indigo-900 h-10 px-8 fixed w-full top-0 z-50">
  <span
    class="flex items-center text-white h-10 font-semibold whitespace-no-wrap">
    Kilikia Football
  </span>
  {#if user}
    <span
      class="flex items-center text-white cursor-pointer"
      on:click={handleSignout}>
      Sign out
    </span>
  {:else if !openWarningModal}
    <div class="flex items-start">
      <PlayerLogin
        on:login={handleLogin}
        {errorMessage}
        {isLoading}
        navbarMode />
    </div>
  {/if}
</div>
<div class="flex flex-col mx-auto sm:w-2/3 w-full mt-8 p-4 min250">
  <ul on:click={handlePlayerListClick} class="flex flex-col relative">
    {#if !user && openWarningModal}
      <div
        transition:fade={{ duration: 200 }}
        class="flex items-center justify-center bg-gray-600 w-full h-full
        absolute with-opacity">
        <img
          on:click={closeWarningModal}
          class="w-8 h-8 absolute top-0 right-0 m-2 cursor-pointer"
          src={sign_close}
          alt="Close" />
        <PlayerLogin on:login={handleLogin} {errorMessage} {isLoading} />
      </div>
    {/if}
    {#if votes.length > 0}
      <li class={`flex w-full h-12 cursor-pointer`}>
        <span class={`w-2/5 flex items-center`}>&nbsp;</span>
        <span class="w-3/5">
          <VoteCounter votes={[...votes, ...otherVotes]} />
        </span>
      </li>
    {/if}
    <div class="text-orange-600 text-lg font-semibold mb-2">Հիմնական</div>
    {#each votes as vote}
      {#if vote.isComing || (user && vote.user.username === user.username)}
        <li
          class={`flex w-full h-12 cursor-pointer ${user && isActive(vote) ? 'border-b-2 border-gray-600' : 'border-b border-gray-300'}`}>
          <span
            class={`w-2/5 flex items-center capitalize ${user && isActive(vote) ? 'font-bold' : 'font-normal'}`}>
            {vote.user.username}
          </span>
          <span class="w-3/5">
            <PlayerVote
              on:vote={details => handleVoteUpdate(vote, details)}
              vote={vote.isComing} />
          </span>
        </li>
      {/if}
    {/each}
    <OtherPlayerBox bind:value={otherVotes} user={user && user} />
  </ul>
</div>
{#if user}
  <MessageBox user={user.attributes} />
{/if}
