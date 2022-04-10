import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import CartList from "../components/CartList";
import Footer from "../components/Footer";

const Cart = () => {
  return (
    <>
      <Header />
      <PageHeader title="Shopping Cart" subTitle="Shopping Cart" />
      <CartList />
      <Footer />
    </>
  );
};

export default Cart;
