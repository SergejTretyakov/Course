import _ from 'lodash';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { toClientMe } from '../../../lib/models';

export const getMeTrpcRoute = trpcLoggedProcedure.query(({ ctx }) => {
  return { me: toClientMe(ctx.me) };
});
