<script>
  import { createEventDispatcher } from "svelte";

  import Post from "./components/post.svelte";
  import Notify from "./components/notify.svelte";
  import Navbar from "./components/navbar.svelte";
  import Spinner from "./components/spinner.svelte";
  import Card from "./components/card.svelte";

  export let connected = false;
  export let showPost = false;
  export let showNotify = false;
  export let posts = Promise.resolve([]);

  const dispatch = createEventDispatcher();

  async function createPost(e) {
    showPost = false;
    dispatch("createPost", e.detail);
  }
</script>

<Navbar
  title="Town Square - Topics"
  {connected}
  on:toggle={() => (showPost = !showPost)}
  on:connect={() => dispatch("connect")}
  on:disconnect={() => dispatch("disconnect")}
/>
<main class="hero min-h-screen bg-base-200">
  <div class="hero-content flex-col">
    {#if showPost}
      <Post on:submit={createPost} />
    {/if}
    {#if showNotify}
      <Notify text="Saving post to Public Square" />
    {/if}
    {#await posts}
      <Spinner />
    {:then nodes}
      {#each nodes as node}
        <Card {node} />
      {/each}
    {/await}
  </div>
</main>
