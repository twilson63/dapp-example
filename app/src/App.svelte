<script>
	import { Route } from "tinro";
	import { arweave, waitForNewPosts, getPostInfos } from "./api.js";

	import Feed from "./feed.svelte";
	import Topics from "./topics.svelte";

	let connected = false;
	let showPost = false;
	let showNotify = false;

	let posts = getPostInfos();

	async function connect() {
		if (!window.arweaveWallet) {
			return alert("ArConnect is not installed!");
		}
		await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"], {
			name: "PublicSquare",
		});
		const address = await arweaveWallet.getActiveAddress();
		window.localStorage.setItem("address", address);
		connected = true;
	}

	async function disconnect() {
		await window.arweaveWallet.disconnect();
		window.localStorage.removeItem("address");
		connected = false;
	}

	async function createPost(e) {
		const data = e.detail.text;
		const topic = e.detail.topic;
		// createTransaction
		const tx = await arweave.createTransaction({ data });
		tx.addTag("App-Name", "PublicSquare");
		tx.addTag("Content-Type", "text/plain");
		tx.addTag("Version", "1.0.1");
		tx.addTag("Type", "post");
		// if topic supplied then add to tx
		if (topic.length > 0) {
			tx.addTag("Topic", topic);
		}

		try {
			showNotify = true;
			await arweave.transactions.sign(tx);
			await arweave.transactions.post(tx);
			posts = await waitForNewPosts(tx.id);

			showNotify = false;
		} catch (e) {
			console.log(e);
			alert("ERROR: " + e.message);
		}
	}

	setTimeout(() => {
		if (localStorage.getItem("address")) {
			window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"], {
				name: "PublicSquare",
			});
			connected = true;
		}
	}, 500);
</script>

<Route path="/">
	<Feed
		{connected}
		{posts}
		{showNotify}
		{showPost}
		on:createPost={createPost}
		on:connect={connect}
		on:disconnect={disconnect}
	/>
</Route>
<Route path="/topics/:topic" let:meta>
	<Topics posts={getPostInfos(meta.params.topic)} />
</Route>
