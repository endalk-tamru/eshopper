import { useState } from "react";
import { Link } from "react-router-dom";

const Categories = ({ show }) => {
  const [displayCategory, setDisplayCategory] = useState(show);

  return (
    <div className="col-lg-3 d-none d-lg-block">
      <a
        className="btn shadow-none d-flex align-items-center justify-content-between bg-primary text-white w-100"
        data-toggle="collapse"
        style={{ height: "65px", marginTop: "-1px", padding: "0 30px" }}
        onClick={() => setDisplayCategory(!displayCategory)}
      >
        <h6 className="m-0">Categories</h6>
        <i className="fa fa-angle-down text-dark"></i>
      </a>
      <nav
        className={`collapse ${
          displayCategory && "show"
        } navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0`}
        id="navbar-vertical"
      >
        <div
          className="navbar-nav w-100 overflow-hidden"
          style={{ height: "410px" }}
        >
          <div className="nav-item dropdown">
            <a href="#" className="nav-link" data-toggle="dropdown">
              Dresses <i className="fa fa-angle-down float-right mt-1"></i>
            </a>
            <div className="dropdown-menu position-absolute bg-secondary border-0 rounded-0 w-100 m-0">
              <Link to="/shop?category=Men" className="dropdown-item">
                Men's Dresses
              </Link>
              <Link to="/shop?category=Women" className="dropdown-item">
                Women's Dresses
              </Link>
              <Link to="/shop?category=Kids" className="dropdown-item">
                Baby's Dresses
              </Link>
            </div>
          </div>
          <Link to="/shop?category=Shirts" className="nav-item nav-link">
            Shirts
          </Link>
          <Link to="/shop?category=Jeans" className="nav-item nav-link">
            Jeans
          </Link>
          <Link to="/shop?category=Suits" className="nav-item nav-link">
            Suits
          </Link>
          <Link to="/shop?category=Swimwear" className="nav-item nav-link">
            Swimwear
          </Link>
          <Link to="/shop?category=Sleepwear" className="nav-item nav-link">
            Sleepwear
          </Link>
          <Link to="/shop?category=Sportswear" className="nav-item nav-link">
            Sportswear
          </Link>
          <Link to="/shop?category=Blazers" className="nav-item nav-link">
            Blazers
          </Link>
          <Link to="/shop?category=Jackets" className="nav-item nav-link">
            Jackets
          </Link>
          <Link to="/shop?category=Trousers" className="nav-item nav-link">
            Trousers
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Categories;
