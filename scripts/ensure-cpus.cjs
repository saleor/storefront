const os = require("os");
const realCpus = os.cpus.bind(os);
const cpus = realCpus();
if (cpus.length === 0) {
	const fallbackCpu = {
		model: "virtual",
		speed: 1,
		times: {
			user: 0,
			nice: 0,
			sys: 0,
			idle: 0,
			irq: 0,
		},
	};
	const fallbackList = [fallbackCpu];
	Object.defineProperty(os, "cpus", {
		value: () => fallbackList,
		configurable: true,
	});
}
