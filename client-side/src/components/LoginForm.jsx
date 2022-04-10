import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userLogin, clearAuthState } from "../features/authSlice";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, isSuccess, isError, errorMsg, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();  

  useEffect(() => {
    if(isSuccess){
      setEmail("");
      setPassword("");
    }

    dispatch(clearAuthState());
  }, [isSuccess, user, dispatch])

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(userLogin({ email, password, loginAsAnAdmin: false }));
  };
  return (
    <div className="container-fluid col-md-5 my-3 py-5">
      {isError && <p className="text-danger text-center">{errorMsg}</p>}

      <form>
        <div className="form-group mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
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
        <button
          type="submit"
          onClick={handleLogin}
          className="btn btn-primary btn-block"
          disabled={isLoading && true}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
