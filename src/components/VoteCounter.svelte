<script>
  import { onMount, afterUpdate } from "svelte";
  export let votes;

  let yesNumber = "";
  let noNumber = "";
  let maybeNumber = "";

  function countVotes(votes) {
    const votesObj = votes.reduce(
      (acc, val) => {
        if (val.isComing === "YES") {
          acc.yesNumber += 1;
        } else if (val.isComing === "NO") {
          acc.noNumber += 1;
        } else if (val.isComing === "MAYBE") {
          acc.maybeNumber += 1;
        }

        return acc;
      },
      { yesNumber: 0, noNumber: 0, maybeNumber: 0 }
    );

    yesNumber = votesObj.yesNumber;
    noNumber = votesObj.noNumber;
    maybeNumber = votesObj.maybeNumber;
  }

  afterUpdate(() => {
    countVotes(votes);
  });
  onMount(() => {
    countVotes(votes);
  });
</script>

<style>

</style>

<div class="flex w-full items-center h-12">
  <span
    class="w-8 h-8 mr-4 sm:mr-6 text-center text-lg font-bold text-green-600">
    {yesNumber}
  </span>
  <span class="w-8 h-8 mr-4 sm:mr-6 text-center text-lg font-bold text-red-600">
    {noNumber}
  </span>
  <span class="w-8 h-8 text-center text-lg font-bold text-blue-600">
    {maybeNumber}
  </span>
</div>
