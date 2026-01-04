import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Swal from 'sweetalert2';
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

   const dispatch = useDispatch();
   const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match',
      });
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate('/');
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.data?.message || err.error,
        });
      }
    }
  };

  return (
    <Container maxWidth="sm" className="mt-8">
      <Box className="p-6 bg-white rounded-lg shadow-md">
        <Typography variant="h4" component="h1" className="mb-6 text-center">
          Register
        </Typography>
        
        <Box component="form" onSubmit={submitHandler} className="space-y-4">
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4"
          />
          
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          
          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4"
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="py-2 mt-4"
            disabled={isLoading}
          >
            Register
          </Button>
          
          {isLoading && (
            <Box className="flex justify-center mt-4">
              <CircularProgress />
            </Box>
          )}
        </Box>
        
        <Box className="mt-6 text-center">
          <Typography variant="body2">
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" className="text-blue-600">
              Login
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterScreen;