<script>
  export let user;
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function signout(e) {
      dispatch('signout', e)
  }
  console.log('user from Navbar', user);
</script>

<div class="flex nav-container">
  <span class="app-title">
    <img
      src="https://icon.now.sh/account_balance/f90"
      alt="App Icon"
      class="app-icon" />
    AmplifyAgora |
  </span>

  <div class="nav-items">
    <span>Hello, {user.username} |</span>
  </div>
  <div class="nav-items">
    <button on:click={signout}>Sign Out</button>
  </div>
</div>
