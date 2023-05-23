import React, { useState } from "react";
import { useEffect } from "react";
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Container, Nav, Navbar } from "react-bootstrap";
import Message from "../Message/index";
import Profile from "../Profile/Profile";
import "./Dashboard.css";
import { Basic } from "./Basic";
import MyClassroom from "../MyClassroom/MyClassroom";
import MyBranch from "../MyBranch/MyBranch"
import Resources from "../Resources/Resources"
import MarkAttendance from "../MarkAttendance/MarkAttendance"
import dashboardBgImage from "../../assets/images/dashboard-bg.jpg"

const navLinkStyles = {
  textDecoration: 'none',
  color: 'white'
}

const Dashboard = () => {
  const navigate = useNavigate();
  useDocumentTitle("Dashboard");
  const [navTitle, setNavTitle] = useState("Dashboard");
  const icmsUserInfo = JSON.parse(localStorage.getItem("icmsUserInfo"));
  console.log(icmsUserInfo);
    

  const [error, seterror] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    if (icmsUserInfo === null) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("icmsUserInfo");
    navigate("../login");
  }

  return (

    <div
      style={{
        display: "flex",
        height: "100%",
        minHeight: "400px",

        // border: "1px solid black",
      }}
    >
      {error && <Message variant={"danger"}>{error}</Message>}
      {success && (
        <Message variant={"success"}>{successMessage}</Message>
      )}

      <div className="dashboard-left">

        <Sidebar className="dashboard-sidebar">
        <h3 className="sidebar-header fw-bold mb-0 py-2 text-center">
          <img src='/images/icms-logo.png' alt='logo' style={{ height: '40px', filter: 'invert(1)' }} />
        </h3>
          <Menu className="dashboard-menu"  >
            <MenuItem className="menuitem" component={<Link to="" />} onClick={() => setNavTitle("Dashboard")}> Dashboard</MenuItem>
            <MenuItem className="menuitem" component={<Link to="profile" />} onClick={() => setNavTitle("Profile")}> Profile</MenuItem>
            {icmsUserInfo?.data.isSectionHead  && <MenuItem className="menuitem" component={<Link to="MyClassroom" />} onClick={() => setNavTitle("My Classroom")}> My Classroom </MenuItem>}
            {icmsUserInfo?.data.isHod  && <MenuItem className="menuitem" component={<Link to="MyBranch" />} onClick={() => setNavTitle("My Branch")}> My Branch</MenuItem>}
            {icmsUserInfo?.data.isSectionHead  && <MenuItem className="menuitem" component={<Link to="Resources" />} onClick={() => setNavTitle("Resources")}> Resources</MenuItem>}
            {icmsUserInfo?.data.isSectionHead  && <MenuItem className="menuitem" component={<Link to="MarkAttendance" />} onClick={() => setNavTitle("Mark Attendance")}> Mark Attendance</MenuItem>}
          </Menu>
        </Sidebar>

      </div>


      {/* Right side containing Navbar and Content */}

      <div className="dashboard-right">

        <Navbar className="common-navbar" expand="lg">
          <Container className="common-navbar-container">
            <Navbar.Brand style={{ textTransform: 'capitalize' }}>{navTitle}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link className="invisible" as={NavLink} style={navLinkStyles} to="./harshit">Hello</Nav.Link>
                <Nav.Link onClick={handleLogout} className="btn btn-danger me-3" as={NavLink} style={{ textDecoration: 'none', color: 'white', float: 'right', position: 'absolute', right: '0px' }} to="../login">Logout</Nav.Link>
                {/* <Nav.Link><NavLink to="heysujal" >Sujal</NavLink></Nav.Link> */}
                {/* <Nav.Link><Link to="attendence">Attendence</Link></Nav.Link> */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

<div style={{padding: '20px',height:'100%', objectFit:'contain',backgroundRepeat:'repeatX',backgroundPosition:'center', backgroundSize:'cover',backgroundImage: `url(${dashboardBgImage})`}}>

  <Routes >
          <Route index element={<Basic />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/MyClassroom" element={<MyClassroom />} />
          <Route path="/MyBranch" element={<MyBranch />} />
          <Route path="/Resources" element={<Resources />} />
          <Route path="/MarkAttendance" element={<MarkAttendance />} />
          <Route path="*" element={<Navigate to='/notfound' />} />
        </Routes>

</div>
      

      </div>
      {/* <main style={{ padding: 10 }}> Hello I am Dashboard</main> */}
    </div>

  );
};

export default Dashboard;
