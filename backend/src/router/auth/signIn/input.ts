import { z } from 'zod';
import { zStringRequired } from '@projects/shared/src/zod';

export const zSignInTrpcInput = z.object({
  nick: zStringRequired,
  password: zStringRequired,
});
