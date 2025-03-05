import { zUpdateProfileTrpcInput } from '@projects/backend/src/router/auth/updateProfile/input';
import { useForm } from '../../../lib/form';
import { withPageWrapper } from '../../../lib/pageWrapper';
import { trpc } from '../../../lib/trpc';
import { FormItems } from '../../../components/FormItems';
import { Input } from '../../../components/Input';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import { type TrpcRouterOutput } from '@projects/backend/src/router';
import { zUpdatePasswordTrpcInput } from '@projects/backend/src/router/auth/updatePassword/input';
import { zPasswordsMustBeTheSame, zStringRequired } from '@projects/shared/src/zod';

const General = ({ me }: { me: NonNullable<TrpcRouterOutput['getMe']['me']> }) => {
  // изменение ника
  const trpcUtils = trpc.useContext();
  const updateProfile = trpc.updateProfile.useMutation();
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: me.nick,
    },
    validationSchema: zUpdateProfileTrpcInput,
    onSubmit: async (values) => {
      const updatedMe = await updateProfile.mutateAsync(values);
      trpcUtils.getMe.setData(undefined, { me: updatedMe });
    },
    successMessage: 'Никнейм успешно изменен.',
    resetOnSuccess: false,
  });
  return (
    <div className="">
      <h3>Изменение никнейма</h3>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Никнейм" type="text" name="nick" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Изменить</Button>
        </FormItems>
      </form>
    </div>
  );
};

const Password = () => {
  // изменение ника
  const updatePassword = trpc.updatePassword.useMutation();
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      passwordAgain: '',
    },
    validationSchema: zUpdatePasswordTrpcInput
    .extend({
      passwordAgain: zStringRequired,
    })
    .superRefine(zPasswordsMustBeTheSame('newPassword', 'repeatPassword')),
    onSubmit: async ({ oldPassword, newPassword }) => {
      await updatePassword.mutateAsync({ oldPassword, newPassword });
    },
    successMessage: 'Пароль успешно изменен.',
    resetOnSuccess: false,
  });
  return (
    <div className="">
      <h3>Изменение пароля</h3>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Пароль" type="password" name="oldPassword" formik={formik} />
          <Input label="Новый пароль" type="password" name="newPassword" formik={formik} />
          <Input label="Повторите новый пароль" type="password" name="passwordAgain" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Изменить</Button>
        </FormItems>
      </form>
    </div>
  );
};

export const UpdateProfilePage = withPageWrapper({
  authorizedOnly: true,
  title: 'Изменение профиля',
  setProps: ({ getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
  }),
})(({ me }) => {
  return (
    <div className="">
      <h1>Изменение профиля</h1>
      <General me={me} />
      <Password />
    </div>
  );
});
