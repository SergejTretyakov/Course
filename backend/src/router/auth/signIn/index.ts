import { zSignInTrpcInput } from './input';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { getPasswordHash } from '../../../utils/getPasswordHash';
import { signJWT } from '../../../utils/signJWT';

export const signInTrpcRoute = trpcLoggedProcedure.input(zSignInTrpcInput).mutation(async ({ ctx, input }) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      nick: input.nick,
      password: getPasswordHash(input.password),
    },
  });
  if (!user) {
    throw new Error('Неверное имя или пароль');
  }
  const token = signJWT(user.id);
  return { token };
});
