import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const { search: urlSearch, pathname } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  useEffect(() => {
    const queryParams = new URLSearchParams(urlSearch);
    setSearchQuery(queryParams.get("search") || "");
  }, [urlSearch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    // If we are already on the products page, search live on keystroke
    if (pathname === "/products") {
      const queryParams = new URLSearchParams(urlSearch);
      if (!value.trim()) {
        queryParams.delete("search");
      } else {
        queryParams.set("search", value);
      }
      navigate(`/products?${queryParams.toString()}`, { replace: true });
    }
  };

  return (
    <header className="bg-white">
      {/* Row 1: Top Utility bar */}
      <div className="border-bottom py-1 bg-light" style={{ fontSize: "0.75rem" }}>
        <div className="container-fluid px-4 d-flex justify-content-between text-secondary">
          <div>
            <span className="me-3 cursor-pointer"><i className="bi bi-geo-alt-fill text-danger me-1"></i>Select location</span>
            <span className="me-3">Stores & Preschools</span>
            <span>Support</span>
          </div>
          <div>
            <span className="me-3">Track Order</span>
            <span className="me-3">Shortlist</span>
            <span>Club</span>
          </div>
        </div>
      </div>

      {/* Row 2: Main Brand & Search */}
      <div className="py-3 border-bottom">
        <div className="container-fluid px-4 d-flex align-items-center justify-content-between gap-3">
          {/* Logo with colorful letters */}
          <Link className="d-flex align-items-center text-decoration-none" to="/">
            <span style={{ fontSize: "1.8rem", fontWeight: "900", letterSpacing: "-1px" }}>
              <span style={{ color: "#ff8200" }}>Kids</span>
              <span style={{ color: "#00a2e8" }}>Kart</span>
              <span style={{ color: "#00c222", fontSize: "0.8rem", fontWeight: "bold" }}>.com</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-grow-1 mx-md-5" style={{ maxWidth: "600px" }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control rounded-start-pill px-4 border-end-0"
                placeholder="Search for a Category, Brand or Product"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ borderColor: "#ff8200", height: "42px" }}
              />
              <button 
                type="submit" 
                className="btn btn-warning rounded-end-pill px-4 border-start-0" 
                style={{ backgroundColor: "#ff8200", borderColor: "#ff8200", color: "#white" }}
              >
                <i className="bi bi-search text-white"></i>
              </button>
            </div>
          </form>

          {/* Cart & Login Controls */}
          <div className="d-flex align-items-center gap-4">
            {token ? (
              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary small fw-semibold">Hi, {user?.name || "User"}</span>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                  Logout
                </button>
              </div>
            ) : (
              <Link className="text-dark small text-decoration-none fw-bold" to="/login">
                Login / Register
              </Link>
            )}

            {/* Cart Link with Badge */}
            <Link className="nav-link text-dark fw-bold position-relative d-flex align-items-center gap-2" to="/cart">
              <div className="position-relative">
                <i className="bi bi-cart3 fs-4 text-secondary"></i>
                {cartItems.length > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.65rem", padding: "0.25em 0.4em" }}
                  >
                    {cartItems.length}
                  </span>
                )}
              </div>
              <span className="d-none d-sm-inline text-secondary small">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: Yellow Menu Bar */}
      <div style={{ backgroundColor: "#ffd200" }} className="py-2 shadow-sm">
        <div className="container-fluid px-4">
          <div className="d-flex flex-wrap align-items-center gap-4 fw-bold text-dark uppercase" style={{ fontSize: "0.85rem" }}>
            <span className="text-decoration-none text-dark cursor-pointer d-flex align-items-center">
              ALL CATEGORIES <i className="bi bi-chevron-down ms-1"></i>
            </span>
            <Link to="/products?category=Boy+Fashion" className="text-decoration-none text-dark hover-menu">BOY FASHION</Link>
            <Link to="/products?category=Girl+Fashion" className="text-decoration-none text-dark hover-menu">GIRL FASHION</Link>
            <Link to="/products?category=Toys" className="text-decoration-none text-dark hover-menu">TOYS</Link>
            <Link to="/products?category=Baby+Gear" className="text-decoration-none text-dark hover-menu">BABY GEAR</Link>
            <Link to="/products?category=Feeding+%26+Nursing" className="text-decoration-none text-dark hover-menu">FEEDING</Link>
            <Link to="/products?category=Bath+%26+Skin" className="text-decoration-none text-dark hover-menu">BATH</Link>
            <span className="ms-auto text-danger fw-bold cursor-pointer"><i className="bi bi-heart-fill me-1"></i>Shortlist</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
