<script>
  import { buildQuery, arweave, createPostInfo } from "./api.js";
  import { take, takeLast } from "ramda";
  import formatDistance from "date-fns/formatDistance";
  import Post from "./components/post.svelte";

  let showPost = false;
  let connected = false;

  async function connect() {
    if (!window.arweaveWallet) {
      return alert("ArConnect is not installed!");
    }
    await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"], {
      name: "PublicSquare",
    });
    connected = true;
  }

  async function disconnect() {
    await window.arweaveWallet.disconnect();
    connected = false;
  }

  function togglePost() {
    showPost = !showPost;
  }
  async function getPostInfos() {
    const query = buildQuery();

    const res = await fetch("https://arweave.net/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    });
    // const results = await arweave.api.post("/graphql", query).catch((err) => {
    // 	console.error("GraphQL query failed");
    // 	throw new Error(err);
    // });
    const results = await res.json();
    const edges = results.data.transactions.edges;
    //console.log(edges);
    return edges.map((edge) => createPostInfo(edge.node));
  }

  async function createPost(e) {
    // createTransaction
    const tx = await arweave.createTransaction({ data: e.detail.text });
    tx.addTag("App-Name", "PublicSquare");
    tx.addTag("Content-Type", "text/plain");
    tx.addTag("Version", "1.0.1");
    tx.addTag("Type", "post");
    console.log(tx);
    try {
      await arweave.transactions.sign(tx);
      await arweave.transactions.post(tx);
      console.log(`Tx ${result.id}`);
      showPost = false;
      alert("Successfully sent!");
    } catch (e) {
      console.log(e);
      alert("ERROR: " + e.message);
    }
  }
</script>

<header class="navbar bg-base-100">
  <div class="flex-1">
    <a href="/" class="btn btn-ghost normal-case text-xl">Town Square</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal p-0">
      {#if connected}
        <li><a on:click={togglePost}>Post</a></li>
        <li><a on:click={disconnect}>Disconnect</a></li>
      {:else}
        <li><a on:click={connect}>Connect</a></li>
      {/if}
    </ul>
  </div>
</header>
<main class="hero min-h-screen bg-base-200">
  <div class="hero-content flex-col">
    {#if showPost}
      <Post on:submit={createPost} />
    {/if}
    {#await getPostInfos()}
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    {:then nodes}
      {#each nodes as node}
        <div class="card w-full bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">
              {take(5, node.owner) + "..." + takeLast(5, node.owner)}
            </h2>
            <p>
              {#await node.request then text}
                <div>{text}</div>
              {/await}
            </p>
            <div class="card-actions justify-end">
              <div>{formatDistance(node.timestamp, new Date())}</div>
            </div>
          </div>
        </div>
      {/each}
    {/await}
  </div>
</main>
