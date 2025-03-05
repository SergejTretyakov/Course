import css from './index.module.scss';
import { Input } from '../../../components/Input';
import { Textarea } from '../../../components/Textarea';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import { FormItems } from '../../../components/FormItems';
import { trpc } from '../../../lib/trpc';
import { zCreatePinTrpcInput } from '@projects/backend/src/router/pins/createPin/input';
import { useForm } from '../../../lib/form';
import { withPageWrapper } from '../../../lib/pageWrapper';

export const CreatePinPage = withPageWrapper({
  authorizedOnly: true,
  title: 'Создать пин',
})(() => {
  const createPin = trpc.createPin.useMutation();
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      title: '',
      description: '',
      image: '',
    },
    validationSchema: zCreatePinTrpcInput,
    onSubmit: async (values) => {
      await createPin.mutateAsync(values);
      formik.resetForm();
    },
    successMessage: 'Пин опубликован!',
    showValidationAlert: true,
  });

  return (
    <div>
      <h1 className={css.title}>Create New Pin</h1>
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
          <Button {...buttonProps}>Опубликовать</Button>
        </FormItems>
      </form>
    </div>
  );
});
