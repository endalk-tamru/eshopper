import Carousel from "../components/Carousel";
import FeaturedLists from "../components/FeaturedLists";
import CategoryLists from "../components/CategoryLists";
import OfferLists from "../components/OfferLists";
import ProductLists from "../components/ProductLists";
import Subscribe from "../components/Subscribe";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Home = () => {
  return (
    <>
      <Header displayCategoryDropdown={true} carousel={<Carousel/>} />
      <FeaturedLists />
      <CategoryLists />
      <OfferLists />
      <ProductLists title="Trandy Products" start={0} end={4}/>
      <Subscribe />
      <ProductLists title="Just Arrived" start={4} end={8} />      
      <Footer />
    </>
  );
};

export default Home;
