import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import OrderHistoryItem from "./OrderHistoryItem";
import { fetchUserOrders } from "../features/orderSlice";

const OrderHistoryList = () => {
  const { id } = useParams(); // user id
  const { isLoading, isError, orders, errorMsg } = useSelector(
    (state) => state.orders
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserOrders(id));
  }, [dispatch, id]);

  return (
    <div className="container-fluid py-2">
      <div className="table-responsive">
        {isLoading && <p className="display-4 mb-2 pl-3">Loading...</p>}
        {isError && <p className="display-4 mb-2 pl-3">{errorMsg}</p>}
        {!isLoading && orders.length <= 0 && <p className="display-4 mb-2 pl-3">Your order history is empty!</p>}

        {orders.length > 0 && (
          <table className="table table-bordered text-center mb-0">
            <thead className="bg-secondary text-dark">
              <tr>
                <th>Products</th>
                <th>Qty</th>
                <th>Total Amount</th>
                <th>Ordered Date</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {orders.map((history) => (
                <OrderHistoryItem key={history._id} orderHistory={history} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryList;
