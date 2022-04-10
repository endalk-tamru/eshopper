import FeaturedItem from "./FeaturedItem";

const Featured = () => {
  return (
    <div className="container-fluid mt-5 pt-5">
      <div className="row px-xl-5 pb-3">
        <FeaturedItem icon="fa fa-check" title="Quality Product" />
        <FeaturedItem icon="fa fa-shipping-fast" title="Free Shipping" />
        <FeaturedItem icon="fas fa-exchange-alt" title="14-Day Return" />
        <FeaturedItem icon="fa fa-phone-volume" title="24/7 Support" />
      </div>
    </div>
  );
};

export default Featured;
