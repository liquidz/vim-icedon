import {
  BaseInterceptor,
  BasePlugin,
  InterceptorContext,
} from "../../types.ts";
import { nrepl, unknownutil } from "../../deps.ts";

import * as strPath from "../../std/string/path.ts";
import * as dicedInterceptor from "../../std/diced/interceptor.ts";

class NormalizeNsPathInterceptor extends BaseInterceptor {
  readonly type: string = "ns-path";
  readonly name: string = "ns-path normalize";

  leave(ctx: InterceptorContext): Promise<InterceptorContext> {
    if (ctx.response == null) return Promise.resolve(ctx);

    const done = ctx.response.params["response"] as nrepl.NreplDoneResponse;

    ctx.response.params["response"] = dicedInterceptor.updateDoneResponse(
      done,
      "path",
      (path) => {
        if (!unknownutil.isString(path)) return path;
        return strPath.normalize(path);
      },
    );

    return Promise.resolve(ctx);
  }
}

export class Plugin extends BasePlugin {
  readonly interceptors = [
    new NormalizeNsPathInterceptor(),
  ];
}