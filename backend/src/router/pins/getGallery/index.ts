import { trpcLoggedProcedure } from '../../../lib/trpc';
import _ from 'lodash';
import { zGetGalleryTrpcInput } from './input';

export const getGalleryTrpcRoute = trpcLoggedProcedure.input(zGetGalleryTrpcInput).query(async ({ ctx, input }) => {
  const gallery = await ctx.prisma.pin.findMany({
    select: {
      id: true,
      image: true,
      serialNumber: true,
    },
    where: {
      blockedAt: null,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        serialNumber: 'desc',
      },
    ],
    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  });
  const nextPin = gallery.at(input.limit);
  const nextCursor = nextPin?.serialNumber;
  const pinsExceptNext = gallery.slice(0, input.limit);
  return { gallery: pinsExceptNext, nextCursor };
});
