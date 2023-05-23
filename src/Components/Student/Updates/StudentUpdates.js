import React, { useState, useEffect } from "react";
import "./index.css";
import { AiOutlineArrowRight, AiOutlineUser } from "react-icons/ai";
import { BsSpeedometer2 } from "react-icons/bs";
import { GiTeacher } from "react-icons/gi";
import axios from 'axios';
import { Button, Card, Badge, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const StudentUpdates = () => {
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
                const { data } = await axios.get(`http://localhost:8002/api/v1/student/fetch-updates/${studentID}`);

                if (data && data.success) {
                    console.log(data, "student updates data");
                    data.data.reverse();
                    setUpdatesData(data.data); // for updates data
                }
            } catch (e) {
                console.log(e, "e");
            }
        };

        getStudentUpdatesList();

    }, []);

    return (
        <div>
            <div className="card updatesContainer">
                <div className="card-body">
                    <h5 className="card-title mb-3 d-flex align-items-center">
                        <BsSpeedometer2 className="me-2" /> Updates <AiOutlineArrowRight className="ms-2" />
                    </h5>
                    <p className="card-text">
                        {
                            (updatesData.length == 0) && <h6 className="text-muted">You are all caught up! No updates for now.</h6>
                        }
                        {updatesData.length != 0 &&
                            updatesData?.map((item, index) => (
                                <Card className="mb-2 updatesCards" id={item._id} key={index}>
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
                                        <div>
                                            {
                                                (item.links != []) && item.links.map((resource, index) => (
                                                    ((resource.resourceType == 'pdf') &&
                                                        <a href={resource.resourceLink} target="_blank">
                                                            <div key={index} style={{ display: "inline-block", height: '100px', marginRight: '10px', position: 'relative' }}>
                                                                <Image thumbnail style={{ height: '100%' }} src='/images/pdfSnip.png' alt="User" />
                                                            </div>
                                                        </a>)
                                                    ||
                                                    ((resource.resourceType == 'word') &&
                                                        <a href={resource.resourceLink} target="_blank">
                                                            <div key={index} style={{ display: "inline-block", height: '100px', marginRight: '10px', position: 'relative' }}>
                                                                <Image thumbnail style={{ height: '100%' }} src='/images/wordSnip.png' alt="User" />
                                                            </div>
                                                        </a>)
                                                    ||
                                                    ((resource.resourceType == 'img') &&

                                                        <a href={resource.resourceLink} target="_blank">
                                                            <div key={index} style={{ display: "inline-block", height: '100px', marginRight: '10px', position: 'relative' }}>
                                                                <Image thumbnail style={{ height: '100%' }} src={resource.resourceLink} alt="User" />
                                                            </div>
                                                        </a>)
                                                    ||
                                                    ((resource.resourceType == 'video') &&
                                                        <a href={resource.resourceLink} target="_blank">
                                                            <div key={index} style={{ display: "inline-block", height: '100px', marginRight: '10px', position: 'relative' }}>
                                                                <Image thumbnail style={{ height: '100%' }} src='/images/videoSnip.png' alt="User" />
                                                            </div>
                                                        </a>)
                                                ))
                                            }
                                        </div>

                                    </Card.Body>
                                </Card>
                            ))
                        }
                    </p >
                </div >
            </div >



        </div >
    );
};

export default StudentUpdates;
