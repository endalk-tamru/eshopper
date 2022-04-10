import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryItem from "./CategoryItem";
import { numOfProductByCategory } from "../features/productSlice";

const CategroyLists = () => {
  const dispatch = useDispatch();
  const { categoryStats } = useSelector((state) => state.products);

  const [categories, setCategories] = useState([
    { name: "Men", img: "img/cat-1.jpg" },
    { name: "Women", img: "img/cat-2.jpg" },
    { name: "Kids", img: "img/cat-3.jpg" },
    { name: "Jeans", img: "img/cat-4.jpg" },
    { name: "Suits", img: "img/cat-5.jpg" },
    { name: "Jackets", img: "img/cat-6.jpg" },
  ]);

  useEffect(() => {
    dispatch(numOfProductByCategory());
  }, []);

  return (
    <div className="container-fluid pt-5">
      <div className="row px-xl-5 pb-3">
        {categories.map((cat) => (
          <CategoryItem
            key={cat.name}
            categoryName={cat.name}            
            img={cat.img}
            categoryStats={categoryStats}
          />
        ))}
      </div>
    </div>
  );
};

export default CategroyLists;
