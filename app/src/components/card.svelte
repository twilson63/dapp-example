<script>
  import { take, takeLast } from "ramda";
  import formatDistance from "date-fns/formatDistance";

  export let node;
</script>

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
