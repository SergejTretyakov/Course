import { trpcLoggedProcedure } from '../../../lib/trpc';
import _ from 'lodash';
import { zGetGalleryTrpcInput } from './input';

export const getPinTrpcRoute = trpcLoggedProcedure
  .input(
    zGetGalleryTrpcInput
  )
  .query(async ({ ctx, input }) => {
    const rawPin = await ctx.prisma.pin.findUnique({
      where: {
        id: input.pinID,
      },
      include: {
        author: {
          select: {
            id: true,
            nick: true,
          },
        },
        pinsLikes: {
          select: {
            id: true,
          },
          where: {
            userId: ctx.me?.id,
          },
        },
        _count: {
          select: {
            pinsLikes: true,
          },
        },
      },
    });
    if (rawPin?.blockedAt) {
      throw new Error('Пин заблокирован администратором');
    }
    const isLikedByMe = !!rawPin?.pinsLikes.length;
    const likesCount = rawPin?._count.pinsLikes || 0;
    const pin = rawPin && { ..._.omit(rawPin, ['pinsLikes', '_count']), isLikedByMe, likesCount };
    return { pin: pin || null };
    // const pin = gallery.find((pin) => pin.pinID === input.pinID);
  });
