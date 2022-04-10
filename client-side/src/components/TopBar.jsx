import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Search from "./Search";

const TopBar = () => {
  const { user } = useSelector((state) => state.auth);   
  const { cartQty } = useSelector((state) => state.carts);    

  return (
    <div className="container-fluid">
      <div className="row bg-secondary py-2 px-xl-5">
        <div className="col-lg-6 d-none d-lg-block">
          <div className="d-inline-flex align-items-center">
            <a className="text-dark" href="">
              FAQs
            </a>
            <span className="text-muted px-2">|</span>
            <a className="text-dark" href="">
              Help
            </a>
            <span className="text-muted px-2">|</span>
            <a className="text-dark" href="">
              Support
            </a>
          </div>
        </div>
        <div className="col-lg-6 text-center text-lg-right">
          <div className="d-inline-flex align-items-center">
            <a className="text-dark px-2" href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a className="text-dark px-2" href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a className="text-dark px-2" href="#">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a className="text-dark px-2" href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a className="text-dark pl-2" href="#">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="row align-items-center py-3 px-xl-5">
        <div className="col-lg-3 d-none d-lg-block">
          <Link to="/" className="text-decoration-none">
            <h1 className="m-0 display-5 font-weight-semi-bold">
              <span className="text-primary font-weight-bold border px-3 mr-1">
                E
              </span>
              Shopper
            </h1>
          </Link>
        </div>
        <div className="col-lg-6 col-6 text-left">
          <Search />
        </div>
        <div className="col-lg-3 col-6 text-right">          
          <Link to={user ? `/cart/${user.id}` : '/login'} className="btn border">
            <i className="fas fa-shopping-cart text-primary"></i>
            <span className="badge">{cartQty}</span>
          </Link>          
        </div>
      </div>
    </div>
  );
};

export default TopBar;
