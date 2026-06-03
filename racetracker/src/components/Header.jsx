import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const PAGES = [
    { path: '/', label: 'Home' },
]

export default function Header() {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const location = useLocation()

    useEffect(() => {
        function onClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [])

    return (
        <header className="header-wrapper">
            <nav className="header">
                <div className="nav-container">

                    {/* Brand */}
                    <div className="brand">
                        Race Tracker
                    </div>

                    {/* TODO: Decide if this is needed */}
                    {/* Menu */}
                    {/* <div className="menu" ref={ref}>
                        <button
                            className="menu-btn"
                            onClick={() => setOpen(v => !v)}
                        >
                            Menu
                        </button>

                        {open && (
                            <div className="dropdown">
                                {PAGES.map(page => (
                                    <Link
                                        key={page.path}
                                        to={page.path}
                                        className={`dropdown-item ${location.pathname === page.path ? 'active' : ''
                                            }`}
                                        onClick={() => setOpen(false)}
                                    >
                                        {page.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div> */}

                </div>
            </nav>
        </header>
    )
}