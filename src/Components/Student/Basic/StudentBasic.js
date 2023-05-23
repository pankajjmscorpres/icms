import React, { useState, useEffect } from "react";
import "./StudentBasic.css";
import { AiOutlineArrowRight, AiOutlineUser } from "react-icons/ai";
import { BsSpeedometer2 } from "react-icons/bs";
import { GiTeacher } from "react-icons/gi";
import studentWelcomeImg from "../../../assets/images/student-wave.png";
import axios from 'axios';
import { Button, Card, Badge, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const StudentBasic = () => {
  let icmsUserInfo = JSON.parse(localStorage.getItem("icmsUserInfo"));
  let userData = icmsUserInfo.data;
  console.log(userData);

  const [updatesData, setUpdatesData] = useState([]);
  let priorityMap = ["Low", "Mid", "High"];
  let priorityColorsMap = ["info", "warning", "Danger"];

  useEffect(() => {
    const getStudentUpdatesList = async () => {
      try {
        let studentID = JSON.parse(localStorage.getItem("icmsUserInfo")).data.user._id;
        // const { data } = await axios.get(`http://localhost:8002/api/v1/student/fetch-updates/${studentID}`);
        const { data } = await axios.get(`http://localhost:8002/api/v1/student/fetch-updates/6419ef7901e5b63cf6c04a0d`);

        if (data && data.success) {
          console.log(data, "student updates data");
          data.data.reverse();
          data.data = data.data.slice(0, 5);
          setUpdatesData(data.data); // for updates data
        }
      } catch (e) {
        console.log(e, "e");
      }
    };

    getStudentUpdatesList();

  }, []);

  return (
    <div className="student-basic-container">
      <div className="card welcome-card">
        <div className="card-body welcome-card-body">
          <div>
            <h1 className="card-subtitle mb-2">
              Welcome Back 👋, {userData.firstName || userData.user.firstName}{" "}
            </h1>
            <p className="card-text">
              Glad to see you back ! Let's catch up.
            </p>
          </div>

          <div className="welcome-image">
            <img className="img-fluid" src={studentWelcomeImg} alt="student-waving-img" />
          </div>
        </div>
      </div>

      <div className="main-cards-container">

        <div className="card attendance-card">
          <div className="card-body text-center">
            <h5 className="card-title mb-3 d-flex align-items-center justify-content-center"><AiOutlineUser /> &nbsp;  Attendance &nbsp;&nbsp;<AiOutlineArrowRight /></h5>
            <p className="card-text">
              <span className="h1">90% ( 18/20 )</span>
            </p>
            <p>
              Total Sessions Done
            </p>
          </div>
        </div>

        {/* <div className="card my-teachers-card">
          <div className="card-body text-center">
            <h5 className="card-title mb-3 d-flex align-items-center justify-content-center"><GiTeacher /> &nbsp; My Teachers &nbsp;&nbsp;<AiOutlineArrowRight /></h5>
            <p className="card-text">
              <span className="h1">7</span>
            </p>
            <p>
              View details
            </p>
          </div>
        </div> */}


        <div className="card updates-card">
          <div className="card-body">
            <h5 className="card-title mb-3 d-flex align-items-center">
              <BsSpeedometer2 className="me-2" /> Updates <AiOutlineArrowRight className="ms-2" />
              <Link to="student-updates" className="text-muted h6 ms-auto">View All</Link>
            </h5>
            <p className="card-text">
              {
                (updatesData.length == 0) && <h6 className="text-muted">You are all caught up! No updates for now.</h6>
              }
              {updatesData.length != 0 &&
                updatesData?.map((item, index) => (
                  <Link to={"student-updates#" + item._id} style={{ textDecoration: 'none', color: 'black' }}>
                    <Card className="mb-2 updatesCards" key={index}>
                      <Card.Body>
                        <div style={{ display: 'flex' }} className="mb-2">
                          <Image src={item.createdBy.profileImg} className="me-3 rounded-circle" style={{ height: '40px', width: '40px' }} />
                          <span style={{ display: 'flex', flexDirection: 'column' }}>
                            <b>{item.createdBy.firstName + " " + item.createdBy.lastName}</b>
                            {item.createdBy.isSectionHead && <span className="mb-2 text-muted">Section Head </span>}
                          </span>
                        </div>
                        <Card.Title>{item?.msgTitle || ""}</Card.Title>
                        <p>{item?.msgBody || ""}</p>
                        <Badge bg={priorityColorsMap[item.priority]} style={{ position: 'absolute', top: '10px', right: '30px' }}>
                          {priorityMap[item.priority]}
                        </Badge>
                        <Badge bg="dark" style={{ position: 'absolute', bottom: '10px', right: '30px' }}>
                          {item.type.toUpperCase()}
                        </Badge>
                        <div className="gocorner" href="#">
                          <div className="goarrow">→</div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                ))}
            </p>
          </div>
        </div>

        {/* similarly my courses card */}

      </div>



    </div>
  );
};

export default StudentBasic;
