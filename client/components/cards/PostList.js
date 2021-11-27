import React, { useContext } from 'react';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { Avatar } from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import PostImage from '../images/PostImage';
import { UserContext } from '../../context';
import { useRouter } from 'next/router';
import { imageSource } from '../../functions';

const PostList = ({ posts, handleDelete, handleLike, handleUnlike }) => {
  const [state] = useContext(UserContext);
  const router = useRouter();
  return (
    <div>
      {posts &&
        posts.map((post) => (
          <div key={post._id} className='card mb-5'>
            <div className='card-header'>
              {/* <Avatar size={40}>{post.postedBy.name.charAt(0)}</Avatar>{' '}
               */}
              <Avatar size={40} src={imageSource(post.postedBy)} />
              <span
                className='fw-bold pt-2 ml-3'
                style={{
                  marginLeft: '1rem'
                }}>
                {post.postedBy.name}
              </span>
              <span
                className='fw-bold pt-2 '
                style={{
                  marginLeft: '1rem'
                }}>
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
            <div className='card-body'>{renderHTML(post.content)}</div>
            <div className='card-footer '>
              {post.image && <PostImage url={post.image.url} />}
              <div className='d-flex'>
                {post.likes.includes(state.user._id) ? (
                  <HeartFilled
                    onClick={() => handleUnlike(post._id)}
                    className='text-danger pt-2 px-2 h5'
                  />
                ) : (
                  <HeartOutlined
                    onClick={() => handleLike(post._id)}
                    className='text-danger pt-2 px-2 h5'
                  />
                )}
                <div className='pt-2 pl-3'>{post.likes.length} likes</div>
                <CommentOutlined
                  className='text-danger pt-2 h5 px-2'
                  style={{
                    marginLeft: '2rem'
                  }}
                />

                <div className='pt-2 pl-3'>3 Comments</div>

                {state && state.user && state.user._id === post.postedBy._id && (
                  <>
                    <EditOutlined
                      onClick={() => router.push(`/user/post/${post}`)}
                      className='text-danger pt-2 h5 px-2'
                      style={{
                        marginLeft: '2rem',
                        cursor: 'pointer'
                      }}
                    />
                    <DeleteOutlined
                      onClick={() => handleDelete(post)}
                      className='text-danger pt-2 h5 px-2'
                      style={{
                        marginLeft: '2rem'
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PostList;
