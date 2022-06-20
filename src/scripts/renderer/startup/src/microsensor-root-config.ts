import { registerApplication, start } from "single-spa";

function activeWhenPrefix(routes) {
	let baseUrl = location.pathname;
	function correctBaseUrl(fragment) {
		if (baseUrl.slice(-1) === "/") {
			baseUrl = baseUrl.slice(0, -1);
		}

		return baseUrl.concat(fragment);
	}

	return function (location) {
		return routes.some((route) => location.pathname.startsWith(correctBaseUrl(route)));
	};
}

registerApplication({
	name: "@microsensor/dashboard",
	app: () => System.import("@microsensor/dashboard"),
	activeWhen: () => true
});

registerApplication({
	name: "@microsensor/nav",
	app: () => System.import("@microsensor/nav"),
	activeWhen: () => true
});

registerApplication({
	name: "@microsensor/msanose",
	app: () => System.import("@microsensor/msanose"),
	activeWhen: activeWhenPrefix(["/tools/msanose"])
});


start({
  urlRerouteOnly: true,
});
