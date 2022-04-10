import { useState } from "react";

const Search = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for products"
      />
      <a
        href={`/shop?search=${search}`}
        className="input-group-append"
        style={{ textDecoration: "none" }}
      >
        <span className="input-group-text bg-transparent text-primary">
          <i className="fa fa-search"></i>
        </span>
      </a>
    </div>
  );
};

export default Search;
