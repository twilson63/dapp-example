<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let text = "";
  let topic = "";

  function createPost(e) {
    dispatch("submit", { text, topic });
    text = "";
    topic = "";
  }
</script>

<form class="w-full" on:submit|preventDefault={createPost}>
  <div class="card w-full bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">New Post</h2>
      <textarea
        bind:value={text}
        class="textarea textarea-bordered"
        placeholder="Enter post here."
      />
      <div class="form-control w-full max-w-xs">
        <label class="label" for="topic">Topic</label>
        <input
          id="topic"
          type="text"
          class="input input-bordered w-full max-w-xs"
          placeholder="Enter a topic..."
          bind:value={topic}
        />
      </div>
      <div class="card-actions justify-end">
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</form>
