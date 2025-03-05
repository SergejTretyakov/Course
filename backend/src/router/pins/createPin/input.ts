import { z } from 'zod';
import { zStringRequired } from '@projects/shared/src/zod';

export const zCreatePinTrpcInput = z.object({
  title: zStringRequired,
  description: zStringRequired,
  image: zStringRequired,
});
