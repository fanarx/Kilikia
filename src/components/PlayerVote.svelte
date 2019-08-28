<script>
  import { createEventDispatcher } from "svelte";
  import sign_yes_active from "../images/sign_yes_active.svg";
  import sign_yes_passive from "../images/sign_yes_passive.svg";
  import sign_no_active from "../images/sign_no_active.svg";
  import sign_no_passive from "../images/sign_no_passive.svg";
  import sign_maybe_active from "../images/sign_maybe_active.svg";
  import sign_maybe_passive from "../images/sign_maybe_passive.svg";

  export let vote;

  //const dispatch = createEventDispatcher();

  function generateVoteIcons(vote) {
    let content = ['<div class="flex w-full">'];

    const yesIcon = vote == "YES" ? sign_yes_active : sign_yes_passive;
    content.push(yesIcon);

    const noIcon = vote == "NO" ? sign_no_active : sign_no_passive;
    content.push(noIcon);

    const maybeIcon = vote == "MAYBE" ? sign_maybe_active : sign_maybe_passive;
    content.push(maybeIcon);

    content.push("</div>");
    console.log("content", content);
    return content.join("");
  }
</script>

<style>
  svg {
    background-size: 30px 30px;
  }
</style>

<div class="flex">
  {@html generateVoteIcons(vote)}
</div>
