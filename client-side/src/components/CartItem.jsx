import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCart, deleteCart } from "../features/cartSlice";

const CartItem = ({cartId, productId, imgUrl, title, price, color, size, totalPrice, quantity}) => {     
    const { id } = useParams(); // user id
    const [qty, setQty] = useState(quantity);
    const dispatch = useDispatch();    


    useEffect(()=> {
        if(qty !== quantity) {
            dispatch(updateCart({id, cartId, qty, price}))
        }
    },[dispatch, qty])

    const handleCartDelete = () => {
        dispatch(deleteCart({id, cartId}))
    }

    return (
        <tr>
            <td className="align-middle">
                <Link to={`/detail/${productId}`} style={{ textDecoration: "none" }}>
                    <img
                    src={imgUrl}
                    alt=""
                    style={{ maxWidth: "100px", minWidth: "50px" }}
                    />{" "}
                    {title}
                </Link>
            </td>
            <td className="align-middle">${price}</td>
            <td className="align-middle">{color} & {size}</td>            
            <td className="align-middle">
                <div className="input-group quantity mx-auto" style={{width: "100px"}}>
                    <div className="input-group-btn">
                        <button
                            onClick={() => setQty((prev) => prev - 1)}                            
                            disabled={qty <= 1 && true}
                            className="btn btn-sm btn-primary btn-minus"
                            >
                            <i className="fa fa-minus"></i>
                        </button>
                    </div>
                    <input type="text" className="form-control form-control-sm bg-secondary text-center" readOnly value={qty} />
                    <div className="input-group-btn">
                        <button onClick={() => setQty((prev) => prev + 1)} className="btn btn-sm btn-primary btn-plus">
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                </div>                
            </td>
            <td className="align-middle">${totalPrice}</td>
            <td className="align-middle">
                <button onClick={handleCartDelete} className="btn btn-sm btn-danger">
                    <i className="fa fa-times"></i>
                </button>
            </td>
        </tr>
    )
}

export default CartItem
