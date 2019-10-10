<script>
  import { listMessages } from "../graphql/queries";
  import { createMessage } from "../graphql/mutations";
  import { onCreateMessage } from "../graphql/subscriptions";
  import { onMount, onDestroy } from "svelte";
  import { slide } from "svelte/transition";
  import API, { graphqlOperation } from "@aws-amplify/api";
  import sign_send_active from "../images/sign_send_active.svg";
  import sign_send_passive from "../images/sign_send_passive.svg";

  export let user;

  let messages = [];
  let messageText = "";
  let createMessageSub;
  let isChatOpen = false;

  onMount(async () => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(listMessages, { limit: 500 })
      );

      messages = data.listMessages.items.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      createMessageSub = API.graphql(
        graphqlOperation(onCreateMessage)
      ).subscribe({
        next: ({ value }) => {
          const newMessage = value.data.onCreateMessage;
          const updatedMessages = [...messages, newMessage];
          messages = updatedMessages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        }
      });
    } catch (err) {
      console.error("Error on Messages", err);
    }
  });

  onDestroy(() => {
    createMessageSub.unsubscribe();
  });

  function isMessageEmpty() {
    return messageText.trim() === "";
  }

  async function handleMessageSend({ detail }) {
    if (isMessageEmpty()) return;

    const newContent = messageText.replace(/\r?\n/g, "<br />");
    const createMessageInput = {
      content: newContent,
      messageAuthorId: user.sub
    };

    try {
      await API.graphql(
        graphqlOperation(createMessage, { input: createMessageInput })
      );
      messageText = "";
    } catch (err) {
      console.log("createMessage err:", err);
    }
  }

  function formatDate(dateText) {
    function addLeadingZero(dateText) {
      return ("0" + dateText).slice(-2);
    }
    const date = new Date(dateText);
    return `${addLeadingZero(date.getMonth() + 1)}/${addLeadingZero(
      date.getDate()
    )} ${addLeadingZero(date.getHours())}:${addLeadingZero(date.getMinutes())}`;
  }

  function toggleChat() {
    isChatOpen = !isChatOpen;
  }
</script>

{#if isChatOpen}
  <div class="flex justify-center">
    <div
      transition:slide|local={{ y: 1200, duration: 1500 }}
      class="vh65 flex flex-col sm:w-2/3 mt-8 w-full bottom-0 fixed">
      <div
        class="flex items-center space-between rounded-t-lg bg-green-600
        text-white h-8">
        <span class="pl-3 font-semibold">Kilikia Chat</span>
        <div
          on:click={toggleChat}
          class="w-12 h-8 ml-auto cursor-pointer flex items-center justify-end
          pr-3">
          <span class="nav arrow-down" />
        </div>
      </div>
      <div
        class="flex flex-col overflow-auto overflow-x-hidden border
        border-gray-400 border-b-0 bg-gray-100 pt-4 pr-4 pl-1 flex-1">
        {#each messages as message}
          <div
            class="flex items-start mb-2 pl-2 pb-2 text-sm bg-green-200 rounded">
            <div class="flex-1 overflow-hidden">
              <div>
                <span class="font-bold">{message.author.username}</span>
                <span class="text-grey text-xs">
                  {formatDate(message.createdAt)}
                </span>
              </div>
              <p class="text-black leading-normal">
                {@html message.content}
              </p>
            </div>
          </div>
        {/each}
      </div>
      <div class="flex h-1/3">
        <textarea
          placeholder="message..."
          bind:value={messageText}
          class="text-sm w-full shadow-inner p-2 rounded-bl-lg border-2
          border-grey outline-none"
          rows="4" />
        <div
          on:click={handleMessageSend}
          class={`flex items-center border-2 border-grey rounded-br-lg
          outline-none ${messageText.trim() === '' ? '' : 'cursor-pointer'}`}>
          {#if isMessageEmpty()}
            <img class="w-10 h-10" src={sign_send_passive} alt="send" />
          {:else}
            <img class="w-10 h-10" src={sign_send_active} alt="send" />
          {/if}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="flex justify-end mr-16">
    <div
      on:click={toggleChat}
      class="flex items-center bottom-0 fixed rounded-t-lg bg-green-600
      text-white h-8 cursor-pointer p-3 shadow-md font-semibold">
      Open Chat
    </div>
  </div>
{/if}
