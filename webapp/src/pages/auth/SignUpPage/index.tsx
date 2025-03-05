import { zSignUpTrpcInput } from '@projects/backend/src/router/auth/signUp/input';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import { FormItems } from '../../../components/FormItems';
import { Input } from '../../../components/Input';
import { trpc } from '../../../lib/trpc';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getAllGalleryRoute } from '../../../lib/routes';
import { useForm } from '../../../lib/form';
import { withPageWrapper } from '../../../lib/pageWrapper';
import { zPasswordsMustBeTheSame, zStringRequired } from '@projects/shared/src/zod';

export const SignUpPage = withPageWrapper({
  redirectAuthorized: true,
  title: 'Зарегистрироваться',
})(() => {
  const navigate = useNavigate();
  const trpcUtils = trpc.useContext();
  const signUp = trpc.signUp.useMutation();
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      email: '',
      password: '',
      passwordAgain: '',
    },
    validationSchema: zSignUpTrpcInput
      .extend({
        passwordAgain: zStringRequired,
      })
      .superRefine(zPasswordsMustBeTheSame('password', 'passwordAgain')),
    onSubmit: async (values) => {
      const { token } = await signUp.mutateAsync(values);
      Cookies.set('token', token, { expires: 99999 });
      void trpcUtils.invalidate();
      navigate(getAllGalleryRoute());
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Никнейм" name="nick" type="text" formik={formik} />
          <Input label="Email" name="email" type="text" formik={formik} />
          <Input label="Пароль" name="password" type="password" formik={formik} />
          <Input label="Подтверждение пароля" name="passwordAgain" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Зарегистрироваться</Button>
        </FormItems>
      </form>
    </div>
  );
});
