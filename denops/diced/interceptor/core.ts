import {
  BaseInterceptor,
  Diced,
  InterceptorParams,
  InterceptorType,
  Params,
} from "../types.ts";
import { interceptor } from "../deps.ts";

export function addInterceptor(diced: Diced, interceptor: BaseInterceptor) {
  if (diced.interceptors[interceptor.type] == null) {
    diced.interceptors[interceptor.type] = [interceptor];
  }
  (diced.interceptors[interceptor.type] || []).push(interceptor);
}

export function removeInterceptor(diced: Diced, interceptor: BaseInterceptor) {
  const interceptors = diced.interceptors[interceptor.type];
  if (interceptors == null) {
    return;
  }

  diced.interceptors[interceptor.type] = interceptors.filter((i) => {
    i.name !== interceptor.name;
  });
}

export async function execute(
  diced: Diced,
  interceptorType: InterceptorType,
  params: Params,
  handler: interceptor.Handler<InterceptorParams>,
): Promise<Params> {
  const interceptors = [
    ...(diced.interceptors[interceptorType] || []),
    handler,
  ];
  const context: InterceptorParams = { diced: diced, params: params };
  const res = await interceptor.execute(interceptors, context);
  return res.params;
}
