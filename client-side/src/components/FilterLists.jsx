const FilterLists = ({ filters, setFilters }) => {
    const prices = [
        { priceRange: "Any", minPrice: "", maxPrice: ""},      
        { priceRange: "$0 - $50", minPrice: 0, maxPrice: 50},      
        { priceRange: "$51 - $100", minPrice: 51, maxPrice: 100},      
        { priceRange: "$101 - $150", minPrice: 101, maxPrice: 150},      
        { priceRange: "$151 - $200", minPrice: 151, maxPrice: 200},      
        { priceRange: "Above $201", minPrice: 201, maxPrice: 1000000},      
      ];

    const colors = ["Black", "White", "Yellow","Blue", "Red", "Grey"];

    const sizes = ["XS", "S", "M", "L", "XL"];             

    
    const handlePriceToggle = (min, max) => {    
        setFilters({...filters, ["minPrice"]: [min], ["maxPrice"]: [max]})        
    };                        
    
    const handleColorAndSizeToggle = (selectedItem, name) => {          
        const currentIndex = name === "color" ? filters.color.indexOf(selectedItem) : filters.size.indexOf(selectedItem);
        const newChecked = name === "color" ? [...filters.color] : [...filters.size];    
        (currentIndex === -1) ? newChecked.push(selectedItem) :
        newChecked.splice(currentIndex, 1);      
        setFilters({...filters, [name]: newChecked});
    };                

    return (
        // Shop Sidebar Start
        <div className="col-sm-3">
            {/* Price Start */}
            <div className="border-bottom mb-4 pb-4">
                <h5 className="font-weight-semi-bold mb-4">Filter by price</h5>
                <form>
                    {prices.map((price, idx) => (                                                
                        <div key={idx} className="custom-control custom-radio d-flex align-items-center justify-content-between mb-3">
                            <input
                                type="radio"
                                className="custom-control-input"
                                id={idx}
                                name="price"                                                              
                                onChange={() => handlePriceToggle(price.minPrice, price.maxPrice)}
                            />
                            <label className="custom-control-label" htmlFor={idx}>
                                {price.priceRange}
                            </label>                            
                        </div>                       
                    ))}                     
                </form>
            </div>                      
            
            {/* Color Start */}
            <div className="border-bottom mb-4 pb-4">
                <h5 className="font-weight-semi-bold mb-4">Filter by color</h5>
                <form>                    
                    {colors.map((color, idx) => (
                        <div key={idx} className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                            <input                                
                                type="checkbox"
                                className="custom-control-input"                                
                                id={color}
                                checked={filters.color.indexOf(color) === -1 ? false : true}
                                onChange={() => handleColorAndSizeToggle(color, "color")}                                                             
                            />
                            <label className="custom-control-label" for={color}>{color}</label>                            
                        </div>
                    ))}                                        
                </form>
            </div>            

            {/* Size Start */}
            <div className="mb-5">
                <h5 className="font-weight-semi-bold mb-4">Filter by size</h5>
                <form>
                    {sizes.map((size, idx) => (
                        <div key={idx} className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                            <input                                
                                type="checkbox"
                                className="custom-control-input"                                
                                id={size}
                                checked={filters.size.indexOf(size) === -1 ? false : true}
                                onChange={() => handleColorAndSizeToggle(size, "size")}                                
                            />
                            <label className="custom-control-label" for={size}>{size}</label>                            
                        </div>
                    ))}                   
                </form>
            </div>            
        </div>
    )
}

export default FilterLists
