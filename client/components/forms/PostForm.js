import React from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
// import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6

const PostForm = ({ content, setContent, onSubmit, handleImage, uploading, image }) => {
  return (
    <div className='card'>
      <div className='card-body pb-3'>
        <form className='form-group'>
          <ReactQuill
            theme='snow'
            className='form-control'
            placeholder='Write Something...'
            value={content}
            onChange={(e) => setContent(e)}
          />
        </form>
      </div>

      <div className='card-footer d-flex justify-content-between'>
        <button
          disabled={!content}
          onClick={onSubmit}
          type='submit'
          className='btn btn-primary pt-1 btn-sm mt-1'>
          Post
        </button>
        <label>
          {image && image.url ? (
            <Avatar size={30} src={image.url} className='mt-1' />
          ) : uploading ? (
            <LoadingOutlined className='mt-2' />
          ) : (
            <CameraOutlined className='mt-2' />
          )}
          <input type='file' accept='images/*' hidden onChange={handleImage} />
        </label>
      </div>
    </div>
  );
};

export default PostForm;
