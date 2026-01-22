import React from "react";
import { Link } from "react-router-dom";
import busLogo from "../assets/images/bus.png";


const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-warning px-4">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={busLogo} alt="logo" width="60" />
          <div>
            <strong>Safari Travels</strong>
            <div className="small">Enjoy Travelling with us</div>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto gap-3">
            <li className="nav-item"><Link className="nav-link text-dark" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link text-dark" to="/about">About Us</Link></li>
            <li className="nav-item"><Link className="nav-link text-dark" to="/contact">Contact Us</Link></li>
            <li className="nav-item"><Link className="nav-link text-dark" to="/account">Account</Link></li>
            <li className="nav-item"><Link className="nav-link text-dark" to="/login">Create Account</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
