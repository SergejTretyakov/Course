import { Alert } from '../Alert';

export const ErrorPageComponent = ({
  title = 'Ошибка',
  message = 'Что-то пошло не так',
}: {
  title?: string;
  message?: string;
}) => {
  return (
    <>
      <h1>{title}</h1>
      <Alert color="red">{message}</Alert>
    </>
  );
};
