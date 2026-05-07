import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useActionState } from 'react';
import { schemaLogin, type LoginFormValues } from '../../models/login.model';
import type { ActionState } from '../../interfaces';
import { createInitialState, handleZodErros } from '../../helpers';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert, useAuth, useAxios } from '../../hooks';

export type LoginActionState = ActionState<LoginFormValues>;

const initialState = createInitialState<LoginFormValues>();

export const LoginPage = () => {
  const { showAlert } = useAlert();
  const { login } = useAuth();
  const axios = useAxios();
  const navigate = useNavigate();

  const loginApi = async (
    _: LoginActionState | undefined,
    formData: FormData,
  ): Promise<LoginActionState | undefined> => {
    const rawData: LoginFormValues = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };

    try {
      schemaLogin.parse(rawData);

      const response = await axios.post('login', rawData);

      console.log('LOGIN RESPONSE:', response.data);

      // OBTENER TOKEN
      const token =
        response?.data?.token ||
        response?.data?.accessToken ||
        response?.data?.data?.token;

      // OBTENER USUARIO
      const user =
        response?.data?.user || {
          username: rawData.username,
        };

      if (!token) {
        throw new Error('Token no existe');
      }

      // GUARDAR LOGIN
      login(token, user);

      showAlert('Bienvenido', 'success');

      navigate('/tasks');
    } catch (error) {
      const err = handleZodErros<LoginFormValues>(error, rawData);

      console.log('error', err);

      showAlert(err.message, 'error');

      return err;
    }
  };

  const [state, submitAction, isPending] = useActionState(
    loginApi,
    initialState,
  );

  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: '#242424',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 'sm',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography component={'h1'} variant="h4" gutterBottom>
            LOGIN
          </Typography>

          <Typography variant="body2" sx={{ mb: 3 }}>
            Proyecto Diplomado para REACT
          </Typography>
          <Typography variant="body2" sx={{ mb: 4 }}>
            JUAN JOSE CALLAHUARA CONDORI
          </Typography>

          <Box component={'form'} action={submitAction} sx={{ width: '100%' }}>
            <TextField
              label="Username"
              name="username"
              type="text"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              disabled={isPending}
              defaultValue={state?.formData?.username}
              error={!!state?.errors.username}
              helperText={state?.errors.username}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              disabled={isPending}
              defaultValue={state?.formData?.password}
              error={!!state?.errors.password}
              helperText={state?.errors.password}
            />

            <Button
              type="submit"
              disabled={isPending}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 48 }}
              startIcon={
                isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isPending ? 'Ingresando...' : 'Ingresar'}
            </Button>

            <Link to={'/user'}>
              Registrar nuevo usuario
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};