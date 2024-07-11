import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

 
const Navbar = () => {
    return (
        <>
            <nav>
                    <NavLink to="/home" >
                        Home
                    </NavLink>
                    <NavLink to="/CrawlLinks" >
                        Crawl-Links
                    </NavLink>
                    <NavLink to="/CrawlImages" >
                        Crawl-Images
                    </NavLink>
                    </nav>
        </>
    );
};
 
export default Navbar;