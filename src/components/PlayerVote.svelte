<script>
  import { createEventDispatcher } from "svelte";
  import sign_yes_active from "../images/sign_yes_active.svg";
  import sign_yes_passive from "../images/sign_yes_passive.svg";
  import sign_no_active from "../images/sign_no_active.svg";
  import sign_no_passive from "../images/sign_no_passive.svg";
  import sign_maybe_active from "../images/sign_maybe_active.svg";
  import sign_maybe_passive from "../images/sign_maybe_passive.svg";

  export let vote;

  const dispatch = createEventDispatcher();

  function handleClick(vote) {
    console.log("vote", vote);
  }
</script>

<style>

</style>

<div class="flex w-full items-center h-12">
  <img
    on:click={() => dispatch('vote', "YES")}
    class="w-8 h-8"
    src={vote === 'YES' ? sign_yes_active : sign_yes_passive}
    alt={'YES'} />
  <img
    on:click={() => dispatch('vote', "NO")}
    class="w-8 h-8"
    src={vote === 'NO' ? sign_no_active : sign_no_passive}
    alt={'NO'} />
  <img
    on:click={() => dispatch('vote', "MAYBE")}
    class="w-8 h-8"
    src={vote === 'MAYBE' ? sign_maybe_active : sign_maybe_passive}
    alt={'MAYBE'} />
</div>
