import { Link } from "react-router-dom"

const OfferItem = ({ isTextLeft, img, discount, title}) => {
    return (
        <div className="col-md-6 pb-4">
            <div className={`position-relative bg-secondary text-center ${isTextLeft ? "text-md-left" : "text-md-right" } text-white mb-2 py-5 px-5`}>
                <img src={img} alt="" />
                <div className="position-relative" style={{ zIndex: 1 }}>
                    <h5 className="text-uppercase text-primary mb-3">{discount} off the all order</h5>
                    <h1 className="mb-4 font-weight-semi-bold">{title}</h1>
                    <Link to="/shop" className="btn btn-outline-primary py-md-2 px-md-3">Shop Now</Link>
                </div>
            </div>
        </div>
    )
}

export default OfferItem
