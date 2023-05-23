import axios from "axios";
import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import "./Login.css";
import ICMSTitle from "../ICMSTitle/ICMSTitle";
import Message from "../Message/index";

const LoginForm = () => {
  useDocumentTitle("Login");  
  const navigate = useNavigate();
  // Refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const collegeRoleRef = useRef(null);
  
  // For toast
  const [error, seterror] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let collegeRole = collegeRoleRef["current"].value;
    try {
      const {data} = await axios.post(
        `http://localhost:8002/api/v1/${collegeRole}/auth`,
        {
          email: `${emailRef["current"].value}`,
          password: `${passwordRef["current"].value}`,
        }
      );
      console.log(data);
      console.log('i am here');
      if(data.success===false)
      {
        seterror("Email or Password is wrong !");
        setTimeout(() => seterror(false), 5000);
      }else{
        let icmsUserInfo = JSON.stringify(data);
        if(icmsUserInfo){
          localStorage.setItem("icmsUserInfo", icmsUserInfo);
          // Success :: Redirect to dashboard
          if(collegeRole === "teacher"){
            navigate("/dashboard");
            console.log('ia m on');
          }else{
            navigate("/studentdashboard");
            console.log("Student")
          }
        }
      }
      
    } catch (err) {
      console.log(err);
      seterror(err);
      setTimeout(() => seterror(false), 5000);
    }
  };
  return (
    <div>
      {error && <Message variant={"danger"} style={{ paddingTop: "15px" }}>{error}</Message>}
      {success && (
        <Message variant={"success"}>{successMessage}</Message>
      )}
    {/* <ICMSTitle/> */}
    <h3 className="sidebar-header fw-bold mb-0 py-2 mb-4 text-center">
          <Link to={"/"}>
          <img src='/images/icms-logo.png' alt='logo' style={{ height: '40px', filter: 'invert(1)' }} />
          </Link>
        </h3>

      <h5 style={{ fontWeight: "600" }} className="mb-3 text-center">
        Welcome back! Glad to see you again
      </h5>
      <Form id="login-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-2" controlId="formRoleSelection">
          <Form.Label>Role</Form.Label>
          <Form.Select ref={collegeRoleRef} aria-label="Default select example">
            <option defaultValue value="student">
              Student
            </option>
            <option value="teacher">Teacher</option>
          </Form.Select>
        </Form.Group>

        <Form.Group required className="mb-2" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            ref={emailRef}
            type="email"
            required
            placeholder="Enter email"
            autoComplete="username"
          />
          <Form.Control.Feedback type="invalid">
            Please enter valid email
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            ref={passwordRef}
            type="password"
            required
            placeholder="Password"
            autoComplete="current-password"
          />
        </Form.Group>

        <Button className="lgn-btn" variant="success" type="submit">
          Login
        </Button>

        <hr />
        <p className="text-center fw-bold">Not Registered yet ?</p>
        <Link style={{ textDecoration: "none" }} to="/register">
          <Button className="reg-btn" variant="primary" type="submit">
            Register here
          </Button>
        </Link>
      </Form>
    </div>
  );
};

export default LoginForm;
