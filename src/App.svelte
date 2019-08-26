<script>
  import { API, graphqlOperation, Auth, Hub } from "aws-amplify";
  import { getUser } from "./graphql/queries";
  import { createUser } from "./graphql/mutations";
  import { onMount } from "svelte";
  import Navbar from "./components/Navbar";
  import PlayerLogin from "./components/PlayerLogin";

  let user = null;

  const username = "kilikia1";
  const password = "kilikia";

  onMount(async () => {
    getUserData();
    Hub.listen("auth", handleAuth);
  });

  function handleAuth(authData) {
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
      console.log("currentCredentials: ", userData);
      //console.log("Auth.currentCredentials() ", Auth.currentCredentials());
      if (userData) {
        user = userData;
      }
    } catch (err) {
      console.log("err currentAuthenticatedUser: ", err);
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
  <PlayerLogin />
{:else}
  <Navbar on:signout={handleSignout} {user} />
  <div>App</div>
{/if}
