import { zSignInTrpcInput } from '@projects/backend/src/router/auth/signIn/input';
import { trpc } from '../../../lib/trpc';
import { FormItems } from '../../../components/FormItems';
import { Input } from '../../../components/Input';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getAllGalleryRoute } from '../../../lib/routes';
import { useForm } from '../../../lib/form';
import { withPageWrapper } from '../../../lib/pageWrapper';

export const SignInPage = withPageWrapper({
  redirectAuthorized: true,
  title: 'Войти',
})(() => {
  const navigate = useNavigate();
  const trpcUtils = trpc.useContext();
  const signIn = trpc.signIn.useMutation();
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      password: '',
    },
    validationSchema: zSignInTrpcInput,
    onSubmit: async (values) => {
      const { token } = await signIn.mutateAsync(values);
      Cookies.set('token', token, { expires: 99999 });
      void trpcUtils.invalidate();
      navigate(getAllGalleryRoute());
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Логин" name="nick" type="text" formik={formik} />
          <Input label="Пароль" name="password" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Войти</Button>
        </FormItems>
      </form>
    </div>
  );
});
