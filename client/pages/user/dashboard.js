import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import axios from 'axios';
import UserRoute from '../../components/routes/UserRoute';
import PostList from '../../components/cards/PostList';
import PostForm from '../../components/forms/PostForm';
import People from '../../components/cards/People';

const Home = () => {
  const [state, setState] = useContext(UserContext);

  const [content, setContent] = useState('');
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);

  //router
  const router = useRouter();

  useEffect(() => {
    //
    if (state && state.token) {
      newsFeed();
      findPeople();
    }
  }, [state && state.token]);

  const newsFeed = async () => {
    try {
      const { data } = await axios.get('/news-feed');
      // console.log('User post => ', data);
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const findPeople = async () => {
    try {
      const { data } = await axios.get('/find-people');
      setPeople(data);
    } catch (error) {
      console.log(error);
    }
  };

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
        newsFeed();
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

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm('Are you sure ?');
      if (!answer) return;
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.error('Post deleted');
      newsFeed();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async (user) => {
    // console.log('add this user to following', user);
    try {
      const { data } = await axios.put('/user-follow', {
        _id: user._id
      });
      //update local storage updaet user keep the token
      let auth = JSON.parse(localStorage.getItem('auth'));
      auth.user = data;
      localStorage.setItem('auth', JSON.stringify(auth));
      setState({
        ...state,
        user: data
      });

      //update people list
      newsFeed();
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      //re render the post for feed
      toast.success(`Following ${user.name}`);
      console.log('handle follow response', data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (_id) => {
    try {
      const { data } = await axios.put('/like-post', {
        _id
      });
      newsFeed();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnlike = async (_id) => {
    // console.log('Unlike this post => ', _id);
    try {
      const { data } = await axios.put('/unlike-post', {
        _id
      });
      newsFeed();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <UserRoute>
      <div className='container-fluid'>
        <div className='row py-5  text-light bg-default-image'>
          <div className='col text-center'>
            <h1>Newsfeed</h1>
          </div>
        </div>

        <div className='row py-3'>
          <div className='col-md-8'>
            <PostForm
              onSubmit={onSubmit}
              content={content}
              setContent={setContent}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
            <br />
            <PostList
              posts={posts}
              handleDelete={handleDelete}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
            />
          </div>
          <div className='col-md-4'>
            {state && state.user && state.user.following && (
              <Link href={`/user/following`}>
                <a className='h6'>{state.user.following.length} Following</a>
              </Link>
            )}
            <People people={people} handleFollow={handleFollow} />
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default Home;
