import { useContext, useState } from 'react';
import { UserContext } from '../../context';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axios from 'axios';
import UserRoute from '../../components/routes/UserRoute';
import CreatePostForm from '../../components/forms/CreatePostForm';

const Home = () => {
  const [state, setState] = useContext(UserContext);

  const [content, setContent] = useState('');
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  //router
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log(input);
    console.log(content);

    try {
      const { data } = await axios.post('/create-post', {
        content,
        image
      });
      // console.log('create post response', data);
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success('Post created');
        setContent('');
        setImage({});
      }
    } catch (error) {
      console.log(error);
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
  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row py-5  text-light bg-default-image">
          <div className="col text-center">
            <h1>Newsfeed</h1>
          </div>
        </div>

        <div className="row py-3">
          <div className="col-md-8">
            <CreatePostForm
              onSubmit={onSubmit}
              content={content}
              setContent={setContent}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
          </div>
          <div className="col-md-4">Sidebar</div>
        </div>
      </div>
    </UserRoute>
  );
};

export default Home;
