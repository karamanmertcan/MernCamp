import React from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6

const CreatePostForm = ({ content, setContent, onSubmit }) => {
  return (
    <div className="card">
      <div className="card-body pb-3">
        <form className="form-group">
          <ReactQuill
            theme="snow"
            className="form-control"
            placeholder="Write Something..."
            value={content}
            onChange={(e) => setContent(e)}
          />
        </form>
      </div>
      <div className="card-footer">
        <button
          disabled={!content}
          onClick={onSubmit}
          type="submit"
          className="btn btn-primary pt-1 btn-sm mt-1">
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePostForm;
