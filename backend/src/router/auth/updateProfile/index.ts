import { toClientMe } from '../../../lib/models';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { zUpdateProfileTrpcInput } from './input';

export const updateProfileTrpcRoute = trpcLoggedProcedure.input(zUpdateProfileTrpcInput).mutation(async ({ ctx, input }) => {
  //обработка неавторизованного пользователя
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED');
  }
  //проверка на существование ника пользователя
  if (ctx.me.nick != input.nick) {
    const exUserNick = await ctx.prisma.user.findUnique({ where: { nick: input.nick } });
    if (exUserNick) {
      throw new Error('Никнейм уже занят');
    }
  }
  //изменение ника
  const updatedMe = await ctx.prisma.user.update({
    where: { id: ctx.me.id },
    data: input,
  });
  ctx.me = updatedMe;
  return toClientMe(updatedMe);
});
