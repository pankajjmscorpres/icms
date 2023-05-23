import React from 'react'
import { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap"
import "./Support.css"
import axios from "axios";
import Message from "../../Message";

const Support = () => {
    let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
    // A check for fault here if student profile is updated
    let userData = icmsLocalStorageData.data;
    // console.log(userData);
    let userID = userData.user._id;
    // state variables
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    const formRef = useRef(null);
    const issueTitleRef = useRef(null);
    const issueTypeRef = useRef(null);
    const priorityRef = useRef(null);
    const issueDescriptionRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post("http://localhost:8002/api/v1/student/support", {
                title: issueTitleRef["current"]?.value,
                studentId: userID,
                issueMsg: issueDescriptionRef["current"]?.value,
                typeOfIssue: issueTypeRef["current"]?.value,
                priority: priorityRef["current"]?.value
            })
            // console.log(data.data);
            formRef.current.reset();
            setSuccess(true);
            setSuccessMessage("Ticket created successfully !");
            setTimeout(() => setSuccess(false), 3000);

        } catch (err) {
            console.log(err);
        }


    }
    return (
        <div>
            <section className="ticker-form-container">
                {success && (
                    <Message variant={"success"}>{successMessage}</Message>
                )}
                <Form ref={formRef} id="support-form" onSubmit={handleSubmit}>
                    <h3>Create a ticket</h3>
                    <Form.Group className="mb-2" controlId="formIssueTitle">
                        <Form.Label>Enter title of Issue</Form.Label>
                        <Form.Control
                            ref={issueTitleRef}
                            required
                            type="text"

                            placeholder='Enter Title breifly describing the issue'
                        />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="formIssueTypeSelection">
                        <Form.Label>Select Type of Issue</Form.Label>
                        <Form.Select ref={issueTypeRef} aria-label="Default select example">
                            <option defaultValue value="1">
                                Technical
                            </option>
                            <option value="3">Non-Technical/Attendance Related</option>
                            <option value="2">Others</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="formPrioritySelection">
                        <Form.Label>Select Priority</Form.Label>
                        <Form.Select ref={priorityRef} aria-label="Default select example">
                            <option defaultValue value="3">
                                Low
                            </option>
                            <option value="2">Medium</option>
                            <option value="1">High</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group required className="mb-2" controlId="formIssueDescription">
                        <Form.Label>Describe your issue</Form.Label>
                        <br />
                        <textarea ref={issueDescriptionRef} style={{ width: '100%', height: '140px', outline: 'none' }} name="Issue Description" id="issue-description"></textarea>
                    </Form.Group>
                    <Button className="lgn-btn" variant="success" type="submit">
                        Submit
                    </Button>
                </Form>
            </section>
        </div>
    )
}

export default Support