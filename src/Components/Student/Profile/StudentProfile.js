import axios from "axios";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Button, Form, Image, Toast, ToastContainer, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import "./StudentProfile.css"
import CloudinaryUploadWidget from "../../CloudinaryWidget/CloudinaryUploadWidget";
import Message from "../../Message/index";

function StudentProfile() {
  useDocumentTitle("Profile");
  // A variable that will help to re-render by using it as inverter
  // let [updateFormFields, setUpdateFormFields] = useState(false);
  // Referenced Variables
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const collegeIdRef = useRef(null);
  const profileImgRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  // For toast
  const [show, setShow] = useState(false);
  // For toast
  const [error, seterror] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const [uploadedUserImages, setUploadedUserImages] = useState([]);

  useEffect(() => {
    let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
    if (icmsLocalStorageData == null) {
      navigate("../login");
    } else {
      let userData = icmsLocalStorageData.data;
      console.log(userData);
      // console.log(icmsLocalStorageData);
      firstNameRef.current.value = userData.firstName || userData.user.firstName;
      lastNameRef.current.value = userData.lastName || userData.user.lastName;
      emailRef.current.value = userData.email || userData.user.email;
      collegeIdRef.current.value = userData.collegeIdCard || userData.user.collegeIdCard;
      profileImgRef.current.src = userData.profileImg || userData.user.profileImg;
      phoneRef.current.value = userData.mobileNumber || userData.user.mobileNumber || "";
      setUploadedUserImages(userData.user.sampleImages);
      console.log(userData.user.sampleImages, "userData.user.sampleImages");

      if (userData.user)
        setFullName(userData.user?.firstName + " " + userData.user?.lastName);
      else
        setFullName(userData?.firstName + " " + userData?.lastName);
    }

    // eslint-disable-next-line
  }, []);

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
    console.log(uploadedUserImages, "after append");

    setSuccess(true);
    setSuccessMessage("Your images uploaded successfully!");
    setTimeout(() => setSuccess(false), 5000);
  }

  async function saveImages() {
    console.log(uploadedUserImages, "save these on db");

    try {
      const { data } = await axios.post(`http://localhost:8002/api/v1/student/upload-images`, {
        studentId: JSON.parse(localStorage.getItem("icmsUserInfo")).data.user._id,
        images: uploadedUserImages
      });

      let icmsUserInfo = JSON.parse(localStorage.getItem("icmsUserInfo"));
      icmsUserInfo.data.user.sampleImages = data.data.sampleImages;

      localStorage.setItem("icmsUserInfo", JSON.stringify(icmsUserInfo));

      console.log(data, "image res");

      setSuccess(true);
      setSuccessMessage("Images uploaded successfully !");
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.log(err, "img upload err");
      seterror(err.msg);
      setTimeout(() => seterror(null), 3000);
      // alert(err.message);
    }

  }

  async function updateProfile(e) {
    e.preventDefault();
    let passwordValue = passwordRef.current.value;
    let confirmPasswordValue = confirmPasswordRef.current.value;

    // both values are present(not NULL)
    if (passwordValue !== confirmPasswordValue) {
      // console.log("Password and Confirm Password do not match!");
      alert("Password and Confirm Password do not match!");
    }
    else {

      // Getting userID  

      let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
      let userData = icmsLocalStorageData.data;
      console.log(userData);

      let userID = userData._id;
      console.log(userID);
      const updatedDetails = {
        userId: userID,
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        mobileNumber: phoneRef.current.value,
        password: passwordRef.current.value,
        // profileImg : profileImgRef["current"].src,

      }
      // console.log(updatedDetails)
      try {
        const response = await axios.put("http://localhost:8002/api/v1/student/update-student", updatedDetails);
        console.log(response);
        localStorage.setItem("icmsUserInfo", JSON.stringify(response.data));
        if (response.data.success) {
          // show toast
          setShow(true)
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="profile-section">
      {error && <Message variant={"danger"} style={{paddingTop : "15px"}}>{error}</Message>}
      {success && (
        <Message variant={"success"}>{successMessage}</Message>
      )}
      <div id="profile-img">
        <Image
          className="img img-fluid"
          src=""
          ref={profileImgRef}
          thumbnail="true"
          alt="profile-img"
        />
        <h6 className="mt-4">{fullName}</h6>

        <div id="trainingImagesBox">
          <h6 className="fw-bold mt-3">Images for Automated Attendance System</h6>
          {(uploadedUserImages != []) && uploadedUserImages.map((img, index) => (
              <div style={{ display: "inline-block", height: '100px', margin: '10px', position: 'relative' }}>
                <Image thumbnail style={{ height: '100%' }} src={img} alt="User" />
              </div>
          ))}
          <CloudinaryUploadWidget onUpload={handleOnUpload} multipleAllowed={true}>
            {({ open }) => {
              function handleOnClick(e) {
                e.preventDefault();
                open();
              }
              return (
                <Button variant="outline-primary" id="btnImg" onClick={handleOnClick} className="mt-3 mb-3" style={{ display: 'block' }}>
                  Upload More Images
                </Button>
              )
            }}
          </CloudinaryUploadWidget>

          {(uploadedUserImages == []) && <div>
            <p className="text-muted">
              You have not uploaded any images for attendance system yet!
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
            </p>
          </div>}

          <Button className="save-images-btn mt-5" onClick={e => saveImages()} style={{ float: 'right' }} variant="success" type="submit">
            Save Images
          </Button>
        </div>

      </div>
      <div className="profile-details">
        <Form onSubmit={updateProfile} id="update-profile-form">
          <h6 className="fw-bold">Personal Details</h6>
          {/* First Name */}
          <Row>
            <Col>
              <Form.Group className="mb-2" controlId="formFirstName">
                <Form.Label className="text-muted">First Name</Form.Label>
                <Form.Control
                  ref={firstNameRef}
                  required
                  type="text"
                  placeholder="Enter First Name"
                />
              </Form.Group>
            </Col>

            <Col>
              {/* Last name */}
              <Form.Group className="mb-2" controlId="formLastName">
                <Form.Label className="text-muted">Last Name</Form.Label>
                <Form.Control
                  ref={lastNameRef}
                  required
                  type="text"
                  placeholder="Enter Last Name"
                />


              </Form.Group>
            </Col>
          </Row>

          {/* <FloatingLabel
        controlId="floatingInput"
        label="Email address"
        className="mb-3"
      >
        <Form.Control type="email" placeholder="name@example.com" />
      </FloatingLabel> */}
          <Form.Group className="mb-2" controlId="formEmail">
            <Form.Label className="text-muted">Email address</Form.Label>
            <Form.Control
              ref={emailRef}
              required
              type="email"
              disabled
              placeholder="Enter email"
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="formPassword">
            <Form.Label className="text-muted">Update Password</Form.Label>
            <Form.Control
              ref={passwordRef}
              type="password"
              placeholder="Enter New Password"
              autoComplete="off"
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="formConfirmPassword">
            <Form.Label className="text-muted">Confirm Password</Form.Label>
            <Form.Control
              ref={confirmPasswordRef}
              type="password"
              placeholder="Enter New Password Again"
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="formPhone">
            <Form.Label className="text-muted">Phone</Form.Label>
            <Form.Control
              ref={phoneRef}
              required
              type="tel"
              placeholder="Enter Phone Number"
            />
          </Form.Group>



          {/* Branch */}

          {/* <Form.Group className="mb-2" controlId="formBranchSelection">
          <Form.Label>Branch</Form.Label>
          <Form.Select ref={branchRef} aria-label="Default select example">
            <option defaultValue value="it">
              IT
            </option>
            <option value="cse">CSE</option>
          </Form.Select>
        </Form.Group> */}

          {/* Link for College ID */}
          {/* We are not updating this for now */}
          <Form.Group className="mb-3" controlId="formCollegeIdLink">
            <Form.Label className="text-muted">College ID Google Drive Link</Form.Label>
            <Form.Control
              ref={collegeIdRef}
              name="collegeID"
              type="url"
            />
          </Form.Group>

          {/* show modal on first click */}
          <Button className="save-btn" variant="success" type="submit">
            Save
          </Button>
          {/* Profile Details Updated Successfully */}
          <ToastContainer style={{ top: '150px', right: '0px' }} className="p-3">
            <Toast className={'text-white'} bg={'success'} onClose={() => setShow(false)} show={show} delay={3000} autohide>

              <Toast.Body>Profile Updated Successfully !</Toast.Body>
            </Toast>
          </ToastContainer>
        </Form>


      </div>
    </div>
  );
}

export default StudentProfile;
