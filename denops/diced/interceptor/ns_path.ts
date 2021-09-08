import { BaseInterceptor, InterceptorContext } from "../types.ts";
import { nrepl, unknownutil } from "../deps.ts";
import * as strPath from "../string/path.ts";
import * as interceptorUtil from "./util.ts";

export class NormalizeNsPathInterceptor extends BaseInterceptor {
  readonly type: string = "ns-path";
  readonly name: string = "ns-path normalize";

  leave(ctx: InterceptorContext): Promise<InterceptorContext> {
    if (ctx.response == null) return Promise.resolve(ctx);

    const done = ctx.response.params["response"] as nrepl.NreplDoneResponse;

    ctx.response.params["response"] = interceptorUtil.updateDoneResponse(
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
