import type { Pin, User, UserPermission } from '@prisma/client';

type MaybeUser = Pick<User, 'permissions' | 'id'> | null;
type MaybeIdea = Pick<Pin, 'authorId'> | null;

const hasPermission = (user: MaybeUser, permission: UserPermission) => {
  return user?.permissions.includes(permission) || user?.permissions.includes('ALL') || false;
};

export const canBlockPins = (user: MaybeUser) => {
  return hasPermission(user, 'BLOCK_IDEAS');
};

export const canEditPin = (user: MaybeUser, idea: MaybeIdea) => {
  return !!user && !!idea && user?.id === idea?.authorId;
};
