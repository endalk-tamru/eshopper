import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CartItem from "./CartItem";
import { fetchCarts } from "../features/cartSlice";
import { createCheckoutSession } from "../features/checkoutSlice";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CartList = () => {  
  const { id } = useParams(); // user id  
  const { isLoading, isSuccess, isError, cartInfo, errorMsg } = useSelector(
    (state) => state.carts
  );
  const checkout = useSelector((state) => state.checkout);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCarts(id));
  }, [dispatch, id]);

  useEffect(() => {
    if(checkout.url){
      window.location = checkout.url
    }
  }, [checkout.url])

  const handleCheckout = async () => {
    dispatch(createCheckoutSession({id, cartInfo}));
  };

  return (
    <div className="container-fluid pt-5">
      <div className="row px-xl-5">
        <div className="col-lg-8 table-responsive mb-5">
          {isLoading && <p className="display-4 mb-2 pl-3">Loading...</p>}
          {isError && <p className="display-4 mb-2 pl-3">{errorMsg}</p>}

          <table className="table table-bordered text-center mb-0">
            <thead className="bg-secondary text-dark">
              <tr>
                <th>Products</th>
                <th>Price</th>
                <th>Color & Size</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {isSuccess &&
                cartInfo.products.slice(0).reverse().map((cart) => (
                  <CartItem
                    key={cart._id}
                    cartId={cart._id}
                    productId={cart.productId._id}
                    imgUrl={cart.productId.imgUrl}
                    title={cart.productId.title}
                    price={cart.productId.price}
                    color={cart.color}
                    size={cart.size}
                    totalPrice={cart.totalPrice}
                    quantity={cart.quantity}
                  />
                ))} 
            </tbody>
          </table>
        </div>

        <Elements stripe={stripePromise}>
          <div className="col-lg-4">
            <div className="card border-secondary mb-5">
              <div className="card-header bg-secondary border-0">
                <h4 className="font-weight-semi-bold m-0">Cart Summary</h4>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3 pt-1">
                  <h6 className="font-weight-medium">Subtotal</h6>
                  <h6 className="font-weight-medium">
                    $
                    {isSuccess && cartInfo.subTotal
                      ? cartInfo.subTotal
                      : "0.00"}
                  </h6>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <h6 className="font-weight-medium">Shipping</h6>
                  <h6 className="font-weight-medium">$10</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">Shipping Discount</h6>
                  <h6 className="font-weight-medium">- $10</h6>
                </div>
              </div>
              <div className="card-footer border-secondary bg-transparent">
                <div className="d-flex justify-content-between mt-2">
                  <h5 className="font-weight-bold">Total</h5>
                  <h5 className="font-weight-bold">
                    $
                    {isSuccess && cartInfo.subTotal
                      ? cartInfo.subTotal
                      : "0.00"}
                  </h5>
                </div>
                <button
                  className="btn btn-block btn-primary my-3 py-3"
                  onClick={handleCheckout}
                  disabled={(checkout.isLoading || !cartInfo.subTotal) && true}
                >
                  {checkout.isLoading && "Redirecting to Stripe..."} 
                  {checkout.isError && !checkout.isLoading && `${checkout.errorMsg} Try again`}
                  {!checkout.isLoading && !checkout.isError && "Proceed To Checkout"}
                </button>
              </div>
            </div>
          </div>
        </Elements>
      </div>
    </div>
  );
};

export default CartList;
