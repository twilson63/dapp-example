<script>
  import { take, takeLast } from "ramda";
  import formatDistance from "date-fns/formatDistance";

  export let node;
</script>

<div class="card w-full bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">
      <a class="text-blue-200" href="/owners/{node.owner}"
        >{take(5, node.owner) + "..." + takeLast(5, node.owner)}</a
      >
    </h2>

    {#await node.request then text}
      <p>
        {text}
      </p>
    {/await}
    {#if node.topic}
      <div class="mt-4">
        <a href="/topics/{node.topic}" class="text-blue-200">#{node.topic}</a>
      </div>
    {/if}

    <div class="card-actions justify-end">
      <div>{formatDistance(node.timestamp, new Date())}</div>
    </div>
  </div>
</div>
