import { trpcLoggedProcedure } from '../../../lib/trpc';
import { getPasswordHash } from '../../../utils/getPasswordHash';
import { zUpdatePasswordTrpcInput } from './input';

export const updatePasswordTrpcRoute = trpcLoggedProcedure
  .input(zUpdatePasswordTrpcInput)
  .mutation(async ({ ctx, input }) => {
    //обработка неавторизованного пользователя
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED');
    }
    //если действующий пароль не совпадает
    if (ctx.me.password !== getPasswordHash(input.oldPassword)) {
      throw new Error('Неправильный пароль');
    }
    //изменение пароля
    const updatedMe = await ctx.prisma.user.update({
      where: { id: ctx.me.id },
      data: {
        password: getPasswordHash(input.newPassword),
      },
    });
    ctx.me = updatedMe;
    return true;
  });
