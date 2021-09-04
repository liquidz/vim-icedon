import {
  BaseInterceptor,
  InterceptorContext,
  InterceptorType,
} from "../types.ts";
import { Denops, nrepl } from "../deps.ts";
import * as vimBufInfo from "../vim/buffer/info.ts";

async function appendToBuf(
  denops: Denops,
  x: nrepl.bencode.Bencode,
): Promise<void> {
  if (typeof x === "string") {
    vimBufInfo.appendLines(denops, x.split(/\r?\n/));
  }
}

export class ReadInterceptor extends BaseInterceptor {
  readonly type: InterceptorType = "read";
  readonly name: string = "diced nrepl reade";

  async leave(ctx: InterceptorContext): Promise<InterceptorContext> {
    if (ctx.response == null) return ctx;

    const res = ctx.response.params["response"] as nrepl.NreplResponse;
    const isVerbose = (res.context["verbose"] !== "false");

    if (isVerbose) {
      const denops = ctx.request.diced.denops;
      appendToBuf(denops, res.getFirst("out"));
      appendToBuf(denops, res.getFirst("err"));
      appendToBuf(denops, res.getFirst("pprint-out"));
    }

    return ctx;
  }
}
