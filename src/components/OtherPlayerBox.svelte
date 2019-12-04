<script>
  import API, { graphqlOperation } from "@aws-amplify/api";
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import { listOtherPlayers } from "../graphql/queries";
  import {
    createOtherPlayer,
    deleteOtherPlayer,
    updateOtherPlayer
  } from "../graphql/mutations";
  import {
    onCreateOtherPlayer,
    onUpdateOtherPlayer,
    onDeleteOtherPlayer
  } from "../graphql/subscriptions";
  import PlayerVote from "./PlayerVote";

  import sign_plus_active from "../images/sign_plus_active.svg";
  import sign_minus_active from "../images/sign_minus_active.svg";
  import sign_close_red from "../images/sign_close_red.svg";
  import spinner_blue from "../images/spinner_blue.svg";

  export let user;
  export let value = [];

  let createOtherPlayerSub;
  let deleteOtherPlayerSub;
  let updateOtherPlayerSub;

  let otherPlayers = [];
  let addPlayer = {
    name: null,
    isComing: null,
    adderName: null
  };
  let showAddPlayerBox = false;
  let isLoading = false;

  let otherPlayerVotes = [];

  $: value = otherPlayers.map(player => ({ isComing: player.isComing }));

  onMount(async () => {
    //value = [{isComing: 'YES'}, {isComing: 'YES'}, {isComing: 'YES'}, {isComing: 'YES'}, {isComing: 'YES'}, {isComing: 'YES'}]
    try {
      const { data } = await API.graphql(
        graphqlOperation(listOtherPlayers, { limit: 500 })
      );
      otherPlayers = data.listOtherPlayers.items.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      createOtherPlayerSub = API.graphql(
        graphqlOperation(onCreateOtherPlayer)
      ).subscribe({
        next: ({ value }) => {
          const newOtherPlayer = value.data.onCreateOtherPlayer;
          const updatedOtherPlayers = [...otherPlayers, newOtherPlayer];
          otherPlayers = updatedOtherPlayers.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        }
      });

      deleteOtherPlayerSub = API.graphql(
        graphqlOperation(onDeleteOtherPlayer)
      ).subscribe({
        next: ({ value }) => {
          const deleteOtherPlayer = value.data.onDeleteOtherPlayer;

          const updatedOtherPlayers = otherPlayers.filter(
            player => player.id !== deleteOtherPlayer.id
          );
          otherPlayers = updatedOtherPlayers;
        }
      });

      updateOtherPlayerSub = API.graphql(
        graphqlOperation(onUpdateOtherPlayer)
      ).subscribe({
        next: ({ value }) => {
          //if (!isLocalVoteUpdated) {
          const updatedOtherPlayer = value.data.onUpdateOtherPlayer;
          const index = otherPlayers.findIndex(
            player => player.id === updatedOtherPlayer.id
          );

          const updatedOtherPlayers = [
            ...otherPlayers.slice(0, index),
            updatedOtherPlayer,
            ...otherPlayers.slice(index + 1)
          ];

          otherPlayers = updatedOtherPlayers;
          // }
        }
      });
    } catch (err) {
      console.error("Error on Messages", err);
    }
  });

  onDestroy(() => {
    createOtherPlayerSub.unsubscribe();
  });

  function toggleAddPlayerBox() {
    showAddPlayerBox = !showAddPlayerBox;
    if (!showAddPlayerBox) {
      addPlayer.name = null;
      addPlayer.isComing = null;
    }
  }

  async function handleVoteUpdate(otherPlayer, { detail }) {
    const backupOtherPlayers = [...otherPlayers];
    try {
      const updatedOtherPlayer = { ...otherPlayer, isComing: detail };

      const index = otherPlayers.findIndex(
        player => player.id === updatedOtherPlayer.id
      );

      const updatedOtherPlayers = [
        ...otherPlayers.slice(0, index),
        updatedOtherPlayer,
        ...otherPlayers.slice(index + 1)
      ];

      otherPlayers = updatedOtherPlayers;

      await API.graphql(
        graphqlOperation(updateOtherPlayer, {
          input: {
            id: updatedOtherPlayer.id,
            isComing: updatedOtherPlayer.isComing
          }
        })
      );
    } catch (err) {
      otherPlayers = backupOtherPlayers;
      console.log("handleVoteUpdate err:", err);
    }
  }
  async function handleVoteCreate({ detail }) {
    addPlayer.isComing = detail;
    handleAddPlayer();
  }

  function isAddPlayerValid(addPlayer) {
    return (
      addPlayer.name == null ||
      addPlayer.name === "" ||
      addPlayer.isComing == null
    );
  }

  async function handleAddPlayer() {
    if (isAddPlayerValid(addPlayer)) return;

    const createOtherPlayerInput = {
      ...addPlayer,
      adderName: user.username
    };

    try {
      isLoading = true;
      await API.graphql(
        graphqlOperation(createOtherPlayer, { input: createOtherPlayerInput })
      );

      addPlayer = {
        name: null,
        isComing: null,
        adderName: null
      };
      isLoading = false;
      showAddPlayerBox = false;
    } catch (err) {
      console.log("createMessage err:", err);
      isLoading = false;
    }
  }

  async function handleOtherPlayerDelete(otherPlayer) {
    const backupOtherPlayers = [...otherPlayers];
    const deleteOtherPlayerInput = {
      id: otherPlayer.id
    };

    try {
      const updatedOtherPlayers = otherPlayers.filter(
        player => player.id !== otherPlayer.id
      );
      otherPlayers = updatedOtherPlayers;

      await API.graphql(
        graphqlOperation(deleteOtherPlayer, { input: deleteOtherPlayerInput })
      );
    } catch (err) {
      console.log("updateVote err:", err);
      otherPlayers = backupOtherPlayers;
    }
  }
</script>

<div class="flex flex-col mt-10">
  <div class="flex mb-2">
    <div class="flex cursor-pointer" on:click={toggleAddPlayerBox}>
      <div class="text-orange-700 text-lg font-semibold">Այլ խաղացողներ</div>
      {#if user}
        <img
          class="w-6 h-6 ml-2"
          src={showAddPlayerBox ? sign_minus_active : sign_plus_active}
          alt="add player" />
      {/if}
    </div>
    <div>&nbsp;</div>
  </div>
  {#if showAddPlayerBox}
    <div
      transition:fly
      class="flex w-full absolute mt-8 p-2 bg-white border border-gray-400 z-40">
      <span class="w-2/5">
        <input
          class="w-4/5 border py-2 px-3 text-grey-darkest w-32"
          type="text"
          bind:value={addPlayer.name}
          placeholder="Անուն" />
      </span>
      <span class="flex w-3/5 relative">
        <PlayerVote
          on:vote={details => handleVoteCreate(details)}
          vote={addPlayer.isComing} />
        {#if isLoading}
          <div
            class="flex items-center justify-center bg-white w-full h-full
            absolute">
            <img class="w-6 h-6" src={spinner_blue} alt="loading" />
          </div>
        {/if}
      </span>
    </div>
  {/if}
  <div class="flex flex-1 flex-col overflow-auto overflow-x-hidden border-b-0">
    {#each otherPlayers as otherPlayer}
      <div class={`flex w-full h-12 border-b border-gray-300`}>
        <span class={`w-2/5 flex items-center font-normal`}>
          {otherPlayer.name}
        </span>
        <span class="w-3/5 flex relative">
          <PlayerVote
            vote={otherPlayer.isComing}
            on:vote={details => user && otherPlayer.adderName === user.username && handleVoteUpdate(otherPlayer, details)} />
          <span class="ml-auto font-thin text-gray-600 text-sm self-end">
            {otherPlayer.adderName}
          </span>
          <span class="absolute top-0 right-0 mt-1">
            {#if user && otherPlayer.adderName === user.username}
              <img
                on:click={() => otherPlayer.adderName === user.username && handleOtherPlayerDelete(otherPlayer)}
                class="w-6 h-6 cursor-pointer"
                src={sign_close_red}
                alt="delete" />
            {/if}
          </span>
        </span>
      </div>
    {/each}
  </div>
</div>
