import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaTrophy } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const toggleBtnRef = useRef(null);

    const navItems = [
        { path: "about", label: "About" },
        { path: "projects", label: "Projects" },
        { path: "skills", label: "Skills" },
        { path: "studymaterial", label: "Study Material" },
        {
            path: "achievements",
            label: "Achievements",
            icon: <FaTrophy className="text-yellow-500" />,
        },
        { path: "contact", label: "Contact" },
    ];

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    // ESC key closes menu
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isMenuOpen) {
                e.preventDefault();
                setIsMenuOpen(false);
                toggleBtnRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMenuOpen]);

    // Click outside closes menu
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                isMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                !toggleBtnRef.current.contains(e.target)
            ) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    // Focus trap for mobile menu
    useEffect(() => {
        if (!isMenuOpen) return;

        const selectors =
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const elements = menuRef.current?.querySelectorAll(selectors);
        const first = elements[0];
        const last = elements[elements.length - 1];

        first?.focus();

        const trap = (e) => {
            if (e.key !== "Tab") return;

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        menuRef.current?.addEventListener("keydown", trap);
        return () => menuRef.current?.removeEventListener("keydown", trap);
    }, [isMenuOpen]);

    const menuVariants = {
        hidden: { opacity: 0, y: -10, pointerEvents: "none" },
        visible: {
            opacity: 1,
            y: 0,
            pointerEvents: "auto",
            transition: { duration: 0.2 },
        },
        exit: { opacity: 0, y: -10, pointerEvents: "none", transition: { duration: 0.15 } },
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav
                className="container mx-auto flex justify-between items-center p-4"
                aria-label="Main navigation"
            >
                {/* Logo */}
                <NavLink
                    to="/"
                    className="text-xl font-bold text-blue-600 hover:text-blue-700 flex items-center"
                >
                    <span className="hidden sm:inline">Deepak Kushwah</span>
                    <span className="sm:hidden">DK</span>
                </NavLink>

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-6">
                    {navItems.map(({ path, label, icon }) => (
                        <NavLink
                            key={path}
                            to={`/${path}`}
                            className={({ isActive }) =>
                                `flex items-center gap-1 ${isActive
                                    ? "text-blue-600 font-medium border-b-2 border-blue-600"
                                    : "text-gray-700 hover:text-blue-600 transition"
                                }`
                            }
                        >
                            {icon} {label}
                        </NavLink>
                    ))}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    ref={toggleBtnRef}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                    className="md:hidden text-gray-700 focus:outline-none"
                >
                    {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                </button>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            ref={menuRef}
                            id="mobile-menu"
                            role="menu"
                            tabIndex={-1}
                            className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-6 rounded-b-lg"
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex flex-col space-y-4">
                                {navItems.map(({ path, label, icon }) => (
                                    <NavLink
                                        key={path}
                                        to={`/${path}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 ${isActive
                                                ? "text-blue-600 font-medium"
                                                : "text-gray-700 hover:text-blue-600 transition"
                                            }`
                                        }
                                        role="menuitem"
                                    >
                                        {icon} {label}
                                    </NavLink>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default Header;
