import { unknownutil } from "../../deps.ts";
import { App } from "../../types.ts";
import { request } from "../api.ts";

/**
 * cf ../builtin/info_buffer/mod.ts
 */
export function appendLinesToInfoBuffer(app: App, lines: string[]) {
  return request(app, "icedon_append_to_info_buffer", lines);
}

/**
 * cf ../builtin/paredit/mod.ts
 */
export async function getCurrentTopForm(app: App): Promise<[string, number]> {
  const res = await request(app, "icedon_get_current_top_form", []);
  unknownutil.assertArray(res);
  unknownutil.assertString(res[0]);
  unknownutil.assertNumber(res[1]);
  return [res[0], res[1]];
}