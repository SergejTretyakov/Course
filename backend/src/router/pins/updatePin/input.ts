import { zCreatePinTrpcInput } from '../createPin/input';
import { zStringRequired } from '@projects/shared/src/zod';

export const zUpdatePinTrpcInput = zCreatePinTrpcInput.extend({
  pinId: zStringRequired,
});
