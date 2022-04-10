import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userRegister, clearAuthState } from "../features/authSlice";

const SignupForm = () => {
  const { isLoading, isSuccess, isError, errorMsg, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if(isSuccess){
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }

    dispatch(clearAuthState());
  }, [isSuccess, user, dispatch])

  const handleSignup = (e) => {
    e.preventDefault();
    dispatch(userRegister({ username, email, password, confirmPassword }));
  };

  return (
    <div className="container-fluid col-md-7 py-5">
      {isError && <p className="text-danger text-center">{errorMsg}</p>}

      <form>
        <div className="form-group mb-4">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby="emailHelp"
            placeholder="Email"
          />
          <small id="emailHelp" class="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
        </div>
        <button
          type="submit"
          onClick={handleSignup}
          className="btn btn-primary btn-block"
          disabled={isLoading && true}
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
