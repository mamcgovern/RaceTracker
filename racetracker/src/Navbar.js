import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = () => {
    return (
        <div>
            <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark" aria-label="Thirteenth navbar example">
                <div class="container-fluid">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample11" aria-controls="navbarsExample11" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse d-lg-flex justify-content-lg-center" id="navbarsExample11">
                        <a class="navbar-brand col-lg-3 me-0 nulshock" href="/">Hyperfixations Calendar</a>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
