<script>
  import API, { graphqlOperation } from "@aws-amplify/api";
  import Auth from "@aws-amplify/auth";
  import { Hub } from "@aws-amplify/core";

  import { getUser, listVotes } from "./graphql/queries";
  import { createUser, updateUser, updateVote } from "./graphql/mutations";
  import { onUpdateVote } from "./graphql/subscriptions";
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
    } catch (err) {
      console.error("Error onMount", err);
    }
  });

  onDestroy(() => {
    updateVoteSub.unsubscribe();
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

  function handleVoteCreate() {
    console.log("handleVoteCreate");
  }
</script>

<style>

</style>

<div class="flex justify-between bg-indigo-900 h-10 items-center px-8">
  <span class="text-white">Kilikia Football</span>
  {#if user}
    <span class="text-white" on:click={handleSignout}>Sign out</span>
  {/if}
</div>

<ul class="flex flex-col mx-auto w-2/3 mt-8">
  {#each votes as vote}
    <li
      class="flex w-full h-12 cursor-pointer hover:bg-indigo-200 border-b
      border-grey-light">
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
    <li
      class="flex w-full h-12 cursor-pointer hover:bg-indigo-200 border-b
      border-grey-light">
      <span class="w-2/5 flex items-center">{user.username}</span>
      <span class="w-3/5">
        <PlayerVote on:vote={handleVoteCreate} />
      </span>
    </li>
  {/if}
</ul>

{#if !user}
  <PlayerLogin on:login={handleLogin} {errorMessage} />
{/if}
