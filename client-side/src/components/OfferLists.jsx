import OfferItem from "./OfferItem"

const OfferLists = () => {
    return (
        <div className="container-fluid offer pt-5">
            <div className="row px-xl-5">
                <OfferItem isTextLeft={false} img="img/offer-1.png" discount="20%" title="Spring Collection" />
                <OfferItem isTextLeft={true} img="img/offer-2.png" discount="20%" title="Winter Collection" />                
            </div>
        </div>
    )
}

export default OfferLists
