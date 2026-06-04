import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const API_URL = import.meta.env.VITE_API_URL || "https://kidskart.onrender.com";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [showPincodeBar, setShowPincodeBar] = useState(true);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products for homepage:", err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { title: "Boy Fashion", emoji: "👦", bg: "#eef2ff", border: "#4f46e5" },
    { title: "Girl Fashion", emoji: "👧", bg: "#fdf2f8", border: "#db2777" },
    { title: "Toys", emoji: "🧸", bg: "#faf5ff", border: "#9333ea" },
    { title: "Baby Gear", emoji: "🎒", bg: "#ecfdf5", border: "#059669" },
    { title: "Feeding & Nursing", emoji: "🍼", bg: "#fffbeb", border: "#d97706" },
    { title: "Bath & Skin", emoji: "🧼", bg: "#f0fdfa", border: "#0d9488" },
  ];

  const brands = [
    { name: "Babyhug", image: "https://cdn.fcglcdn.com/brainbees/images/products/zoom/cucumber-sinker-knit-full-sleeves-frock-with-frill-detailing-and-star-print-pink-18602111zzsq.webp", color: "#e81e63" },
    { name: "Pine Kids", image: "https://cdn.fcglcdn.com/brainbees/images/products/zoom/kuchipoo-cotton-blend-pack-of-5-full-sleeves-solid-tees-red-blue-black-white-and-navy-blue-20215087zzsq.webp", color: "#1a237e" },
    { name: "Ollington St.", image: "https://cdn.fcglcdn.com/brainbees/images/products/zoom/babyhug-cotton-woven-shirt-full-sleeve-mandarin-collar-blue-18-24-months-22190716zzsq.webp", color: "#00acc1" },
    { name: "Honeyhap", image: "https://cdn.fcglcdn.com/brainbees/images/products/zoom/bt-dezines-full-sleeves-abstract-printed-sequined-kurta-pajama-set-turquoise-blue-18739606zzsq.webp", color: "#43a047" },
    { name: "Babyoye", image: "https://cdn.fcglcdn.com/brainbees/images/products/zoom/babyhug-georgette-woven-frill-sleeves-lehenga-choli-and-dupatta-set-with-embroidery-maroon-20472207zzsq.webp", color: "#0d47a1" },
    { name: "Hola Bonita", image: "https://cdn.fcglcdn.com/brainbees/images/products/zoom/hola-bonita-knit-three-fourth-sleeves-solid-color-textured-dress-with-belt-blue-20874359zzsq.webp", color: "#880e4f" },
  ];

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeChecked(true);
      alert(`Success: KidsKart Delivery available to Pincode ${pincode} (Same Day / Next Day Delivery available!)`);
    } else {
      alert("Please enter a valid 6-digit Pincode.");
    }
  };

  const trendingProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  const newArrivals = products.slice(-4);

  return (
    <div className="container-fluid px-0 overflow-hidden" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Dynamic Inline CSS Styles */}
      <style>{`
        @keyframes float-shape {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(255, 130, 0, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(255, 130, 0, 0.8); }
        }
        .hero-banner {
          position: relative;
          min-height: 420px;
          background: linear-gradient(135deg, #e0f7fa 0%, #fff9db 50%, #ffffff 100%);
          border-bottom: 5px solid #ffd200;
        }
        .bg-shape-1 {
          position: absolute;
          width: 250px;
          height: 250px;
          background: rgba(255, 210, 0, 0.2);
          border-radius: 50%;
          top: -50px;
          right: 15%;
          filter: blur(40px);
          animation: float-shape 8s ease-in-out infinite;
          z-index: 1;
        }
        .bg-shape-2 {
          position: absolute;
          width: 300px;
          height: 300px;
          background: rgba(0, 162, 232, 0.15);
          border-radius: 50%;
          bottom: -80px;
          left: 5%;
          filter: blur(50px);
          animation: float-shape 11s ease-in-out infinite alternate;
          z-index: 1;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 20px;
        }
        .category-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.8rem;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
        }
        .category-item:hover .category-avatar {
          transform: scale(1.15) rotate(5deg);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
        }
        .btn-pulse {
          animation: pulse-glow 3s infinite;
          background-color: #ff8200;
          border-color: #ff8200;
          color: white;
        }
        .btn-pulse:hover {
          background-color: #e06d00 !important;
          border-color: #e06d00 !important;
        }
        .hover-card-premium {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          border-radius: 16px !important;
          overflow: hidden;
        }
        .hover-card-premium:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
        }
        .brand-circle-card {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto;
          border: 4px solid #fff;
          box-shadow: 0 6px 12px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }
        .brand-circle-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.4s ease;
        }
        .brand-item:hover .brand-circle-card {
          transform: scale(1.1) translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        .brand-item:hover .brand-circle-card img {
          transform: scale(1.08);
        }
        .highlight-badge {
          background: linear-gradient(45deg, #ff8200, #ffc107);
          color: white;
          font-weight: 700;
          border-radius: 30px;
          padding: 6px 16px;
        }
        .feature-icon-box {
          width: 60px;
          height: 60px;
          background: rgba(255, 130, 0, 0.1);
          color: #ff8200;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          margin-bottom: 15px;
        }
      `}</style>

      {/* 1. Large Premium Animated Hero Banner */}
      <div className="hero-banner d-flex align-items-center py-5">
        <div className="bg-shape-1"></div>
        <div className="bg-shape-2"></div>
        <div className="container-fluid px-5 position-relative" style={{ zIndex: 5 }}>
          <div className="row align-items-center">
            <div className="col-12 col-md-7 text-center text-md-start">
              <span className="badge bg-dark text-white fw-bold px-3 py-2 rounded-pill mb-3 uppercase shadow-sm" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
                ✨ PREMIUM KIDS STORE
              </span>
              <h1 className="display-3 fw-black text-dark mb-1" style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontWeight: 900 }}>
                Soft as a Hug,
              </h1>
              <h2 className="display-4 fw-bold mb-3" style={{ color: "#ff8200" }}>
                Light as a Summer Breeze
              </h2>
              <p className="fs-3 fw-bold text-secondary mb-4">
                Explore premium collections starting from <span className="highlight-badge">₹149</span>
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start align-items-center mb-4">
                <span className="bg-white text-dark px-3 py-2 rounded-pill border fw-bold small shadow-sm">
                  🎟️ COUPON: <strong className="text-warning">KIDSKART10</strong>
                </span>
                <span className="text-muted small fw-semibold">
                  Get Extra 10% OFF on all items!
                </span>
              </div>
              <Link to="/products" className="btn btn-pulse btn-lg px-5 py-3 fw-bold rounded-pill shadow-lg">
                SHOP THE COLLECTION →
              </Link>
            </div>
            <div className="col-12 col-md-5 d-none d-md-block text-center position-relative">
              <div className="glass-card p-3 shadow-lg d-inline-block rotate-3d" style={{ transform: "rotate(3deg)", transition: "all 0.5s ease" }}>
                <img 
                  src="https://cdn.fcglcdn.com/brainbees/images/products/zoom/cucumber-sinker-knit-full-sleeves-frock-with-frill-detailing-and-star-print-pink-18602111zzsq.webp" 
                  alt="Premium Frock" 
                  className="img-fluid rounded-4 shadow-sm"
                  style={{ maxHeight: "320px", width: "auto" }}
                />
                <div className="mt-3 text-center">
                  <span className="fw-bold text-dark d-block">Premium Cotton Wear</span>
                  <span className="text-warning fw-bold">★ 4.8 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-5">
        
        {/* 2. Shop By Category List */}
        <div className="mb-5 py-3">
          <h3 className="fw-bold text-dark text-center mb-1" style={{ letterSpacing: "-0.5px" }}>SHOP BY CATEGORY</h3>
          <p className="text-muted text-center mb-5">Carefully selected items grouped by categories</p>
          <div className="row g-4 justify-content-center">
            {categories.map((cat, idx) => (
              <div key={idx} className="col-6 col-sm-4 col-md-2 category-item text-center">
                <Link to={`/products?category=${encodeURIComponent(cat.title)}`} className="text-decoration-none d-inline-block">
                  <div className="category-avatar mb-3" style={{ backgroundColor: cat.bg, border: `2px dashed ${cat.border}` }}>
                    {cat.emoji}
                  </div>
                  <h6 className="fw-bold text-dark small m-0 uppercase" style={{ letterSpacing: "0.5px" }}>{cat.title}</h6>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Creative Budget Store Section */}
        <div className="p-5 rounded-4 mb-5 text-center text-white shadow" style={{ background: "linear-gradient(135deg, #1cc88a 0%, #17a2b8 100%)", position: "relative", overflow: "hidden" }}>
          <div className="position-absolute" style={{ width: "150px", height: "150px", background: "rgba(255,255,255,0.08)", borderRadius: "50%", top: "-30px", right: "-30px" }}></div>
          <div className="position-absolute" style={{ width: "200px", height: "200px", background: "rgba(255,255,255,0.05)", borderRadius: "50%", bottom: "-50px", left: "-50px" }}></div>
          
          <h2 className="fw-bold mb-2">🎈 POCKET-FRIENDLY SUPERSTORE 🎈</h2>
          <p className="lead mb-4">High-quality baby products at prices that make you smile!</p>
          <div className="row g-3 justify-content-center position-relative" style={{ zIndex: 2 }}>
            <div className="col-6 col-md-3">
              <Link to="/products?maxPrice=249" className="btn btn-light w-100 py-3 rounded-pill fw-bold text-success shadow hover-card-premium" style={{ border: "2px solid transparent" }}>
                UNDER ₹249
              </Link>
            </div>
            <div className="col-6 col-md-3">
              <Link to="/products?maxPrice=449" className="btn btn-light w-100 py-3 rounded-pill fw-bold text-info shadow hover-card-premium" style={{ border: "2px solid transparent" }}>
                UNDER ₹449
              </Link>
            </div>
            <div className="col-6 col-md-3">
              <Link to="/products?maxPrice=749" className="btn btn-light w-100 py-3 rounded-pill fw-bold text-dark shadow hover-card-premium" style={{ border: "2px solid transparent" }}>
                UNDER ₹749
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Must-Have Brand Specials */}
        <div className="mb-5 py-3">
          <h3 className="fw-bold text-center mb-1">MUST-HAVE BRAND SPECIALS</h3>
          <p className="text-muted text-center mb-5">Top brands trusted by millions of Indian parents</p>
          <div className="row g-4 justify-content-center">
            {brands.map((brand, idx) => (
              <div key={idx} className="col-6 col-sm-4 col-md-2 brand-item text-center">
                <Link to={`/products?search=${encodeURIComponent(brand.name)}`} className="text-decoration-none">
                  <div className="brand-circle-card mb-3" style={{ border: `4px solid ${brand.color}` }}>
                    <img src={brand.image} alt={brand.name} />
                  </div>
                  <span className="fw-bold text-dark d-block small uppercase" style={{ letterSpacing: "0.5px" }}>{brand.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <h5 className="mt-3 text-muted">Loading product highlights...</h5>
          </div>
        ) : (
          <>
            {/* 5. Trending Products */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h3 className="fw-bold text-dark m-0">🔥 Trending This Week</h3>
                <Link to="/products" className="text-decoration-none text-warning fw-bold small">
                  View All Products →
                </Link>
              </div>
              <div className="row g-4">
                {trendingProducts.map((product) => {
                  const cartItem = cartItems.find((item) => item._id === product._id);
                  const quantityInCart = cartItem ? cartItem.quantity : 0;
                  const isOutOfStock = product.stock === 0;

                  return (
                    <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      <div className="card h-100 border-0 shadow-sm position-relative hover-card-premium">
                        {isOutOfStock && (
                          <span className="position-absolute top-0 start-0 badge bg-danger m-2 px-2 py-1" style={{ zIndex: 10 }}>
                            Out Of Stock
                          </span>
                        )}
                        <Link to={`/product/${product._id}`}>
                          <img
                            src={product.image}
                            className="card-img-top"
                            alt={product.title}
                            style={{ height: "240px", objectFit: "cover" }}
                          />
                        </Link>
                        <div className="card-body d-flex flex-column p-3">
                          <div className="mb-2">
                            <span className="badge bg-light text-secondary border">{product.category}</span>
                            <span className="badge bg-warning text-dark ms-2">★ {product.rating}</span>
                          </div>
                          <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                            <h6 className="fw-semibold text-truncate mb-1">{product.title}</h6>
                          </Link>
                          <p className="small text-secondary mb-2">{product.brand}</p>
                          <p className="card-text fw-bold text-dark mt-auto mb-3" style={{ fontSize: "1.1rem" }}>₹{product.price}</p>
                          <button
                            onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
                            disabled={isOutOfStock}
                            className={`btn ${isOutOfStock ? "btn-secondary disabled" : "btn-warning text-white"} w-100 fw-bold`}
                            style={!isOutOfStock ? { backgroundColor: "#ff8200", borderColor: "#ff8200" } : {}}
                          >
                            {isOutOfStock ? "Sold Out" : `Add to Cart ${quantityInCart > 0 ? `(${quantityInCart})` : ""}`}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. New Arrivals */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h3 className="fw-bold text-dark m-0">🆕 Fresh Arrivals</h3>
                <Link to="/products" className="text-decoration-none text-warning fw-bold small">
                  View All Products →
                </Link>
              </div>
              <div className="row g-4">
                {newArrivals.map((product) => {
                  const cartItem = cartItems.find((item) => item._id === product._id);
                  const quantityInCart = cartItem ? cartItem.quantity : 0;
                  const isOutOfStock = product.stock === 0;

                  return (
                    <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      <div className="card h-100 border-0 shadow-sm position-relative hover-card-premium">
                        {isOutOfStock && (
                          <span className="position-absolute top-0 start-0 badge bg-danger m-2 px-2 py-1" style={{ zIndex: 10 }}>
                            Out Of Stock
                          </span>
                        )}
                        <Link to={`/product/${product._id}`}>
                          <img
                            src={product.image}
                            className="card-img-top"
                            alt={product.title}
                            style={{ height: "240px", objectFit: "cover" }}
                          />
                        </Link>
                        <div className="card-body d-flex flex-column p-3">
                          <div className="mb-2">
                            <span className="badge bg-light text-secondary border">{product.category}</span>
                            <span className="badge bg-warning text-dark ms-2">★ {product.rating}</span>
                          </div>
                          <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                            <h6 className="fw-semibold text-truncate mb-1">{product.title}</h6>
                          </Link>
                          <p className="small text-secondary mb-2">{product.brand}</p>
                          <p className="card-text fw-bold text-dark mt-auto mb-3" style={{ fontSize: "1.1rem" }}>₹{product.price}</p>
                          <button
                            onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
                            disabled={isOutOfStock}
                            className={`btn ${isOutOfStock ? "btn-secondary disabled" : "btn-warning text-white"} w-100 fw-bold`}
                            style={!isOutOfStock ? { backgroundColor: "#ff8200", borderColor: "#ff8200" } : {}}
                          >
                            {isOutOfStock ? "Sold Out" : `Add to Cart ${quantityInCart > 0 ? `(${quantityInCart})` : ""}`}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* 7. Why Parents Love KidsKart Infographics */}
        <div className="py-5 border-top mt-5">
          <h3 className="fw-bold text-dark text-center mb-5" style={{ letterSpacing: "-0.5px" }}>Why Parents Choose KidsKart</h3>
          <div className="row g-4 text-center">
            <div className="col-12 col-md-3">
              <div className="d-flex flex-column align-items-center p-3">
                <div className="feature-icon-box">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h5 className="fw-bold text-dark">100% Safe Products</h5>
                <p className="text-secondary small">All products pass multiple layers of quality audits and security testing.</p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="d-flex flex-column align-items-center p-3">
                <div className="feature-icon-box" style={{ background: "rgba(0,162,232,0.1)", color: "#00a2e8" }}>
                  <i className="bi bi-truck"></i>
                </div>
                <h5 className="fw-bold text-dark">Super Fast Delivery</h5>
                <p className="text-secondary small">Same Day & Next Day delivery timeline option available to select pincodes.</p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="d-flex flex-column align-items-center p-3">
                <div className="feature-icon-box" style={{ background: "rgba(40,167,69,0.1)", color: "#28a745" }}>
                  <i className="bi bi-tags"></i>
                </div>
                <h5 className="fw-bold text-dark">Best Brand Rates</h5>
                <p className="text-secondary small">Get direct-to-parent pricing and coupon rates from official partner brands.</p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="d-flex flex-column align-items-center p-3">
                <div className="feature-icon-box" style={{ background: "rgba(220,53,69,0.1)", color: "#dc3545" }}>
                  <i className="bi bi-arrow-counterclockwise"></i>
                </div>
                <h5 className="fw-bold text-dark">Easy Return Policy</h5>
                <p className="text-secondary small">Hassle-free 7-day pickup and immediate exchange policy for all items.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 8. Sticky Bottom Pincode Bar */}
      {showPincodeBar && (
        <div 
          className="position-fixed bottom-0 start-50 translate-middle-x bg-white border shadow-lg py-3 px-4 w-100 d-flex flex-wrap justify-content-between align-items-center gap-3" 
          style={{ zIndex: 2000, borderTop: "3px solid #ff8200", maxWidth: "900px", borderRadius: "10px 10px 0 0" }}
        >
          <div className="d-flex align-items-center gap-2">
            <span className="fs-5 text-warning fw-bold"><i className="bi bi-gift-fill me-1"></i></span>
            <div className="small">
              <span className="fw-bold text-dark d-block">KidsKart Happiness now delivered the "SAME DAY & NEXT DAY".</span>
              <span className="text-secondary">Just enter your Pincode and see delivery timelines on product pages.</span>
            </div>
          </div>
          <form onSubmit={handlePincodeCheck} className="d-flex align-items-center gap-2">
            <input 
              type="text" 
              className="form-control form-control-sm text-center" 
              placeholder="Enter Pincode" 
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              style={{ width: "130px", height: "35px" }}
              required
            />
            <button type="submit" className="btn btn-secondary btn-sm px-3 fw-bold" style={{ backgroundColor: "#828c96", borderColor: "#828c96", height: "35px" }}>
              CHECK
            </button>
            <button 
              type="button" 
              onClick={() => setShowPincodeBar(false)} 
              className="btn btn-link text-secondary p-0 ms-2"
            >
              <i className="bi bi-x-lg fs-5"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
