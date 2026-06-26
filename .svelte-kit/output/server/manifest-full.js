export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BdU6lmj2.js",app:"_app/immutable/entry/app.DbkPhtjP.js",imports:["_app/immutable/entry/start.BdU6lmj2.js","_app/immutable/chunks/CBvlGrUA.js","_app/immutable/chunks/BfgXOanZ.js","_app/immutable/chunks/uQk7khKP.js","_app/immutable/entry/app.DbkPhtjP.js","_app/immutable/chunks/CJy9Jxa7.js","_app/immutable/chunks/BfgXOanZ.js","_app/immutable/chunks/D-nqWFlr.js","_app/immutable/chunks/F9JxdrvX.js","_app/immutable/chunks/H9Ae_rwt.js","_app/immutable/chunks/uQk7khKP.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
