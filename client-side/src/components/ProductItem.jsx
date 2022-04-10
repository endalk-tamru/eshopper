import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { addToCart } from "../features/cartSlice";

const ProductItem = (props) => {    
    const {onLgScreen, productId, imgUrl, title, size, color, price, reviewInfo} = props

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);    

    const [rateNum, setRateNum] = useState(0)    

    useEffect(() => {
        if(reviewInfo.length > 0) {
            const findReview = reviewInfo.find(
                (review) => review.productId === productId
            );
            findReview && setRateNum(findReview.totalRate)
        }
    })

    const handleAddToCartBtn = () => {
        dispatch(
            addToCart({ productId, size, color, productQty: 1, price})
        )        
    }   
    
    return (
        <div className={`${onLgScreen} col-md-6 col-sm-12 pb-1`}>
            <div className="card product-item border-0 mb-4">
                <div className="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                    <img className="img-fluid w-100" src={imgUrl} alt="" />
                </div>
                <div className="card-body border-left border-right text-center p-0 pt-4 pb-3">
                    <h6 className="text-truncate mb-3">{title}</h6>
                    <div className="d-flex justify-content-center">
                        <h6>${price}</h6><h6 className="text-muted ml-2"></h6>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="text-primary">                                                                    
                            <small className={rateNum >= 1 ? "fas fa-star"  : (rateNum > 0 && rateNum < 1) ? "fas fa-star-half-alt" :  "far fa-star"}></small>
                            <small className={rateNum >= 2 ? "fas fa-star"  : (rateNum > 1 && rateNum < 2) ? "fas fa-star-half-alt" :  "far fa-star"}></small>
                            <small className={rateNum >= 3 ? "fas fa-star" : (rateNum > 2 && rateNum < 3) ? "fas fa-star-half-alt" : "far fa-star"}></small>
                            <small className={rateNum >= 4 ? "fas fa-star"  : (rateNum > 3 && rateNum < 4) ? "fas fa-star-half-alt" :  "far fa-star"}></small>
                            <small className={rateNum === 5 ? "fas fa-star"  : (rateNum > 4 && rateNum < 5) ? "fas fa-star-half-alt" :  "far fa-star"}></small>                                    
                        </div>                        
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-between bg-light border">
                    <Link to={`/detail/${productId}`} className="btn btn-sm mx-auto text-dark p-0"><i className="fas fa-eye text-primary mr-1"></i>View Detail</Link>
                    {user && (
                        <button                        
                            onClick={handleAddToCartBtn}
                            className="btn btn-sm text-dark p-0"
                        >
                            <i className="fas fa-shopping-cart text-primary mr-1"></i>Add To
                            Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductItem
