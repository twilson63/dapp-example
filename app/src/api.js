import { concat, find, propEq, prop, last } from 'ramda'

let cursor = null

export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

export const createPostInfo = (node) => {
  const ownerAddress = node.owner.address;
  const height = node.block ? node.block.height : -1;
  const timestamp = node.block ? parseInt(node.block.timestamp, 10) * 1000 : new Date();
  const postInfo = {
    txid: node.id,
    owner: ownerAddress,
    height: height,
    length: node.data.size,
    timestamp: timestamp,
  }
  postInfo.topic = node.tags && prop('value', find(propEq('name', 'Topic'), node.tags))
  postInfo.request = arweave.api.get(`/${node.id}`, { timeout: 10000 })
   .then(x => x.data)
   .catch(() => { postInfo.error = "timeout loading data"});
  return postInfo;
 }

export const buildQuery = ({count, address, topic, after}) => {
  
  count = Math.min(100, count || 100)
  let ownersFilter = '';
  if (address) {
    ownersFilter = `owners: ["${address}"],`
  }
  let topicFilter = ''
  if (topic) {
    topicFilter = `{
      name: "Topic",
      values: ["${topic}"]
    },`
  }
  let afterFilter = '';
  if (after) {
    afterFilter = `after: "${after}",`
  }
  const queryObject = {
    query: `{
      transactions(first: ${count}, ${afterFilter} ${ownersFilter} 
        tags: [
          { name: "App-Name", values: ["PublicSquare"]},
          { name: "Content-Type", values: ["text/plain"]},
          ${topicFilter}
        ]) {
        edges {
          cursor
          node {
            id
            owner {
              address
            }
            data {
              size
            }
            block {
              height
              timestamp
            }
            tags {
              name,
              value
            }
          }
        }
      }
    }`
  }
  return queryObject;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForNewPosts(txid) {
  let count = 0;
  let foundPost = null;
  let posts = [];

  while (!foundPost) {
    count += 1;
    console.log(`attempt ${count}`);
    await delay(2000 * count);
    posts = await getPostInfos();
    foundPost = posts.find((p) => p.txid === txid);
  }

  let i = posts.indexOf(foundPost);
  posts.unshift(posts.splice(i, 1)[0]);
  return posts;
}

export async function getPostInfos(topic) {
  const query = buildQuery({topic});

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
  cursor = last(edges).cursor
  return edges.map((edge) => createPostInfo(edge.node));
}

export async function getPostByOwner(address) {
  const query = buildQuery({address});

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
  cursor = last(edges).cursor
  return edges.map((edge) => createPostInfo(edge.node));
}

export async function more(posts) {
  console.log(cursor)
  if (!cursor) {
    alert('no more posts available') 
    return posts
  }
  const query = buildQuery({after: cursor}) 
  const { data } = await arweave.api.post('/graphql', query).catch(_e => ({ data: { transactions: {edges: []}}}))
  
  const edges = data.data.transactions.edges;
  cursor = last(edges) ? last(edges).cursor : null
  //return concat(posts, edges.map(e => createPostInfo(e.node)))
  return [...posts, ...edges.map(e => createPostInfo(e.node))]
}