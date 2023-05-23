import React, { useEffect, useState } from "react";
import { useRef } from "react";
import axios from 'axios';
import { Button, Form, Modal, Row, Col, Image, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import ICMSTitle from "../ICMSTitle/ICMSTitle";
import "./Register.css";
import CloudinaryUploadWidget from "../CloudinaryWidget/CloudinaryUploadWidget";
import CloudinaryIdCardWidget from "../CloudinaryWidget/CloudinaryIdCardWidget";
import { FaTimesCircle } from "react-icons/fa"
import Message from "../Message/index";


const Register = () => {
  useDocumentTitle("Register");
  const navigate = useNavigate();
  // Referenced Variables
  const [firstNameState, setFirstNameState] = useState(null);
  const [lastNameState, setLastNameState] = useState(null);
  const [emailState, setEmailState] = useState(null);
  const [passwordState, setPasswordState] = useState(null);
  const [branchState, setBranchState] = useState(null);
  const [collegeId, setCollegeId] = useState(null);
  const [yearState, setYearsState] = useState(null);
  const [sectionState, setSectionState] = useState(null);
  const [universityRollNumberState, setUniversityRollNumberState] = useState(null);
  const [admissionNumberState, setAdmissionNumberState] = useState(null);
  // let regForm = document.querySelector("#reg-form");
  // let modalForm = document.querySelector("#checkModal");

  // For modal
  const [show, setShow] = useState(false);
  const [collegeRole, setCollegeRole] = useState("student");

  // For toast
  const [error, seterror] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  //page counter
  const [pageNumber, setPageNumber] = useState(0);
  const [uploadedUserImages, setUploadedUserImages] = useState([]);

  const [branchList, setBranchList] = useState(null);
// to enable and disable next button
  const [canGoNext, setCanGoNext] = useState(false)
  useEffect(() => {
    const getBranchList = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8002/api/v1/admin/get-branch-list`);

        if (data && data.success) {
          // setSuccess(true);
          setBranchList(data.data.branchList);
          console.log(branchList, "Branch LIST");
        }
      } catch (e) {
        console.log(e, "e");
        seterror(e.response.data.msg);
        setTimeout(() => seterror(null), 3000);
      }
    };

    getBranchList();


    // adding event listener to the document.
    document.addEventListener("keyup",(e)=>{

    })

  }, []);

  useEffect(()=>{
    let res = false;
    // email validation
    let emailRes = emailState!==null && emailState!=='' && emailState?.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    let passwordRes = passwordState!==null && passwordState!=='';
    let firstNameRes = firstNameState!==null && firstNameState!=='';
    let lastNameRes = lastNameState!==null && lastNameState!=='';    
    let branchStateRes = branchState!==null && branchState!=='';
    let yearStateRes = yearState!==null && yearState!=='';
    let admissionNumberStateRes = admissionNumberState!==null && admissionNumberState!=='';
    let universityRollNumberStateRes = universityRollNumberState!==null && universityRollNumberState!=='';
    let sectionStateRes = sectionState!==null && sectionState!=='';
    let collegeIdRes =  collegeId!==null && collegeId!=='';
    res = emailRes && passwordRes && firstNameRes && lastNameRes && branchStateRes && yearStateRes && admissionNumberStateRes && universityRollNumberStateRes && sectionStateRes && collegeIdRes;
    if(pageNumber===0){
      let nextBtn = document.querySelector(".next-btn");
      if(res){
        nextBtn?.classList.add("btn-success");
      }else{
        nextBtn?.classList.remove("btn-success");
      }
      setCanGoNext(res);    
    }
}, [firstNameState,lastNameState,emailState,passwordState,branchState,yearState,sectionState,universityRollNumberState,collegeId,admissionNumberState])

  async function handleOnUpload(error, result, widget) {
    if (error) {
      seterror(error);
      setTimeout(() => seterror(null), 3000);
      console.log(error, "img upload error");
      widget.close({
        quiet: true
      });
      return;
    }
    console.log(result?.info?.secure_url, "img url");
    let currUrl = await result?.info?.secure_url;

    await setUploadedUserImages(uploadedUserImages => [...uploadedUserImages, currUrl])

    setSuccess(true);
    setSuccessMessage("Your images uploaded successfully!");
    setTimeout(() => setSuccess(false), 5000);
  }

  async function handleOnIdCardUpload(error, result, widget) {
    if (error) {
      seterror(error);
      setTimeout(() => seterror(null), 3000);
      console.log(error, "img upload error");
      widget.close({
        quiet: true
      });
      return;
    }
    console.log(result?.info?.secure_url, "img url");
    let currUrl = await result?.info?.secure_url;
    await setCollegeId(currUrl);

    setSuccess(true);
    setSuccessMessage("ID card uploaded successfully!");
    setTimeout(() => setSuccess(false), 5000);
  }

  function removeThisImg(url) {
    console.log("remove triggered");
    let uploadedImgCopy = uploadedUserImages.filter(img => img != url);
    setUploadedUserImages(uploadedImgCopy);
  }

  // This should be false for first time when user checks the data
  // And also if after checking the data he makes any change
  const handleClose = () => {
    setShow(false);
  };

  const [sectionsAvailable, setSectionsAvailable] = useState([]);

  const fetchSectionData = async (branchVal, yearVal) => {
    try {
      console.log(branchVal, yearVal)
      const sectionData = await axios.get(`http://localhost:8002/api/v1/hod/get-list-section?branchName=${branchVal}`)
      console.log(sectionData, "sectionData");
      if (sectionData) {
        if (yearVal == 1)
          setSectionsAvailable(sectionData.data.firstYear)
        else if (yearVal == 2)
          setSectionsAvailable(sectionData.data.secondYear)
        else if (yearVal == 3)
          setSectionsAvailable(sectionData.data.thirdYear)
        else if (yearVal == 4)
          setSectionsAvailable(sectionData.data.fourthYear)
      }
    }
    catch (err) {
      console.log(err)
    }
    console.log(sectionsAvailable, "sections available");
  }

  useEffect(() => {
    fetchSectionData(branchState, yearState);
    console.log(sectionsAvailable, "sections available useEffect");
  }, [])

  function handleSubmit(e) {
    e.preventDefault();
    setShow(true);
    // console.log(yearRef.current?.selectedOptions[0].innerText)
  }

  const onProceed = async () => {
    // make a post request
    let details;
    if (collegeRole === "teacher") {
      details = {
        firstName: firstNameState,
        lastName: lastNameState,
        email: emailState,
        password: passwordState,
        branchName: branchState,
        collegeIdCard: collegeId
      }
    } else {
      details = {
        email: emailState,
        password: passwordState,
        firstName: firstNameState,
        lastName: lastNameState,
        branchName: branchState,
        year: yearState,
        sectionRef: sectionState,
        collegeIdCard: collegeId,
        admissionNumber: admissionNumberState,
        universityRollNumber: universityRollNumberState,
        images : uploadedUserImages
      }
    }

    try {

      console.log(details);
      const { data } = await axios.post(`http://localhost:8002/api/v1/${collegeRole}/register`, details);

      console.log(data);
      let icmsUserInfo = JSON.stringify(data);
      localStorage.setItem('icmsUserInfo', icmsUserInfo);
      // Success :: Redirect to dashboard
      if (collegeRole === "teacher") {
        navigate("/dashboard");
      } else {

        navigate("/studentdashboard")
      }

    } catch (e) {
      console.log(e);
      seterror(e.response.data.msg);
      setTimeout(() => seterror(null), 3000);
    }
  };


  return (
    <div>
      {error && <Message variant={"danger"} style={{ paddingTop: "15px" }}>{error}</Message>}
      {success && (
        <Message variant={"success"}>{successMessage}</Message>
      )}
      {/* <ICMSTitle /> */}
      <h3 className="sidebar-header fw-bold mb-0 py-2 mb-4 text-center">
        <Link to={"/"}>
          <img src='/images/icms-logo.png' alt='logo' style={{ height: '40px', filter: 'invert(1)' }} />
        </Link>
      </h3>
      <Form onSubmit={handleSubmit} id="reg-form">
        <h4 style={{ fontWeight: "600" }} className="text-muted">
          Register
        </h4>

        {
          (pageNumber == 0) &&
          <>
            <Form.Group className="mb-2" controlId="formRoleSelection">
              <Form.Label>Role</Form.Label>
              <Form.Select onChange={(e) => { setCollegeRole(e.target.value) }} value={collegeRole ?? ''} aria-label="Default select example">
                <option defaultValue value="student">
                  Student
                </option>
                <option value="teacher">Teacher</option>
              </Form.Select>
            </Form.Group>

            {/* First Name */}
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control onChange={(e) => { setFirstNameState(e.target.value) }} value={firstNameState ?? ''} required type="text" placeholder="Enter First Name" />
                </Form.Group>
              </Col>

              <Col>
                {/* Last name */}
                <Form.Group className="mb-2" controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control onChange={(e) => { setLastNameState(e.target.value) }} value={lastNameState ?? ''} required type="text" placeholder="Enter Last Name" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-2" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control onChange={(e) => { setEmailState(e.target.value) }} value={emailState ?? ''} required type="email" autoComplete="username" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control onChange={(e) => { setPasswordState(e.target.value) }} value={passwordState ?? ''} required type="password" autoComplete="current-password" placeholder="Enter Password" />
            </Form.Group>

            {/* Branch */}
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBranchSelection">
                  <Form.Label>Branch</Form.Label>
                  <Form.Select onChange={async (e) => { await setBranchState(e.target.value); await fetchSectionData(e.target.value, yearState); }} value={branchState ?? ''} aria-label="Default select example">
                    <option defaultValue value=''>
                      Choose branch
                    </option>
                    {(branchList != null) &&
                      branchList.map((branch, index) => (
                        <option key={index} value={branch?.name ?? ''}>{branch.name.toUpperCase()}</option>
                      ))
                    }
                  </Form.Select>
                </Form.Group>
                {/* year, section, collegeIdCard, admissionNumber, universityRollNumber */}
              </Col>
              <Col>
                {(collegeRole === "student") && <Form.Group className="mb-2" controlId="formYearSelection">
                  <Form.Label>Year</Form.Label>
                  <Form.Select onChange={async (e) => { await setYearsState(e.target.value); await fetchSectionData(branchState, e.target.value) }} value={yearState ?? ''}>
                    <option defaultValue value=''>
                      Choose year
                    </option>
                    <option value="1">
                      1st
                    </option>
                    <option value="2">
                      2nd
                    </option>
                    <option value="3">
                      3rd
                    </option>
                    <option value="4">
                      4th
                    </option>

                  </Form.Select>
                </Form.Group>}
              </Col>
            </Row>
            {(collegeRole === "student") && <Form.Group className="mb-2" controlId="formSectionSelection">
              <Form.Label>Section</Form.Label>
              {(branchState == null) && <h6 className="text-muted mb-4">Branch not selected!</h6>}
              {(yearState == null) && <h6 className="text-muted mb-4">Year not selected!</h6>}
              {(branchState != null && yearState != null) && (sectionsAvailable.length == 0) && <h6 className="text-muted mb-4">No Sections available for registeration in selected branch and year!</h6>}

              <Form.Select style={{ display: ((sectionsAvailable.length != 0) ? '' : 'none') }} onChange={(e) => { setSectionState(e.target.value) }} value={sectionState ?? ''} aria-label="Default select example">
                <option defaultValue value=''>
                  Choose section
                </option>
                {sectionsAvailable.length != 0 && (sectionsAvailable.map((item,index) => <option key={index} defaultValue value={item._id ?? ''}>
                  {item.sectionName}
                </option>))}

              </Form.Select>
            </Form.Group>}
            <Row>
              <Col>

                {(collegeRole === "student") && <Form.Group className="mb-2" controlId="formUniversityRollNumber">
                  <Form.Label>University Roll Number</Form.Label>
                  <Form.Control onChange={(e) => { setUniversityRollNumberState(e.target.value) }} value={universityRollNumberState ?? ''} required type="text" placeholder="Enter University Roll Number" />
                </Form.Group>}
              </Col>
              <Col>
                {(collegeRole === "student") && <Form.Group className="mb-2" controlId="formAdmissionNumber">
                  <Form.Label>Admission Number</Form.Label>
                  <Form.Control onChange={(e) => { setAdmissionNumberState(e.target.value) }} value={admissionNumberState ?? ''} required type="text" placeholder="Enter Admission Number" />
                </Form.Group>}
                {/* Link for College ID */}
              </Col>
            </Row>
            <Form.Group className="mb-4" controlId="formCollegeIdLink">
              <Form.Label>College ID photo</Form.Label>
              <CloudinaryIdCardWidget onUpload={handleOnIdCardUpload} multipleAllowed={false}>
                {({ open }) => {
                  function handleOnClickId(e) {
                    e.preventDefault();
                    open();
                  }
                  return (
                    <Button variant="outline-primary" id="btnId" onClick={handleOnClickId} className="mb-3" style={{ display: 'block' }}>
                      Upload Id Card Image
                    </Button>
                  )
                }}
              </CloudinaryIdCardWidget>
              {
                (collegeId != null) && (
                  <div style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                    <Image thumbnail style={{ height: '100%' }} src={collegeId} alt="User" />
                  </div>
                )
              }
            </Form.Group>

          </>
        }
        {
          (pageNumber == 1) &&
          <>
            <Form.Group className="mb-2" controlId="formYearSelection">
              <Form.Label>Images for Automated Attendance System</Form.Label>
              <CloudinaryUploadWidget onUpload={handleOnUpload} multipleAllowed={true}>
                {({ open }) => {
                  function handleOnClick(e) {
                    e.preventDefault();
                    open();
                  }
                  return (
                    <Button variant="outline-primary" id="btnImg" onClick={handleOnClick} className="mb-3" style={{ display: 'block' }}>
                      Upload Images
                    </Button>
                  )
                }}
              </CloudinaryUploadWidget>

              <Form.Text className="text-muted">
                Upload your atleast 3 images captured in well-lit environment for training our Attendance system.
              </Form.Text>
              <div className="mt-2 mb-4">
                {
                  (uploadedUserImages != []) && uploadedUserImages.map((img, index) => (
                    <div key={index} style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                      <FaTimesCircle className="deleteImgBtn" onClick={(e) => removeThisImg(img)} />
                      <Image thumbnail style={{ height: '100%' }} src={img} alt="User" />
                    </div>
                  ))
                }
              </div>
            </Form.Group>
          </>
        }

        {/* show modal on first click */}
        
        {((collegeRole === "student") && pageNumber == 1 && uploadedUserImages?.length<3) &&
          <Alert variant='warning' >
              Upload atleast 3 images!
          </Alert>
        }
        
        {(collegeRole === "teacher") &&
          <Button className="reg-btn" variant="primary" type="submit">
            Register
          </Button>
        }
        {((collegeRole === "student") && pageNumber == 1) &&
          <Button disabled={(uploadedUserImages?.length<3)} className="reg-btn" variant="primary" type="submit">
            Register
          </Button>
        }
        {(collegeRole === "student") && (pageNumber == 0) &&
          <Button disabled={!canGoNext} className="next-btn" variant="secondary" onClick={(e) => setPageNumber(1)}>
            Next
          </Button>
        }
        {(collegeRole === "student") && (pageNumber == 1) &&
          <Button className="prev-btn" variant="secondary" onClick={(e) => setPageNumber(0)}>
            Previous
          </Button>
        }



        <hr className="mt-4" />
        <p className="text-center fw-bold">Already Registered ?</p>
        <Link style={{ textDecoration: "none" }} to="/login">
          <Button className="reg-btn" variant="success">
            Login
          </Button>
        </Link>


      </Form>

      {/* Modal */}

      <Modal id="checkModal" size="lg" show={show} onHide={handleClose} centered backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Check Details Again Before You Proceeed</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <h4 className="modalData" style={{ 'textTransform': 'capitalize' }}><strong>Role</strong> :  {collegeRole}  </h4>
          <h4 className="modalData"><strong>First Name</strong> :  {firstNameState} </h4>
          <h4 className="modalData"><strong>Last Name</strong> : {lastNameState} </h4>
          <h4 className="modalData"><strong>Email</strong> :  {emailState} </h4>
          {(collegeRole === "student") && <h4 className="modalData"><strong>Year</strong> :  {yearState}</h4>}
          <h4 className="modalData"><strong>Branch</strong> :  {branchState}</h4>
          {(collegeRole === "student") && <h4 className="modalData"><strong>Section</strong> :  {sectionState}</h4>}
          {(collegeRole === "student") && <h4 className="modalData"><strong>Admission Number</strong> :  {admissionNumberState}</h4>}
          {(collegeRole === "student") && <h4 className="modalData"><strong>University Roll Number</strong> :  {universityRollNumberState}</h4>}
          <h4 className="modalData"><strong>College ID</strong> : <a href={collegeId} target="_blank" rel="noreferrer"><Button variant="info">Preview</Button></a>    </h4>




        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onProceed}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Register;
