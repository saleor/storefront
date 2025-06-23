// Since this mini app does not communicate with the Saleor API,
// we do not need to keep app token

export async function POST() {
	console.log("Dummy registration");
	return new Response("", {
		status: 200,
	});
}
