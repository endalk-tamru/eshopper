import { useLocation } from "react-router-dom";
import Title from "./Title";

const PaymentSuccess = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  return (
    <div className="container-fluid my-3 py-5 text-center">
      <Title title={query.get("session_id") ? "Successfull" : "Failed"} />
      <p className="display-4">
        {query.get("session_id")
          ? "Your order is being prepared!"
          : "You did not make any payment"}
      </p>
      <p className="lead">Thanks for choosing us!</p>
    </div>
  );
};

export default PaymentSuccess;
