<script>
  import { listMessages } from "../graphql/queries";
  import { createMessage } from "../graphql/mutations";
  import { onCreateMessage } from "../graphql/subscriptions";
  import { onMount, onDestroy } from "svelte";
  import API, { graphqlOperation } from "@aws-amplify/api";

  export let user;

  let messages = [];
  let messageText = "";
  let createMessageSub;

  onMount(async () => {
    try {
      const { data } = await API.graphql(graphqlOperation(listMessages));

      messages = data.listMessages.items;

      createMessageSub = API.graphql(
        graphqlOperation(onCreateMessage)
      ).subscribe({
        next: ({ value }) => {
          const newMessage = value.data.onCreateMessage;
          const updatedMessages = [...messages, newMessage];
          messages = updatedMessages;
          messageText = "";
        }
      });
    } catch (err) {
      console.error("Error on Messages", err);
    }
  });

  onDestroy(() => {
    createMessageSub.unsubscribe();
  });

  async function handleMessageSend({ detail }) {
    const createMessageInput = {
      content: messageText,
      messageAuthorId: user.sub
    };

    try {
      await API.graphql(
        graphqlOperation(createMessage, { input: createMessageInput })
      );
    } catch (err) {
      console.log("createMessage err:", err);
    }
  }

  function formatDate(dateText) {
    const date = new Date(dateText);
    return `${date.getMonth() +
      1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
</script>

<style>
  ::-webkit-scrollbar {
    width: 4px;
    cursor: pointer;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 4px;
  }
</style>

<div class="flex flex-col mx-auto w-full mt-8">
  <div
    class="flex flex-col h-48 overflow-auto overflow-x-hidden border
    border-gray-400 border-b-0">
    {#each messages as message}
      <div class="flex items-start mb-4 pl-2 text-sm">
        <div class="flex-1 overflow-hidden">
          <div>
            <span class="font-bold">{message.author.username}</span>
            <span class="text-grey text-xs">
              {formatDate(message.createdAt)}
            </span>
          </div>
          <p class="text-black leading-normal">{message.content}</p>
        </div>
      </div>
    {/each}
  </div>
  <div class="flex">
    <textarea
      bind:value={messageText}
      class="text-sm w-full shadow-inner p-2 rounded-l-lg border-2 border-grey"
      rows="4" />
    <button
      on:click={handleMessageSend}
      class="border-2 border-grey rounded-r-lg">
      Send
    </button>
  </div>
</div>
