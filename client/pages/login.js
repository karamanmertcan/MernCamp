import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthForm from '../components/forms/AuthForm';
import { UserContext } from '../context';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
    setValue
  } = useForm({
    mode: 'onChange'
  });

  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  const onSubmit = async (input) => {
    console.log(input);

    try {
      setLoading(true);
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/login`, {
        email: input.email,
        password: input.password
      });
      //update context
      setState({
        user: data.user,
        token: data.token
      });
      // save a local storage
      window.localStorage.setItem('auth', JSON.stringify(data));
      router.push('/');
    } catch (error) {
      toast.error(error.response.data);
      setLoading(false);
    }
  };

  if (state && state.token) router.push('/');
  return (
    <div className="container-fluid">
      <div className="row py-5  text-light bg-default-image">
        <div className="col text-center">
          <h1>Login</h1>
        </div>
      </div>

      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            isDirty={isDirty}
            isValid={isValid}
            setLoading={setLoading}
            loading={loading}
            page="login"
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <p className="text-center">
            Not yet registered ?{' '}
            <Link href="/register">
              <a>Register</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
