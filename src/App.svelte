<script>
  import { API, graphqlOperation, Auth, Hub } from "aws-amplify";
  import { getUser, listVotes } from "./graphql/queries";
  import { createUser, updateUser } from "./graphql/mutations";
  import { onMount } from "svelte";
  import Navbar from "./components/Navbar";
  import PlayerLogin from "./components/PlayerLogin";
  import PlayerVote from "./components/PlayerVote";

  let user = null;

  const username = "kilikia1";
  const password = "kilikia";
  let errorMessage;
  let votes = [];

  $: votedUsers = votes.map(vote => vote.user.username);

  onMount(async () => {
    getUserData();
    Hub.listen("auth", handleAuth);

    try {
      const { data } = await API.graphql(graphqlOperation(listVotes));

      console.log("data", data);
      votes = data.listVotes.items;
    } catch (err) {
      console.error("Error SELECT new user", err);
    }
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
      //console.log("Auth.currentCredentials() ", Auth.currentCredentials());
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

  async function login() {
    try {
      console.log("trying login");
      const signedUser = await Auth.signIn({
        username: "suren",
        password: "fanarx808990"
      });
      console.log("signedUser", signedUser);
      if (signedUser.challengeName === "NEW_PASSWORD_REQUIRED") {
        //const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
        // You need to get the new password and required attributes from the UI inputs
        // and then trigger the following function with a button click
        // For example, the email and phone_number are required attributes
        //const { username, email, phone_number } = getInfoFromUserInput();
        const loggedUser = await Auth.completeNewPassword(
          signedUser, // the Cognito User Object
          "aharon1990"
        );

        console.log("logged User::: ", loggedUser);
      }
    } catch (err) {
      console.log("auth err: ", err);
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
</script>

<style>
  .btn {
    @apply font-bold py-2 px-4 rounded;
  }
  .btn-blue {
    @apply bg-blue-500 text-white;
  }
  .btn-blue:hover {
    @apply bg-blue-700;
  }
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
      class="flex w-full h-12 cursor-pointer hover:bg-teal-600 border-b
      border-grey-light">
      <span class="w-2/5">{vote.user.username}</span>
      <span class="w-3/5"><PlayerVote vote={vote.isComing} /></span>
    </li>
  {/each}
  <!-- <div>
    <pre>{JSON.stringify(votedUsers, null, 2)}</pre>
  </div> -->
  {#if user && !votedUsers.includes(user.username)}
    <li
      class="flex w-full h-12 cursor-pointer hover:bg-teal-600 border-b
      border-grey-light">
      <span class="w-2/5">{user.username}</span>
      <span class="w-3/5">Options ...</span>
    </li>
  {/if}
</ul>

{#if !user}
  <PlayerLogin on:login={handleLogin} {errorMessage} />
{/if}
