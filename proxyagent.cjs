// proxyagent.cjs
const { ProxyAgent, setGlobalDispatcher } = require("undici");

const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
if (proxy) {
	console.log("[proxy‑agent] routing fetch() through", proxy);
	setGlobalDispatcher(new ProxyAgent(proxy));
}
