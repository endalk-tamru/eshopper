import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { fetchProducts } from "../features/productSlice";
import { fetchReviews } from "../features/reviewSlice";

const ProductLists = ({ title, filterString, start=0, end=4 }) => {
  const dispatch = useDispatch();    
  const { isLoading, products } = useSelector((state) => state.products);  
  const { reviewInfo } = useSelector(state => state.review)  

  useEffect(() => {    
    dispatch(fetchProducts({filterString}));                           
    dispatch(fetchReviews())            
  }, [dispatch, filterString]);      

  // let filterdProduct;
  // if(fetchNewProduct) {
  //   filterdProduct = []
  //     .concat(products)
  //     .slice(-2)
  //     .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));      
  // } else {
  //   filterdProduct = products
  // }  

  return (
    <div className="container-fluid pt-5">
      <Title title={title} />
      <div className="row px-xl-5 pb-3">
        {isLoading && <p className="display-4 pl-3">Loading...</p>}
        
        {products.slice(start, end).map((product) => (
          <ProductItem
            key={product._id}
            onLgScreen="col-lg-3"
            productId={product._id}
            imgUrl={product.imgUrl}
            title={product.title}
            size={product.size[0]}
            color={product.color[0]}
            price={product.price}     
            reviewInfo={reviewInfo}                    
          />
        ))}
      </div>
    </div>
  );
};

export default ProductLists;
