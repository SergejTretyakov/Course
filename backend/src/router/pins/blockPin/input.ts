import { z } from 'zod';
import { zStringRequired } from '@projects/shared/src/zod';

export const zBlockPinTrpcInput = z.object({
  pinId: zStringRequired,
});
