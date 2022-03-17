export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

export const createPostInfo = (node) => {
  const ownerAddress = node.owner.address;
  const height = node.block ? node.block.height : -1;
  const timestamp = node.block ? parseInt(node.block.timestamp, 10) * 1000 : -1;
  const postInfo = {
    txid: node.id,
    owner: ownerAddress,
    height: height,
    length: node.data.size,
    timestamp: timestamp,
  }
  postInfo.request = arweave.api.get(`/${node.id}`, { timeout: 10000 })
   .then(x => x.data)
   .catch(() => { postInfo.error = "timeout loading data"});
  return postInfo;
 }

export const buildQuery = () => {
  const queryObject = {
    query: `{
      transactions(first: 100, tags: [
        { name: "App-Name", values: ["PublicSquare"]},
        { name: "Content-Type", values: ["text/plain"]}
      ]) {
        edges {
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