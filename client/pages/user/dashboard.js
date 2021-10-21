import { useContext, useState } from 'react';
import { UserContext } from '../../context';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axios from 'axios';
import UserRoute from '../../components/routes/UserRoute';
import CreatePostForm from '../../components/forms/CreatePostForm';

const Home = () => {
  const [content, setContent] = useState('');
  const [state, setState] = useContext(UserContext);

  //router
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log(input);
    console.log(content);

    try {
      const { data } = await axios.post('/create-post', {
        content
      });
      // console.log('create post response', data);

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success('Post created');
        setContent('');
      }
    } catch (error) {
      console.log(error);
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
            <CreatePostForm onSubmit={onSubmit} content={content} setContent={setContent} />
          </div>
          <div className="col-md-4">Sidebar</div>
        </div>
      </div>
    </UserRoute>
  );
};

export default Home;
