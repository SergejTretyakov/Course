import { zStringRequired } from '@projects/shared/src/zod';
import { z } from 'zod';

export const zSetPinLikeIdeaTrpcInput = z.object({
  pinId: zStringRequired,
  isLikedByMe: z.boolean(),
});
