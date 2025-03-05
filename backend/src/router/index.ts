import { createTrpcRouter } from '../lib/trpc';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';

// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getMeTrpcRoute } from './auth/getMe'
import { signInTrpcRoute } from './auth/signIn'
import { signUpTrpcRoute } from './auth/signUp'
import { updatePasswordTrpcRoute } from './auth/updatePassword'
import { updateProfileTrpcRoute } from './auth/updateProfile'
import { blockPinTrpcRoute } from './pins/blockPin'
import { createPinTrpcRoute } from './pins/createPin'
import { getGalleryTrpcRoute } from './pins/getGallery'
import { getPinTrpcRoute } from './pins/getPin'
import { setPinLikeTrpcRoute } from './pins/setPinLike'
import { updatePinTrpcRoute } from './pins/updatePin'
// @endindex

export const trpcRouter = createTrpcRouter({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  getMe: getMeTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  updatePassword: updatePasswordTrpcRoute,
  updateProfile: updateProfileTrpcRoute,
  blockPin: blockPinTrpcRoute,
  createPin: createPinTrpcRoute,
  getGallery: getGalleryTrpcRoute,
  getPin: getPinTrpcRoute,
  setPinLike: setPinLikeTrpcRoute,
  updatePin: updatePinTrpcRoute,
  // @endindex
});

export type TrpcRouter = typeof trpcRouter;
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>;
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>;
