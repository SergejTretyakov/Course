
import { getUpdatePinRoute, getViewPinRoute } from '../../../lib/routes';
import { trpc } from '../../../lib/trpc';
import css from './index.module.scss';
import { format } from 'date-fns';
import { Button, LinkButton } from '../../../components/Button';
import { withPageWrapper } from '../../../lib/pageWrapper';
import { type TrpcRouterOutput } from '@projects/backend/src/router';
import { canBlockPins, canEditPin } from '@projects/backend/src/utils/can';
import { useForm } from '../../../lib/form';
import { FormItems } from '../../../components/FormItems';
import { Alert } from '../../../components/Alert';
import { Icon } from '../../../components/Icon';

const LikeButton = ({ pin }: { pin: NonNullable<TrpcRouterOutput['getPin']['pin']> }) => {
  const trpcUtils = trpc.useContext();
  const setPinLike = trpc.setPinLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetPinData = trpcUtils.getPin.getData({ pinID: pin.id });
      if (oldGetPinData?.pin) {
        const newGetPinData = {
          ...oldGetPinData,
          pin: {
            ...oldGetPinData.pin,
            isLikedByMe,
            likesCount: oldGetPinData.pin.likesCount + (isLikedByMe ? 1 : -1),
          },
        };
        trpcUtils.getPin.setData({ pinID: pin.id }, newGetPinData);
      }
    },
    onSuccess: () => {
      void trpcUtils.getPin.invalidate({ pinID: pin.id });
    },
  });
  return (
    <button
      className={css.likeButton}
      onClick={() => {
        void setPinLike.mutateAsync({ pinId: pin.id, isLikedByMe: !pin.isLikedByMe });
      }}
    >
      <Icon size={32} className={css.likeIcon} name={pin.isLikedByMe ? 'likeFilled' : 'likeEmpty'} />
    </button>
  );
};

const BlockPin = ({ pin }: { pin: NonNullable<TrpcRouterOutput['getPin']['pin']> }) => {
  const blockpin = trpc.blockPin.useMutation();
  const trpcUtils = trpc.useContext();
  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await blockpin.mutateAsync({ pinId: pin.id });
      await trpcUtils.getPin.refetch({ pinID: pin.id });
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="red" {...buttonProps}>
          Block pin
        </Button>
      </FormItems>
    </form>
  );
};

export const ViewPinPage = withPageWrapper({
  useQuery: () => {
    const { pinID } = getViewPinRoute.useParams();
    return trpc.getPin.useQuery({
      pinID,
    });
  },

  setProps: ({ queryResult, checkExists, ctx }) => ({
    pin: checkExists(queryResult.data.pin, 'Pin not found'),
    me: ctx.me,
  }),
  title: ({ pin }) => pin.title,
  showLoaderOnFetching: false,
})(({ pin, me }) => {
  return (
    <div className={css.pin}>
      <div className={css.image}>
        <img alt="pin-img" src={pin.image}></img>
      </div>
      <div className={css.info}>
        <h1>{pin.title}</h1>
        <h4>Опубликовано: {format(pin.createdAt, 'yyyy-MM-dd')}</h4>
        <p>{pin.description}</p>
        <div className={css.author}>
          <div className={css.avatar}>
            <img alt="ava"></img>
          </div>
          <div className={css.authorInfo}>
            <p>Автор:</p>
            <p>{pin.author.nick}</p>
          </div>
        </div>
        {me && <LikeButton pin={pin} />}
        <h4>Likes: {pin.likesCount}</h4>
        {canEditPin(me, pin) && (
          <div className={css.editButton}>
            <LinkButton to={getUpdatePinRoute({ pinID: pin.id })}>Редактировать</LinkButton>
          </div>
        )}
        {canBlockPins(me) && (
          <div className={css.blockPin}>
            <BlockPin pin={pin} />
          </div>
        )}
      </div>
    </div>
  );
});
