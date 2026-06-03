import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleIncrement = (item) => {
    dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }));
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeFromCart(item._id));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-3">Your Cart is Empty</h2>
        <p className="text-secondary mb-4">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn btn-dark px-4 py-2">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <h2 className="fw-bold text-dark mb-4">Shopping Cart</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-3">
            {cartItems.map((item) => (
              <div key={item._id} className="card border-0 shadow-sm rounded-3">
                <div className="card-body d-flex align-items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded"
                    style={{ width: "90px", height: "90px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <Link to={`/product/${item._id}`} className="text-decoration-none text-dark">
                      <h5 className="fw-semibold mb-1">{item.title}</h5>
                    </Link>
                    <span className="badge bg-light text-secondary border mb-2">{item.category}</span>
                    <h6 className="fw-bold text-dark mb-0">₹{item.price} each</h6>
                  </div>
                  
                  {/* Quantity controls */}
                  <div className="d-flex align-items-center gap-2 border rounded-pill px-2 py-1 bg-light">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold"
                    >
                      -
                    </button>
                    <span className="fw-bold px-1" style={{ minWidth: "20px", textAlign: "center" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrement(item)}
                      className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-end ms-3" style={{ minWidth: "100px" }}>
                    <h6 className="fw-bold text-dark mb-1">₹{item.price * item.quantity}</h6>
                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="btn btn-link text-danger p-0 text-decoration-none small fw-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 rounded-3">
            <h4 className="fw-bold mb-4">Summary</h4>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-secondary">Total Items:</span>
              <span className="fw-semibold">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <div className="d-flex justify-content-between border-top pt-3 mb-4">
              <span className="fw-bold fs-5">Total Price:</span>
              <span className="fw-bold fs-5 text-primary">₹{totalPrice}</span>
            </div>
            <button className="btn btn-success w-100 py-2 fw-semibold">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
