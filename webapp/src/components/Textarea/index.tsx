import { FormikProps } from 'formik';
import css from './index.module.scss';
import cn from 'classnames';

export const Textarea = ({ name, label, formik }: { name: string; label: string; formik: FormikProps<any> }) => {
  const value = formik.values[name];
  const error = formik.errors[name] as string | undefined;
  const touched = formik.touched[name];
  const disabled = formik.isSubmitting;
  const invalid = !!touched && !!error;

  return (
    <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
      <label className={css.label} htmlFor={name}>
        {label}
      </label>
      <textarea
        className={cn({ [css.input]: true, [css.invalid]: invalid })}
        onChange={(e) => {
          void formik.setFieldValue(name, e.target.value);
        }}
        onBlur={() => {
          void formik.setFieldTouched(name);
        }}
        value={value}
        name={name}
        disabled={formik.isSubmitting}
      />
      {invalid && <div className={css.error}>{error}</div>}
    </div>
  );
};
