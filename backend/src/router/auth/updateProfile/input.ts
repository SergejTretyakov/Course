import { z } from 'zod';
import { zNickRequired } from '@projects/shared/src/zod';

export const zUpdateProfileTrpcInput = z.object({
  nick: zNickRequired,
});
