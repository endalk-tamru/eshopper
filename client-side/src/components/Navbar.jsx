import {Link} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../features/authSlice"
import { clearCartState } from "../features/cartSlice"

const Navbar = () => {
  const { user } = useSelector(state => state.auth)  
  const dispatch = useDispatch();

  const handleLogoutBtn = () => {
    dispatch(logout());
    dispatch(clearCartState());    
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0">
      <Link to="/" className="text-decoration-none d-block d-lg-none">
        <h1 className="m-0 display-5 font-weight-semi-bold">
          <span className="text-primary font-weight-bold border px-3 mr-1">
            E
          </span>
          Shopper
        </h1>
      </Link>
      <button
        type="button"
        className="navbar-toggler"
        data-toggle="collapse"
        data-target="#navbarCollapse"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse justify-content-between"
        id="navbarCollapse"
      >
        <div className="navbar-nav mr-auto py-0">
          <Link to="/" className="nav-item nav-link">
            Home
          </Link>
          <Link to="/shop" className="nav-item nav-link">
            Shop
          </Link>
          <Link to="/contact" className="nav-item nav-link">
            Contact
          </Link>
        </div>
        <div className="navbar-nav ml-auto py-0">
          {!user && (
            <>
            <Link to="/login" className="nav-item nav-link">
                Login
            </Link>                
              
            <Link to="/signup" className="nav-item nav-link">
                Signup
            </Link>                
              
            </>
          )}
          {user && (
            <Link to="#" onClick={handleLogoutBtn} className="nav-item nav-link">
              Logout
            </Link>
          )}         
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
