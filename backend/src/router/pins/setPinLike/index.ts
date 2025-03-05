import { trpcLoggedProcedure } from '../../../lib/trpc';
import { zSetPinLikeIdeaTrpcInput } from './input';

export const setPinLikeTrpcRoute = trpcLoggedProcedure.input(zSetPinLikeIdeaTrpcInput).mutation(async ({ ctx, input }) => {
  const { pinId, isLikedByMe } = input;
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED');
  }
  const pin = await ctx.prisma.pin.findUnique({
    where: {
      id: pinId,
    },
  });
  if (!pin) {
    throw new Error('NOT_FOUND');
  }
  if (isLikedByMe) {
    await ctx.prisma.pinLike.upsert({
      where: {
        pinId_userId: {
          pinId,
          userId: ctx.me.id,
        },
      },
      create: {
        userId: ctx.me.id,
        pinId,
      },
      update: {},
    });
  } else {
    await ctx.prisma.pinLike.delete({
      where: {
        pinId_userId: {
          pinId,
          userId: ctx.me.id,
        },
      },
    });
  }
  const likesCount = await ctx.prisma.pinLike.count({
    where: {
      pinId,
    },
  });
  return {
    pin: {
      id: pin.id,
      likesCount,
      isLikedByMe,
    },
  };
});
