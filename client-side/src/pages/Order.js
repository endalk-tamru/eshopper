import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import OrderHistoryList from "../components/OrderHistoryList";
import Footer from "../components/Footer";

const Cart = () => {
  return (
    <>
      <Header />
      <PageHeader title="Order Summary" subTitle="Order Summary" />
      <OrderHistoryList />
      <Footer />
    </>
  );
};

export default Cart;
