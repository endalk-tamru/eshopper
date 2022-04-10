import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FilterLists from "./FilterLists";
import Pagination from "./Pagination";
import ProductItem from "./ProductItem";
import { fetchProducts, checkNextPage } from "../features/productSlice";
import { fetchReviews } from "../features/reviewSlice";

const Shop = () => {      
    const location = useLocation()
    const query = new URLSearchParams(location.search);
    let category = query.get('category') ? query.get('category') : "";            
    
    const [search, setSearch] = useState(query.get("search") || "");           
    const [pageNum, setPageNum]  = useState(1);
    const [filters, setFilters] = useState({
        color: [],
        size: [],
        minPrice: [],
        maxPrice: []
    });    

    const dispatch = useDispatch();    
    const { isLoading, products, hasNextPage } = useSelector(state => state.products)
    const { reviewInfo } = useSelector(state => state.review)
    
    // filterString = color=Black&color=Red&size=XL&size=M&minPrice=0&maxPrice=50
    let filterString = Object.keys(filters)
      .map((key) => filters[key].map((k) => key + "=" + k).join("&"))
      .join("&");                    

    useEffect(() => {              
        dispatch(fetchProducts({pageNum, category, search, filterString}))
        dispatch(checkNextPage({pageNum: pageNum + 1, category, search, filterString}))
        dispatch(fetchReviews())     
    }, [dispatch, pageNum, category, search, filters])    

    return (
        <div className="container-fluid pt-5">            
            {category && <h2 className="pb-5">Category: {category}</h2>}
            <div className="row px-xl-5">
            <FilterLists
                filters={filters}
                setFilters={setFilters}                
            />
                <div className="col-sm-9">
                    <div className="row pb-3">
                        <div className="col-12 pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <form action="">
                                    <div className="input-group">
                                        <input type="text" className="form-control" onChange={(e) => setSearch(e.target.value)} placeholder="Search for products" />
                                        <div className="input-group-append">
                                            <span className="input-group-text bg-transparent text-primary">
                                                <i className="fa fa-search"></i>
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {isLoading && (<p className="display-4 pl-3">Loading...</p>)}     

                        {products.map((product) => (
                            <ProductItem
                                key={product._id}
                                onLgScreen="col-lg-4"
                                productId={product._id}
                                imgUrl={product.imgUrl}
                                title={product.title}
                                size={product.size[0]}
                                color={product.color[0]}
                                price={product.price}  
                                reviewInfo={reviewInfo}                              
                            />
                        ))}                        

                        <Pagination
                            pageNum={pageNum}
                            setPageNum={setPageNum}
                            hasNextPage={hasNextPage}
                        />
                    </div>
                </div>
            </div>
      </div>
    )
}

export default Shop
