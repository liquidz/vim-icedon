import { Denops, unknownutil } from "./deps.ts";
import * as core from "./core/mod.ts";
import { AppImpl } from "./impl/app.ts";
import { App } from "./types.ts";
import * as builtin from "./app/builtin/mod.ts";

export function main(denops: Denops): Promise<void> {
  const app: App = new AppImpl({
    denops: denops,
    icedon: new core.IcedonImpl(new core.ConnectionManagerImpl()),
  });

  denops.dispatcher = {
    initialize() {
      console.log("kiteruyo");
      // register built-in plugins
      for (const p of builtin.apiPlugins) {
        app.plugin.registerApiPlugin(app, p);
      }
      for (const p of builtin.interceptorPlugins) {
        app.plugin.registerInterceptorPlugin(app, p);
      }
      app.plugin.sortInterceptors();

      return Promise.resolve();
    },

    async dispatchApi(apiName, args) {
      unknownutil.assertString(apiName);
      unknownutil.assertArray(args);
      const api = app.plugin.apiMap[apiName];
      if (api === undefined) {
        return;
      }

      return await api.run(app, args);
    },
  };

  const n = denops.name;
  denops.dispatch(n, "initialize", []);

  return Promise.resolve();
}