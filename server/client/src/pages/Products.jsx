import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const API_URL = import.meta.env.VITE_API_URL || "https://kidskart.onrender.com";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  
  const navigate = useNavigate();
  const { search: urlSearch } = useLocation();
  const queryParams = new URLSearchParams(urlSearch);
  const selectedCategory = queryParams.get("category") || "All";
  const selectedAgeGroup = queryParams.get("ageGroup") || "All";
  const maxPriceParam = queryParams.get("maxPrice") || "All";

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(urlSearch);
    setSearch(params.get("search") || "");
  }, [urlSearch]);

  const handleFilterChange = (filterName, value) => {
    const newParams = new URLSearchParams(urlSearch);
    if (value === "All") {
      newParams.delete(filterName);
    } else {
      newParams.set(filterName, value);
    }
    navigate(`/products?${newParams.toString()}`);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    const newParams = new URLSearchParams(urlSearch);
    if (!value) {
      newParams.delete("search");
    } else {
      newParams.set("search", value);
    }
    navigate(`/products?${newParams.toString()}`, { replace: true });
  };

  const handleClearFilters = () => {
    setSearch("");
    setSortBy("Newest");
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark" role="status"></div>
        <h4 className="mt-3">Loading products...</h4>
      </div>
    );
  }

  // Multi-faceted filtering logic
  let filteredProducts = products.filter((product) => {
    const matchesCategory = (selectedCategory === "All")
      ? true
      : product.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesAgeGroup = (selectedAgeGroup === "All")
      ? true
      : product.ageGroup === selectedAgeGroup;

    const matchesSearch = product.title
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
      product.brand
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesMaxPrice = (maxPriceParam === "All")
      ? true
      : product.price <= parseFloat(maxPriceParam);

    return matchesCategory && matchesAgeGroup && matchesSearch && matchesMaxPrice;
  });

  // Sorting logic
  if (sortBy === "Price Low → High") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "Price High → Low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "Newest") {
    // Sort by createdAt timestamp desc
    filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return (
    <div className="container py-3">
      {/* Filtering Header Bar */}
      <div className="bg-white p-3 border rounded-3 mb-4 shadow-sm">
        <div className="row g-3 align-items-center">
          {/* Category Dropdown */}
          <div className="col-6 col-md-3">
            <select
              className="form-select shadow-sm"
              value={selectedCategory}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Boy Fashion">Boy Fashion</option>
              <option value="Girl Fashion">Girl Fashion</option>
              <option value="Toys">Toys</option>
              <option value="Baby Gear">Baby Gear</option>
              <option value="Feeding & Nursing">Feeding & Nursing</option>
              <option value="Bath & Skin">Bath & Skin</option>
            </select>
          </div>

          {/* Age Group Dropdown */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={selectedAgeGroup}
              onChange={(e) => handleFilterChange("ageGroup", e.target.value)}
            >
              <option value="All">All Age Groups</option>
              <option value="0-2 Years">0-2 Years</option>
              <option value="3-5 Years">3-5 Years</option>
              <option value="6-10 Years">6-10 Years</option>
              <option value="11-15 Years">11-15 Years</option>
            </select>
          </div>

          {/* Budget Dropdown */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={maxPriceParam}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            >
              <option value="All">All Budgets</option>
              <option value="249">Under ₹249</option>
              <option value="449">Under ₹449</option>
              <option value="749">Under ₹749</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Newest">Newest</option>
              <option value="Price Low → High">Price: Low to High</option>
              <option value="Price High → Low">Price: High to Low</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="col-12 col-md-2 text-end">
            <button onClick={handleClearFilters} className="btn btn-outline-secondary w-100 btn-sm py-2">
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark m-0">Products Catalog ({filteredProducts.length})</h3>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-5 text-secondary">
          <h4>No products matching your search criteria</h4>
          <button onClick={handleClearFilters} className="btn btn-dark mt-2">Reset Filters</button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => {
            const cartItem = cartItems.find((item) => item._id === product._id);
            const quantityInCart = cartItem ? cartItem.quantity : 0;
            const isOutOfStock = product.stock === 0;

            return (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 border-0 shadow-sm position-relative rounded-3">
                  {isOutOfStock && (
                    <span className="position-absolute top-0 start-0 badge bg-danger m-2 px-2 py-1" style={{ zIndex: 10 }}>
                      Out Of Stock
                    </span>
                  )}
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.image}
                      className="card-img-top rounded-top-3"
                      alt={product.title}
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                  <div className="card-body d-flex flex-column">
                    <div className="mb-2">
                      <span className="badge bg-light text-secondary border">{product.category}</span>
                      <span className="badge bg-warning text-dark ms-2">★ {product.rating}</span>
                    </div>
                    <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                      <h6 className="fw-semibold text-truncate mb-1">{product.title}</h6>
                    </Link>
                    <p className="small text-secondary mb-2">{product.ageGroup} | {product.brand}</p>
                    <p className="card-text fw-bold text-dark mt-auto mb-3">₹{product.price}</p>
                    <button
                      onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
                      disabled={isOutOfStock}
                      className={`btn ${isOutOfStock ? "btn-secondary disabled" : "btn-dark"} w-100`}
                    >
                      {isOutOfStock ? "Sold Out" : `Add to Cart ${quantityInCart > 0 ? `(${quantityInCart})` : ""}`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Products;
