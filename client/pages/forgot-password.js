import { useState, useContext } from 'react';
import { UserContext } from '../context';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal } from 'antd';
import AuthForm from '../components/forms/AuthForm';
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';

const ForgotPassword = () => {
  const [ok, setOk] = useState(false);
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
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/forgot-password`, {
        email: input.email,
        newPassword: input.newPassword,
        secret: input.secret
      });
      console.log('Forgotpassword response data => ', data);

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      }

      if (data.success) {
        setValue('email', '');
        setValue('newPassword', '');
        setValue('secret', '');
        setOk(true);
        setLoading(false);
      }
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
          <h1>Forgot Password</h1>
        </div>
      </div>

      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <ForgotPasswordForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            isDirty={isDirty}
            isValid={isValid}
            setLoading={setLoading}
            loading={loading}
            ok={ok}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Modal title="Congratulations!" visible={ok} onCancel={() => setOk(false)} footer={null}>
            <p>Congrats ! You can login with your new password.</p>
            <Link href="/login">
              <a className="btn btn-primary btn-sm">Login</a>
            </Link>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
