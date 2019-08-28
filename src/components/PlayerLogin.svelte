<script>
  import { API, graphqlOperation } from "aws-amplify";
  import { createEventDispatcher, onMount, tick } from "svelte";
  import { listUsers } from "../graphql/queries";
  import confirmed from "../images/confirmed.svg";

  const dispatch = createEventDispatcher();

  export let errorMessage;
  let players = [];
  let confirmPassword = null;
  let password = "";
  let isLogging = false;

  let selectedPlayer = null;
  let isDropdownOpen = false;

  $: passwordLengthError = isLogging && password.trim().length === 0;

  $: passwordMatchError =
    isLogging && confirmPassword !== null && password !== confirmPassword;

  onMount(async () => {
    try {
      const { data } = await API.graphql(graphqlOperation(listUsers));

      console.log("data", data);
      players = data.listUsers.items;
    } catch (err) {
      console.error("Error SELECT new user", err);
    }
  });

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function isPasswordMatch() {
    return false;
  }

  function isFormValid() {
    console.log("passwordLengthError", passwordLengthError);
    console.log("passwordMatchError", passwordMatchError);
    return !passwordLengthError && !passwordMatchError;
  }

  function loginPlayer() {
    isLogging = true;
    if (!isFormValid()) {
      return;
    }
    dispatch("login", {
      username: selectedPlayer.username,
      password,
      isConfirmed: selectedPlayer.confirmed
    });
  }
</script>

<style>
  .arrow-up {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;

    border-bottom: 5px solid black;
  }

  .arrow-down {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;

    border-top: 5px solid black;
  }
</style>

<div
  class="flex flex-col max-w-sm mx-auto bg-white shadow-lg rounded-lg
  overflow-hidden">
  <div on:click={toggleDropdown} class="flex h-10 items-center">
    <span
      class={`w-4/5 text-center cursor-pointer ${!selectedPlayer && 'text-gray-700'}`}>
      {selectedPlayer ? selectedPlayer.username : '-- Select a player --'}
    </span>
    <span
      class={`${isDropdownOpen ? 'arrow-up' : 'arrow-down'} text-gray-700`} />
  </div>
  {#if isDropdownOpen}
    <ul
      class="flex flex-col items-center absolute mt-10 bg-white border
      border-gray-400">
      {#each players as player}
        <li
          on:click={() => {
            password = '';
            confirmPassword = null;
            isLogging = false;
            errorMessage = '';
            selectedPlayer = player;
            toggleDropdown();
          }}
          class="flex w-full px-6 py-4 h-12 cursor-pointer hover:bg-teal-600">

          <span class="w-2/5 inline-block">
            {#if player.confirmed}
              {@html confirmed}
            {:else}&nbsp;{/if}
          </span>

          <span class="w-3/5">{player.username}</span>
        </li>
      {/each}
    </ul>
  {:else if !isDropdownOpen && selectedPlayer && selectedPlayer.username}
    {#if selectedPlayer.confirmed}
      <input
        class="border py-2 px-3 text-grey-darkest"
        type="password"
        bind:value={password}
        placeholder="Password" />
    {:else}
      <input
        class="border py-2 px-3 text-grey-darkest mb-3"
        type="password"
        bind:value={password}
        placeholder="Password" />
      <input
        class="border py-2 px-3 text-grey-darkest"
        type="password"
        bind:value={confirmPassword}
        placeholder="Confirm Password" />
    {/if}
    {#if passwordLengthError}
      <p class="text-red-500">Password is empty</p>
    {/if}
    {#if passwordMatchError}
      <p class="text-red-500">Passwords do not match</p>
    {/if}
    {#if errorMessage}
      <p class="text-red-500">{errorMessage}</p>
    {/if}
    <button
      class="block bg-teal-500 hover:bg-teal-700 text-white uppercase py-2 px-8
      m-3 mx-auto rounded"
      type="submit"
      on:click={loginPlayer}>
      {selectedPlayer.confirmed ? 'Login' : 'Sign up'}
    </button>
  {/if}
</div>
