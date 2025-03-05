import { trpcLoggedProcedure } from '../../../lib/trpc';
import { canEditPin } from '../../../utils/can';
import { zUpdatePinTrpcInput } from './input';

export const updatePinTrpcRoute = trpcLoggedProcedure.input(zUpdatePinTrpcInput).mutation(async ({ ctx, input }) => {
  const { pinId, ...pinInput } = input;
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
  if (canEditPin(ctx.me, pin)) {
    throw new Error('NOT_YOUR_PIN');
  }
  if (pin.title !== input.title) {
    const exPin = await ctx.prisma.pin.findUnique({
      where: {
        title: input.title,
      },
    });
    if (exPin) {
      throw new Error('Pin with this nick already exists');
    }
  }
  await ctx.prisma.pin.update({
    where: {
      id: pinId,
    },
    data: {
      ...pinInput,
    },
  });
  return true;
});
