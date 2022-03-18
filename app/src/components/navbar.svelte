<script>
  import { createEventDispatcher } from "svelte";
  export let connected;
  export let title = "Town Square";
  const dispatch = createEventDispatcher();

  function togglePost() {
    dispatch("toggle");
  }

  function disconnect() {
    dispatch("disconnect");
  }

  function connect() {
    dispatch("connect");
  }
</script>

<header class="navbar bg-base-100">
  <div class="flex-1">
    <a href="/" class="btn btn-ghost normal-case text-xl">{title}</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal p-0">
      {#if connected}
        <li>
          <button class="btn btn-ghost" on:click={togglePost}>Post</button>
        </li>
        <li>
          <button class="btn btn-ghost" on:click={disconnect}>Disconnect</button
          >
        </li>
      {:else}
        <li>
          <button class="btn btn-ghost" on:click={connect}>Connect</button>
        </li>
      {/if}
    </ul>
  </div>
</header>
