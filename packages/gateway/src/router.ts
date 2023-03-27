import { initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';
import { Context } from './context';

export const t = initTRPC.meta<OpenApiMeta>().context<Context>().create();
export const Router = t.router;