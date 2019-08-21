<script>
  import { API, graphqlOperation, Auth, Hub } from "aws-amplify";
  import { getUser } from "./graphql/queries";
  import { createUser } from "./graphql/mutations";
  import { onMount } from "svelte";
  import Navbar from "./components/Navbar";

  let user = null;

  onMount(async () => {
    getUserData();
    Hub.listen("auth", handleAuth);
  });

  function handleAuth(authData) {
    switch (authData.payload.event) {
      case "signIn":
        console.log("signed in");
        getUserData();
        registerNewUser(authData.payload.data);
        break;
      case "signUp":
        console.log("signed up");
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
      console.log("userData", userData);
      if (userData) {
        user = userData;
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  async function login() {
    try {
      const signedUser = await Auth.signIn({
        username: "suren",
        password: "asdfasdf"
      });
      console.log("signedUser", signedUser);
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
    const getUserInput = {
      id: signInData.signInUserSession.idToken.payload.sub
    };
    const { data } = await API.graphql(graphqlOperation(getUser, getUserInput));
    // if we can't get a user (meaning the user hasn't been registered before), then we execute registerUser
    console.log("data in registerNewUser", data);
    if (!data.getUser) {
      try {
        const registerUserInput = {
          ...getUserInput,
          username: signInData.username,
          //email: signInData.signInUserSession.idToken.payload.email,
          registered: true
        };
        const newUser = await API.graphql(
          graphqlOperation(createUser, { input: registerUserInput })
        );
        console.log({ newUser });
      } catch (err) {
        console.error("Error registering new user", err);
      }
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

<div class="bg-gray-200 p-4">
  <span class="block text-gray-700 text-center bg-gray-400 px-4 py-2">1</span>
  <span class="block text-gray-700 text-center bg-gray-400 px-4 py-2 mt-2">
    2
  </span>
  <span class="block text-gray-700 text-center bg-gray-400 px-4 py-2 mt-2">
    3
  </span>
</div>
{#if !user}
  <button class="ml-2 btn btn-blue" on:click={login}>Login</button>

  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Button w
</button>
{:else}
  <Navbar on:signout={handleSignout} {user} />
  <div>App</div>
{/if}
