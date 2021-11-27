import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../context';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Avatar } from 'antd';
import AuthForm from '../../../components/forms/AuthForm';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';

const ProfileUpdate = () => {
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
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  const onSubmit = async (input) => {
    console.log(input);

    try {
      setLoading(true);
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/profile-update`, {
        username: input.username,
        about: input.about,
        name: input.name,
        email: input.email,
        password: input.password,
        secret: input.secret,
        image
      });
      console.log('update response', data);

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        //update localstorage update user keep token
        let auth = JSON.parse(localStorage.getItem('auth'));
        auth.user = data;
        localStorage.setItem('auth', JSON.stringify(auth));
        //update context
        setState({
          ...state,
          user: data
        });
        setOk(true);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data);
      setLoading(false);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append('image', file);
    console.log([...formData]);
    setUploading(true);
    try {
      const { data } = await axios.post('/upload-image', formData);
      // console.log('create post response', data);
      setImage({
        url: data.url,
        public_id: data.public_id
      });
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  useEffect(() => {
    if (state && state.token) {
      setValue('name', state.user.name);
      setValue('email', state.user.email);
      setValue('username', state.user.username);
      setValue('about', state.user.about);
      setImage({
        url: state.user.image.url,
        public_id: state.user.image.public_id
      });
    }
  }, [state && state.user]);

  return (
    <div className='container-fluid'>
      <div className='row py-5  text-light bg-default-image'>
        <div className='col text-center'>
          <h1>Profile</h1>
        </div>
      </div>

      <div className='row py-5'>
        <div className='col-md-6 offset-md-3'>
          {/* upload image */}
          <label className='d-flex justify-content-center h5'>
            {image && image.url ? (
              <Avatar size={30} src={image.url} className='mt-1' />
            ) : uploading ? (
              <LoadingOutlined className='mt-2' />
            ) : (
              <CameraOutlined className='mt-2' />
            )}
            <input type='file' accept='images/*' hidden onChange={handleImage} />
          </label>
          <AuthForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            isDirty={isDirty}
            isValid={isValid}
            setLoading={setLoading}
            loading={loading}
            ok={ok}
            page='profile'
          />
        </div>
      </div>
      <div className='row'>
        <div className='col'>
          <Modal title='Congratulations!' visible={ok} onCancel={() => setOk(false)} footer={null}>
            <p>You have succesfully updated your profile.</p>
          </Modal>
        </div>
      </div>
      <div className='row'>
        <div className='col'>
          <p className='text-center'>
            Already registered ?{' '}
            <Link href='/login'>
              <a>Login</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
