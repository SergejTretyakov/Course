import { pgr } from '../utils/pumpGetRoute';



export const getSignUpRoute = pgr(() => '/sign-up')

export const getSignInRoute = pgr(() => '/sign-in')



export const getSignOutRoute = pgr(() => '/sign-out')



export const getUpdateProfileRoute = pgr(() => '/edit-profile')

export const getAllGalleryRoute = pgr(() => '/')

export const getViewPinRoute = pgr({ pinID: true }, ({ pinID }) => `/ideas/${pinID}`)

export const getUpdatePinRoute = pgr({ pinID: true }, ({ pinID }) => `/ideas/${pinID}/edit`)

export const getCreatePinRoute = pgr(() => '/ideas/new')