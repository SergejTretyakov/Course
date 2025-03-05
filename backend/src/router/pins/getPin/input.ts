import { zStringRequired } from '@projects/shared/src/zod'
import { z } from 'zod'

export const zGetGalleryTrpcInput = z.object({
  pinID: zStringRequired,
})