
import React, {useState, useEffect, useRef} from 'react';
import { Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

export const Navbar = () => {
    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
            <Link className="navbar-brand" to="#">EDGE STABLE COIN</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/home">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/new_token">Create New Token</Link>
                </li>
            </ul>
            </div>
        </div>
        </nav>
        <ToastContainer
            position="top-right"
            autoClose={15000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
        </>
    )
}
