import React from "react";
import useDocumentTitle from "../Hooks/useDocumentTitle";
import Image from "react-bootstrap/Image";
import { Button } from "react-bootstrap";
import "./NotFound.css";
import {useNavigate } from "react-router-dom";

const NotFound = () => {
  
  useDocumentTitle("404-Page Not Found");
  const navigate = useNavigate();
  return (
    <div className="text-center">
      <h1 className="fw-bold" style={{fontSize:'3rem'}}>Page Not Found, 🤯</h1>
    
    <Image src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-1932.jpg?w=400
    " />
 

      <Button
        id="go-back-btn"
        className="d-block my-0 mx-auto"
        onClick={() => { navigate("");
        }}
        variant="dark"
      >
        Go Back
      </Button>

      <br />
      <br />
    
        
    </div>
  );
};

export default NotFound;
