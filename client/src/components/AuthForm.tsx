import { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, REGISTER_USER } from '../graphql/mutations';
import { useStore } from '../store';

const initialFormData = {
  username: '',
  email: '',
  password: '',
  errorMessage: ''
};

const AuthForm = ({ isLogin }: { handleModalClose: () => void; isLogin: boolean; }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [showAlert, setShowAlert] = useState(false);
  const [loginUserMutation] = useMutation(LOGIN_USER);
  const [registerUserMutation] = useMutation(REGISTER_USER);
  const { setState } = useStore()!;
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ ...initialFormData });
  }, [isLogin]);

  const store = useStore();
  if (!store) {
    throw new Error('Store is not available');
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const mutation = isLogin ? loginUserMutation : registerUserMutation;
    const prop = isLogin ? 'loginUser' : 'registerUser';

    try {
      const res = await mutation({
        variables: formData
      });

      setState((oldState) => ({
        ...oldState,
        user: res.data[prop].user,
      }));

      setFormData({ ...initialFormData });
      navigate('/');
    } catch (error: any) {
      setFormData({
        ...formData,
        errorMessage: error.message
      });
      setShowAlert(true);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          {formData.errorMessage}
        </Alert>

        {!isLogin && (
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='username'>Username</Form.Label>
            <Form.Control
              type='text'
              placeholder='Your username'
              name='username'
              onChange={handleInputChange}
              value={formData.username || ''}
              required
            />
            <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
          </Form.Group>
        )}

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={formData.email || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={formData.password || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(formData.email && formData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default AuthForm;







