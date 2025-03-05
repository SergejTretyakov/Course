import css from './index.module.scss';
import { Input } from '../../../components/Input';
import { Textarea } from '../../../components/Textarea';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import { FormItems } from '../../../components/FormItems';
import { trpc } from '../../../lib/trpc';
import { zUpdatePinTrpcInput } from '@projects/backend/src/router/pins/updatePin/input';
import { useNavigate} from 'react-router-dom';
import pick from 'lodash/pick';
import { getViewPinRoute, getUpdatePinRoute } from '../../../lib/routes';
import { useForm } from '../../../lib/form';
import { withPageWrapper } from '../../../lib/pageWrapper';
import { canEditPin } from '@projects/backend/src/utils/can';

export const UpdatePinPage = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { pinID } = getUpdatePinRoute.useParams();
    return trpc.getPin.useQuery({
      pinID,
    });
  },
  setProps: ({ queryResult, ctx, checkExists, checkAccess }) => {
    const pin = checkExists(queryResult.data.pin, 'pin not found');
    checkAccess(canEditPin(ctx.me, pin), 'An pin can only be edited by the author');
    return {
      pin,
    };
  },
  title: ({ pin }) => `Изменить пин ${pin.title}`,
})(({ pin }) => {
  const navigate = useNavigate();
  const updatePin = trpc.updatePin.useMutation();
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: pick(pin, ['id', 'title', 'description', 'image']),
    validationSchema: zUpdatePinTrpcInput.omit({ pinId: true }),
    onSubmit: async (values) => {
      await updatePin.mutateAsync({ pinId: pin.id, ...values });
      navigate(getViewPinRoute({ pinID: pin.id }));
    },
    resetOnSuccess: false,
    showValidationAlert: true,
  });

  return (
    <div>
      <h1 className={css.title}>Редактировать пин</h1>
      <form
        className={css.form}
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <FormItems>
          <Input name="title" label="Название" type="input" formik={formik} />
          <Textarea name="description" label="Описание" formik={formik} />
          <Input name="image" label="Ссылка" type="input" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Редактировать</Button>
        </FormItems>
      </form>
    </div>
  );
});
