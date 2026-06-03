import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-top py-4 mt-5 shadow-sm">
      <div className="container-fluid px-4">
        <div className="row align-items-center justify-content-between">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <span className="fw-bold text-dark fs-5">KidsKart</span>
            <p className="text-secondary small mb-0 mt-1">
              &copy; {new Date().getFullYear()} KidsKart. All rights reserved. Made for parents who care.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <Link to="/products" className="text-secondary small text-decoration-none fw-semibold">
                Products
              </Link>
              <Link to="/cart" className="text-secondary small text-decoration-none fw-semibold">
                Cart
              </Link>
              <Link to="/login" className="text-secondary small text-decoration-none fw-semibold">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
