import { trpcLoggedProcedure } from '../../../lib/trpc';
import { zCreatePinTrpcInput } from './input';

export const createPinTrpcRoute = trpcLoggedProcedure.input(zCreatePinTrpcInput).mutation(async ({ input, ctx }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED');
  }
  const exPin = await ctx.prisma.pin.findUnique({
    where: {
      title: input.title,
    },
  });
  if (exPin) {
    throw Error('Пин с таким названием уже существует');
  } else {
    await ctx.prisma.pin.create({
      data: { ...input, authorId: ctx.me.id },
    });
  }
  return true;
});
