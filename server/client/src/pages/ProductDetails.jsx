import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch product details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark" role="status"></div>
        <h4 className="mt-3">Loading details...</h4>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-5">
        <h3 className="text-danger">Product not found</h3>
        <Link to="/products" className="btn btn-outline-secondary mt-3">Back to products</Link>
      </div>
    );
  }

  const cartItem = cartItems.find((item) => item._id === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock === 0;

  // Compile specifications cleanly
  const getSpecifications = () => {
    let material = "Premium Kid-safe Quality Material";
    switch (product.category) {
      case "Baby Wear":
        material = "100% Organic Breathable Cotton";
        break;
      case "Footwear":
        material = "Croslite EVA Foam (Waterproof)";
        break;
      case "Toys":
        material = "Non-Toxic ABS Plastic / Soft Plush";
        break;
      case "School Essentials":
        material = "Water-resistant Canvas/Polyester";
        break;
    }
    return {
      Brand: product.brand || "KidsKart Essentials",
      "Age Group": product.ageGroup || "All ages",
      Material: material,
      "Stock Count": isOutOfStock ? "Out of Stock" : `${product.stock} items left`,
      Rating: `★ ${product.rating} / 5.0`
    };
  };

  const specs = getSpecifications();

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card border-0 shadow-sm overflow-hidden rounded-3">
            <div className="row g-0">
              <div className="col-md-6">
                <img
                  src={product.image}
                  alt={product.title}
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: "cover", minHeight: "380px", maxHeight: "500px" }}
                />
              </div>
              <div className="col-md-6 p-4 d-flex flex-column justify-content-center">
                <div className="mb-2">
                  <span className="badge bg-light text-secondary border">{product.category}</span>
                  <span className="badge bg-warning text-dark ms-2">★ {product.rating}</span>
                </div>
                <h2 className="card-title fw-bold text-dark mb-2">{product.title}</h2>
                <h3 className="text-dark fw-bold mb-3">₹{product.price}</h3>
                <p className="card-text text-secondary mb-4 small" style={{ lineHeight: "1.6" }}>
                  {product.description}
                </p>

                {/* Extended Specifications List */}
                <div className="bg-light p-3 rounded mb-4">
                  <h6 className="fw-bold mb-2">Product Specifications:</h6>
                  <ul className="list-unstyled mb-0 small">
                    {Object.entries(specs).map(([key, val]) => (
                      <li key={key} className="mb-1">
                        <strong className="text-secondary">{key}:</strong> {val}
                      </li>
                    ))}
                  </ul>
                </div>

                {isOutOfStock ? (
                  <div className="alert alert-danger py-2 text-center fw-bold rounded mb-4">
                    This item is currently out of stock.
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <label className="form-label mb-0 fw-semibold small text-secondary">Qty:</label>
                    <select
                      className="form-select shadow-sm"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      style={{ width: "80px" }}
                    >
                      {/* Only allow selecting quantity up to available stock or max 5 */}
                      {Array.from({ length: Math.min(product.stock, 5) }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => dispatch(addToCart({ product, quantity }))}
                      className="btn btn-dark flex-grow-1 py-2 fw-semibold"
                    >
                      Add to Cart {quantityInCart > 0 && `(${quantityInCart})`}
                    </button>
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-2 border-top pt-3">
                  <Link to="/products" className="text-decoration-none text-secondary small fw-semibold">
                    ← Back to products
                  </Link>
                  <Link to="/cart" className="btn btn-outline-dark btn-sm px-3 fw-semibold">
                    Go to Cart →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
