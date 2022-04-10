const FeaturedItem = ({ icon, title }) => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
      <div
        className="d-flex align-items-center border mb-4"
        style={{ padding: "30px" }}
      >
        <h1 className={`text-primary m-0 mr-3 ${icon}`}></h1>
        <h5 className="font-weight-semi-bold m-0">{title}</h5>
      </div>
    </div>
  );
};

export default FeaturedItem;
