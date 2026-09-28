import { useState } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '../../../app/routes';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/ui/TextField';
import { useAuth } from '../authContext';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordField } from '../components/PasswordField';
import { useAuthForm } from '../hooks/useAuthForm';
import { AuthError } from '../services/authService';
import { loginSchema } from '../validation';
import styles from './AuthForm.module.css';

export function LoginPage() {
  const { login } = useAuth();
  const form = useAuthForm(loginSchema, { email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await login(data);
    } catch (error) {
      // Si falla, el caracol regresa a donde estaba: la pista refleja el resultado.
      setFormError(
        error instanceof AuthError ? error.message : 'No se pudo iniciar sesión. Intenta de nuevo.',
      );
      setIsSubmitting(false);
    }
  });

  return (
    <AuthLayout isSubmitting={isSubmitting} fieldsProgress={form.progress}>
      <header className={styles.header}>
        <h1 className={styles.title}>Inicia sesión</h1>
      </header>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {formError && (
          <p role="alert" className={styles.formError}>
            {formError}
          </p>
        )}
        <TextField
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          inputMode="email"
          {...form.fieldProps('email')}
        />
        <PasswordField
          label="Contraseña"
          autoComplete="current-password"
          {...form.fieldProps('password')}
        />
        <Button
          type="submit"
          className={styles.submit}
          isLoading={isSubmitting}
          loadingText="Entrando…"
        >
          Entrar
        </Button>
      </form>

      <p className={styles.switch}>
        ¿Primera vez aquí? <Link to={ROUTES.register}>Crea tu cuenta</Link>
      </p>
    </AuthLayout>
  );
}
