import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviewById, addReview, deleteReview } from "../features/reviewSlice";

const ReviewForm = ({id, user, title, setRateInfo}) => {
    const [rate, setRate] = useState(1);
    const [comment, setComment] = useState("");
    const [isFieldEmpty, setIsFieldEmpty] = useState(false);

    const dispatch = useDispatch();
    const {isLoading, isSuccess, isError, review, reviewQty, errorMsg} = useSelector(state => state.review)        

    useEffect(() => {
        dispatch(fetchReviewById(id))
    }, [dispatch, id])

    useEffect(()=> {
        if(isSuccess){
            setRate("");
            setComment(""); 
            setRateInfo({totalRate: review.totalRate, rateQty: reviewQty})
        }
    },[isSuccess, reviewQty])

    const handleAddReview = (e) => {
        e.preventDefault();
        if(rate && comment){                        
            setIsFieldEmpty(false)            
            dispatch(
                dispatch(addReview({id, username: user.username, rate, comment})) 
            )
        } else {
            setIsFieldEmpty(true)
        }              
    }

    const handleReviewDelete = (reviewId) => {
        dispatch(deleteReview({id: user.id, productId: id, reviewId}))
    }

    return (
        <div className="row mt-5">
            <div className="col-md-6">
                <h4 className="mb-4">Client reviews for {title}</h4>
                {review.reviews && review.reviews.slice(0).reverse().map(info => (                    
                    <div className="media mb-4" key={info._id}>
                        <img src="/img/user.jpg" alt="Image" className="img-fluid mr-3 mt-1" style={{ width: "45px" }} />                        
                        <div className="media-body">
                            <div className="d-flex justify-content-between">
                                <h6>{info.username}<small> - <i>{new Date(info.date).toLocaleString()}</i></small></h6>
                                {
                                    info.userId === user?.id && (
                                    <button onClick={() => handleReviewDelete(info._id)} className="btn btn-sm btn-danger mr-5">
                                        <i className="fa fa-times"></i>
                                    </button>
                                    )
                                }
                            </div>
                            <div className="text-primary mb-2">
                                <i className={info.rating >= 1 ? "fas fa-star" : "far fa-star"}></i>
                                <i className={info.rating >= 2 ? "fas fa-star" : "far fa-star"}></i>
                                <i className={info.rating >= 3 ? "fas fa-star" : "far fa-star"}></i>
                                <i className={info.rating >= 4 ? "fas fa-star" : "far fa-star"}></i>
                                <i className={info.rating >= 5 ? "fas fa-star" : "far fa-star"}></i>
                            </div>
                            <p>{info.comment}</p>
                        </div>
                    </div>
                ))}                
            </div>

            {user &&                 
                <div className="col-md-6">
                    <h4 className="mb-4">Leave a review</h4>
                    <small>Your email address will not be published. Required fields are marked *</small>

                    {isError && <p className="text-danger">{errorMsg}</p>}
                    {isFieldEmpty && <p className="text-danger">Rate and Comment fields are required</p>}

                    <div className="d-flex my-3">
                        <p className="mb-0 mr-2">Your Rating * :</p>
                        <div className="text-primary" style={{cursor: "pointer"}}>
                            <span onClick={() => setRate(1)}><i className={rate >= 1 ? "fas fa-star" : "far fa-star"}></i></span>
                            <span onClick={() => setRate(2)}><i className={rate >= 2 ? "fas fa-star" : "far fa-star"}></i></span>
                            <span onClick={() => setRate(3)}><i className={rate >= 3 ? "fas fa-star" : "far fa-star"}></i></span>
                            <span onClick={() => setRate(4)}><i className={rate >= 4 ? "fas fa-star" : "far fa-star"}></i></span>
                            <span onClick={() => setRate(5)}><i className={rate >= 5 ? "fas fa-star" : "far fa-star"}></i></span>
                        </div>                        
                    </div>
                    <form>
                        <div className="form-group">
                            <label htmlFor="message">Your Review *</label>
                            <textarea id="message" cols="30" rows="5" value={comment} onChange={(e) => setComment(e.target.value)} className="form-control"></textarea>
                        </div>                
                        <button className="btn btn-primary px-3" onClick={handleAddReview} disabled={isLoading && true}>
                            Leave Your Review
                        </button>  
                    </form>
                </div>
            }
        </div>
    )
}

export default ReviewForm
