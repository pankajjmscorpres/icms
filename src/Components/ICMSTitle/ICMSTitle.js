import React from "react";
import { Link } from "react-router-dom";
import "./ICMSTitle.css";
const ICMSTitle = () => {
  return (
    <div>
      <Link to="/" className="home-link">
        <div className="h3 text-center mt-2">
          iCMS - Innovative College Management System
        </div>
      </Link>
    </div>
  );
};

export default ICMSTitle;
