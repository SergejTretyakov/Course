import { trpcLoggedProcedure } from '../../../lib/trpc';
import { canBlockPins } from '../../../utils/can';
import { zBlockPinTrpcInput } from './input';
//import { sendPinBlockedEmail } from '../../../lib/emails';

export const blockPinTrpcRoute = trpcLoggedProcedure.input(zBlockPinTrpcInput).mutation(async ({ ctx, input }) => {
  const { pinId } = input;
  if (!canBlockPins(ctx.me)) {
    throw new Error('PERMISSION_DENIED');
  }
  const pin = await ctx.prisma.pin.findUnique({
    where: {
      id: pinId,
    },
    include: {
      author: true,
    },
  });
  if (!pin) {
    throw new Error('NOT_FOUND');
  }
  await ctx.prisma.pin.update({
    where: {
      id: pinId,
    },
    data: {
      blockedAt: new Date(),
    },
  });
  //void sendPinBlockedEmail({ user: pin.author, pin });
  return true;
});
