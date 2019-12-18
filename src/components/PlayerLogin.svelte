<script>
  import API, { graphqlOperation } from "@aws-amplify/api";
  import { createEventDispatcher, onMount, tick } from "svelte";
  import { fly } from "svelte/transition";
  import { listUsers } from "../graphql/queries";
  import sign_confirmed from "../images/sign_confirmed.svg";
  import spinner from "../images/spinner.svg";

  const dispatch = createEventDispatcher();

  export let errorMessage;
  export let navbarMode;
  export let isLoading;

  let players = [];
  let confirmPassword = null;
  let password = "";
  let isConfirmPasswordTouched = false;
  let isPasswordTouched = false;

  let selectedPlayer = null;
  let isDropdownOpen = false;

  $: passwordLengthError = isPasswordTouched && password.trim().length === 0;

  $: passwordMatchError =
    isConfirmPasswordTouched &&
    confirmPassword !== null &&
    password !== confirmPassword;

  onMount(async () => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(listUsers, { limit: 100 })
      );

      players = data.listUsers.items.sort((a, b) => {
        const nameA = a.username.toLowerCase();
        const nameB = b.username.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    } catch (err) {
      console.error("Error SELECT new user", err);
    }
  });

  function toggleDropdown(e) {
    e.stopPropagation();
    isDropdownOpen = !isDropdownOpen;
  }

  function isPasswordMatch() {
    return false;
  }

  function isFormValid() {
    if (password.trim().length === 0) {
      passwordLengthError = true;
      return false;
    }
    if (!selectedPlayer.confirmed && !confirmPassword) {
      passwordMatchError = true;
      return false;
    }

    return !passwordLengthError && !passwordMatchError;
  }

  function loginPlayer() {
    if (!isFormValid()) {
      return;
    }
    if (isLoading) return false;
    dispatch("login", {
      username: selectedPlayer.username,
      password,
      isConfirmed: selectedPlayer.confirmed
    });
  }

  function closeDropdown() {
    isDropdownOpen = false;
    selectedPlayer = null;
  }
</script>

<svelte:window on:click={closeDropdown} />

<div class={`flex flex-col bg-white overflow-hidden w-48 z-10 `}>
  <div
    on:click={toggleDropdown}
    class={`flex h-10 items-center ${navbarMode ? 'bg-indigo-900' : 'bg-white'}`}>
    <span
      class={`w-4/5  cursor-pointer pr-3 capitalize ${navbarMode ? 'text-white' : 'text-gray-700'} ${selectedPlayer ? 'text-center pl-4' : navbarMode ? 'text-right pl-2' : 'text-center'}`}>
      {selectedPlayer ? selectedPlayer.username : 'Log in'}
    </span>
    <span
      class={`${isDropdownOpen ? 'arrow-up' : 'arrow-down'} ${navbarMode && 'nav'}`} />
  </div>
  {#if isDropdownOpen}
    <ul
      transition:fly={{ duration: 250 }}
      class="flex flex-col items-start absolute mt-10 bg-white border
      border-gray-400 w-48 border-t-0 h-64 overflow-auto overflow-x-hidden">
      {#each players as player}
        <li
          on:click={e => {
            password = '';
            confirmPassword = null;
            isPasswordTouched = false;
            isConfirmPasswordTouched = false;
            errorMessage = '';
            selectedPlayer = player;
            toggleDropdown(e);
          }}
          class="flex items-center w-full pl-2 py-4 h-12 cursor-pointer
          hover:bg-teal-600">

          <span class="w-1/5 inline-block">
            {#if player.confirmed}
              <img class="w-6 h-6" src={sign_confirmed} alt="confirmed" />
            {:else}&nbsp;{/if}
          </span>

          <span class="w-4/5 capitalize">{player.username}</span>
        </li>
      {/each}
    </ul>
  {:else if !isDropdownOpen && selectedPlayer && selectedPlayer.username}
    <div
      transition:fly
      on:click={e => e.stopPropagation()}
      class="flex flex-col items-start absolute mt-10 bg-white border
      border-gray-400 w-48 border-t-0 overflow-auto overflow-x-hidden">
      {#if selectedPlayer.confirmed}
        <input
          class="border py-2 px-3 text-grey-darkest"
          type="password"
          bind:value={password}
          on:blur={() => (isPasswordTouched = true)}
          placeholder="Password" />
      {:else}
        <input
          class="border py-2 px-3 text-grey-darkest mb-3"
          type="password"
          bind:value={password}
          on:blur={() => (isPasswordTouched = true)}
          placeholder="New Password" />
        <input
          class="border py-2 px-3 text-grey-darkest"
          type="password"
          bind:value={confirmPassword}
          on:blur={() => (isConfirmPasswordTouched = true)}
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
        class="block bg-teal-500 hover:bg-teal-700 text-white uppercase py-2
        px-8 m-3 mx-auto rounded"
        type="submit"
        on:click={loginPlayer}>
        {#if isLoading}
          <img class="w-6 h-6" src={spinner} alt="loading" />
        {:else}{selectedPlayer.confirmed ? 'Login' : 'Sign up'}{/if}
      </button>
    </div>
  {/if}
</div>
