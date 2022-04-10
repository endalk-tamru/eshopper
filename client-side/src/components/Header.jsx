import TopBar from "./TopBar";
import CategoryNav from "./CategoryNav";
import Navbar from "./Navbar";

const Header = ({displayCategoryDropdown = false, carousel}) => {
  return (
    <>
      <TopBar />
      <div className="container-fluid ">
        <div className="row border-top px-xl-5">
          <CategoryNav show={displayCategoryDropdown} />
          <div className="col-lg-9">
            <Navbar />
            {carousel}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
