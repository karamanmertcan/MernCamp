import { SyncOutlined } from '@ant-design/icons';

const ForgotPasswordForm = ({
  handleSubmit,
  onSubmit,
  register,
  isDirty,
  isValid,
  loading,
  page
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group  p-2">
        <small>
          <label htmlFor="" className="text-muted">
            Email Address
          </label>
        </small>
        <input
          type="email"
          className="form-control"
          {...register('email')}
          placeholder="Enter your email"
        />
      </div>
      <div className="form-group p-2">
        <small>
          <label htmlFor="" className="text-muted">
            New Password
          </label>
        </small>
        <input
          type="password"
          className="form-control"
          {...register('newPassword')}
          placeholder="Enter your new password"
        />
      </div>
      <div className="form-group p-2">
        <small>
          <label htmlFor="" className="text-muted">
            Pick a Question
          </label>
        </small>
        <select className="form-control">
          <option>What is your favorite color ?</option>
          <option>What is your best friend's name ?</option>
          <option>What city you were born ?</option>
        </select>
        <small className="form-text text-muted">
          You can use this to reset your password if forgotten.
        </small>
      </div>
      <div className="form-group p-2">
        <small>
          <label htmlFor="" className="text-muted">
            Secret Answer
          </label>
        </small>
        <input
          type="text"
          className="form-control"
          {...register('secret')}
          placeholder="Write your answer here"
        />
      </div>

      <div className="form-group p-2">
        <button
          disabled={!isDirty || !isValid}
          type="submit"
          className="btn btn-primary w-100 mt-3">
          {loading ? <SyncOutlined spin className="py-1" /> : page !== 'login' ? 'Submit' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
