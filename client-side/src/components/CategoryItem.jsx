import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CategoryItem = ({ categoryName, img, categoryStats }) => {    
  const [numOfProduct, setNumOfProduct] = useState(0)

  useEffect(() => {
    if (categoryStats) {
      categoryStats.map((stat) => {
        if (stat._id === categoryName)
          setNumOfProduct(stat.total)
      });
    }
  }, [categoryStats]);

  return (
    <div className="col-lg-4 col-md-6 pb-1">
      <Link
        to={`/shop?category=${categoryName}`}
        style={{ textDecoration: "none" }}
      >
        <div
          className="cat-item d-flex flex-column border mb-4"
          style={{ padding: "30px" }}
        >
          <p className="text-right">{numOfProduct} Products</p>
          <div className="cat-img position-relative overflow-hidden mb-3">
            <img className="img-fluid" src={img} alt="" />
          </div>
          <h5 className="font-weight-semi-bold m-0">{categoryName}</h5>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;
