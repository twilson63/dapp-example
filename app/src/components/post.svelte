<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let text = "";
  function createPost(e) {
    dispatch("submit", { text });
    text = "";
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
      <div class="card-actions justify-end">
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</form>
