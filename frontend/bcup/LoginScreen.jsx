import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Swal from 'sweetalert2';
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link as MuiLink,
  CssBaseline
} from '@mui/material';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err?.data?.message || err.error || 'An error occurred during login',
      });
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box sx={{ 
          p: 6, 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          boxShadow: 3 
        }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Sign In
          </Typography>
          
          <Box component="form" onSubmit={submitHandler} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              New Customer?{' '}
              <MuiLink component={Link} to="/register" sx={{ cursor: 'pointer' }}>
                Register
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default LoginScreen;