import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { fetchProductById } from "../features/productSlice"
import { addToCart, clearCartMsg } from "../features/cartSlice";
import ReviewForm from "./ReviewForm"
import ProductLists from "./ProductLists";

const DetailBody = () => {
    const {id} = useParams();  // product id     
    const [productQty, setProductQty] = useState(1)
    const [size, setSize] = useState("")
    const [color, setColor] = useState("")  
    const [isFilterEmpty, setIsFilterEmpty] = useState(false)  
    const [rateInfo, setRateInfo] = useState({
        totalRate: 0,
        rateQty: 0
    });      

    const { isLoading, isSuccess, isError, errorMsg, productDetail } = useSelector(state => state.products)
    const { user } = useSelector((state) => state.auth);
    
    const carts = useSelector(state => state.carts)
    const dispatch = useDispatch();

    const {_id, title, desc, imgUrl, price, category} = productDetail;     

    // categoryQuery = category=Men&category=T-shirt
    let categoryQuery = category?.map((k) => "category" + "=" + k).join("&")        

    useEffect(() => {        
        dispatch(clearCartMsg())
        dispatch(fetchProductById(id))         
    }, [dispatch, id])

    const handleAddToCartBtn = () => {
        if(size && color){                        
            setIsFilterEmpty(false)            
            dispatch(
                addToCart({ productId: _id, size, color, productQty, price})
            )
        } else {
            setIsFilterEmpty(true)
        }
    }

    return (
        <div className="container-fluid py-5">
            <div className="row px-xl-5">

                {isLoading && (<p className="col-12 pb-5 display-4">Loading...</p>)}  
                {isError && (<p className="col-12 pb-5 display-4">{errorMsg}</p>)}

                { isSuccess && (
                    <>
                        <div className="col-lg-5 pb-5">
                            <div className="border">                            
                                <img className="w-100 h-100" src={imgUrl} alt="Image" />                            
                            </div>                        
                        </div>

                        <div className="col-lg-7 pb-5">                            
                            <h3 className="font-weight-semi-bold">{title}</h3>
                            <div className="d-flex mb-3">
                                <div className="text-primary mr-2">                                                                    
                                    <small className={rateInfo.totalRate >= 1 ? "fas fa-star"  : (rateInfo.totalRate > 0 && rateInfo.totalRate < 1) ? "fas fa-star-half-alt" :  "far fa-star"}></small>
                                    <small className={rateInfo.totalRate >= 2 ? "fas fa-star"  : (rateInfo.totalRate > 1 && rateInfo.totalRate < 2) ? "fas fa-star-half-alt" :  "far fa-star"}></small>
                                    <small className={rateInfo.totalRate >= 3 ? "fas fa-star" : (rateInfo.totalRate > 2 && rateInfo.totalRate < 3) ? "fas fa-star-half-alt" : "far fa-star"}></small>
                                    <small className={rateInfo.totalRate >= 4 ? "fas fa-star"  : (rateInfo.totalRate > 3 && rateInfo.totalRate < 4) ? "fas fa-star-half-alt" :  "far fa-star"}></small>
                                    <small className={rateInfo.totalRate === 5 ? "fas fa-star"  : (rateInfo.totalRate > 4 && rateInfo.totalRate < 5) ? "fas fa-star-half-alt" :  "far fa-star"}></small>                                    
                                </div>
                                <small className="pt-1">({rateInfo.rateQty} Reviews)</small>
                            </div>
                            
                            <h3 className="font-weight-semi-bold mb-4">{price}</h3>
                            
                            {desc?.split("\n").map((str, index) => (
                                <p key={index} className="mb-4">{str}</p>
                            ))}

                                {/* Size Filter */}
                                {isFilterEmpty && <p className="text-danger">Size & Color are required</p>}
                                <div className="d-flex mb-3">
                                    <p className="text-dark font-weight-medium mb-0 mr-3">Sizes:</p>
                                    <form>
                                    {productDetail.size && productDetail.size.map((size, idx) => (
                                        <div key={`size-${idx}`} className="custom-control custom-radio custom-control-inline">
                                            {user && (
                                                <input
                                                    type="radio"
                                                    className="custom-control-input"
                                                    id={`size-${idx}`}
                                                    name="size"
                                                    value={size}
                                                    onChange={(e) => setSize(e.target.value)}
                                                /> 
                                            )}
                                            <label className={user && "custom-control-label"} htmlFor={`size-${idx}`}>
                                                {size}
                                            </label>
                                        </div>
                                    ))}
                                    </form>
                                </div>

                                {/* Color Filter */}
                                <div className="d-flex mb-4">
                                    <p className="text-dark font-weight-medium mb-0 mr-3">Colors:</p>
                                    <form>
                                        {productDetail.color && productDetail.color.map((color, idx) => (
                                            <div key={`color-${idx}`} className="custom-control custom-radio custom-control-inline">
                                                {user && (
                                                    <input
                                                        type="radio"
                                                        className="custom-control-input"
                                                        id={`color-${idx}`}
                                                        name="color"
                                                        value={color}
                                                        onChange={(e) => setColor(e.target.value)}
                                                    />
                                                )}
                                                <label className={user && "custom-control-label"} htmlFor={`color-${idx}`}>
                                                    {color}
                                                </label>
                                            </div>
                                        ))}
                                    </form>
                                </div>

                                {/* Add To Cart */}
                                {carts.isSuccess && <p className="text-success lead">{carts.successMsg}</p>}
                                {carts.isError && <p className="text-danger lead">{carts.errorMsg}</p>}
                                {user && (
                                    <div className="d-flex align-items-center mb-4 pt-2">                                
                                        <div className="input-group quantity mr-3" style={{width: "130px"}}>
                                            <div className="input-group-btn">                                
                                                <button onClick={()=>setProductQty(prev => prev - 1)} disabled={productQty === 1 && true} className="btn btn-primary btn-minus" >
                                                    <i className="fa fa-minus"></i>
                                                </button>                                 
                                            </div>
                                            <input type="text" className="form-control bg-secondary text-center" value={productQty} />
                                            <div className="input-group-btn">
                                                <button onClick={()=>setProductQty(prev => prev + 1)} className="btn btn-primary btn-plus">
                                                    <i className="fa fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary px-3" onClick={handleAddToCartBtn} disabled={carts.isLoading && true}>
                                            <i className="fa fa-shopping-cart mr-1"></i> Add To Cart
                                        </button>                                
                                    </div>
                                )}

                            {/* Share On */}
                            <div className="d-flex pt-2">
                                <p className="text-dark font-weight-medium mb-0 mr-2">Share on:</p>
                                <div className="d-inline-flex">
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
                                        <i className="fab fa-pinterest"></i>
                                    </a>
                                </div>
                            </div>                            
                        </div>
                    </>
                )}
            </div>     

            <ReviewForm
                id={id}
                user={user}
                title={title}                
                setRateInfo={setRateInfo}
            />
                                    
            <ProductLists title="You May Also Like" filterString={categoryQuery} />
        </div>
                    
    )
}

export default DetailBody
