import { useState } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '../../../app/routes';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/ui/TextField';
import { useAuth } from '../authContext';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordChecklist } from '../components/PasswordChecklist';
import { PasswordField } from '../components/PasswordField';
import { useAuthForm } from '../hooks/useAuthForm';
import { AuthError } from '../services/authService';
import { registerSchema } from '../validation';
import styles from './AuthForm.module.css';

export function RegisterPage() {
  const { register } = useAuth();
  const form = useAuthForm(registerSchema, {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await register(data);
      // Al tener sesión, la ruta redirige sola al panel.
    } catch (error) {
      setFormError(
        error instanceof AuthError
          ? error.message
          : 'No se pudo crear la cuenta. Intenta de nuevo.',
      );
      setIsSubmitting(false);
    }
  });

  return (
    <AuthLayout isSubmitting={isSubmitting} fieldsProgress={form.progress}>
      <header className={styles.header}>
        <h1 className={styles.title}>Crea tu cuenta</h1>
        <p className={styles.subtitle}>Empiezas con $0 de saldo y recargas cuando quieras.</p>
      </header>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {formError && (
          <p role="alert" className={styles.formError}>
            {formError}
          </p>
        )}
        <TextField label="Nombre completo" autoComplete="name" {...form.fieldProps('fullName')} />
        <TextField
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          inputMode="email"
          {...form.fieldProps('email')}
        />
        <PasswordField
          label="Contraseña"
          autoComplete="new-password"
          hint={<PasswordChecklist password={form.values.password} />}
          {...form.fieldProps('password')}
        />
        <PasswordField
          label="Confirma tu contraseña"
          autoComplete="new-password"
          {...form.fieldProps('confirmPassword')}
        />
        <Button
          type="submit"
          className={styles.submit}
          isLoading={isSubmitting}
          loadingText="Creando cuenta…"
        >
          Crear cuenta
        </Button>
      </form>

      <p className={styles.switch}>
        ¿Ya tienes cuenta? <Link to={ROUTES.login}>Inicia sesión</Link>
      </p>
    </AuthLayout>
  );
}
