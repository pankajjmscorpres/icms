import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import { Link } from "react-router-dom";
import axios from 'axios';
import moment from 'moment/moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

export const Basic = () => {
  // For attendance
  const [attendanceCountLabels, setAttendanceCountLabels] = useState([]);
  const [dateLabels, setDateLabels] = useState([]);
  useDocumentTitle("Dashboard");
  const navigate = useNavigate();
  let userData;
  let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
  if (icmsLocalStorageData === null) {
    navigate("/login");
  } else {
    userData = icmsLocalStorageData?.data;
  }
  let currUser = userData._id;
  // for reference 
  // let branchName = userData.branchName || userData.user.branchName; 

  useEffect(() => {
    const getClassroomData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8002/api/v1/section/get-section-data/${currUser}`);

        if (data && data.success) {
          let attendanceData = data.data.sectionAttendance;
          attendanceData = attendanceData.sort((a, b) => moment(a.date).diff(moment(b.date)));
          let temp1 = [];
          let temp2 = [];
          attendanceData.map((item, idx) => {
            temp1.push(item.date);
            temp2.push(item.presentStudents.length);
          })
          setDateLabels(temp1);
          setAttendanceCountLabels(temp2);
        }
      } catch (e) {
        console.log(e, "e");
      }
    };
    getClassroomData();

  }, []);

  // Chart.js code
  // for chartjs
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const lastFiveDaysOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Attendance of last five days',
      },
    },
  };
  const lastFiveDaysLabels = dateLabels.slice(-5);
  const lastFiveDaysData = {
    labels: lastFiveDaysLabels,
    datasets: [
      {
        label: 'Number of students',
        data: attendanceCountLabels.slice(-5),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  const allTimeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Attendance of All time',
      },
    },
  };
  const allTimeLabels = dateLabels.slice(-30);
  const alltimeData = {
    labels: allTimeLabels,
    datasets: [
      {
        label: 'Number of students',
        data: attendanceCountLabels.slice(-30),
        borderColor: "rgba(0, 191, 160, 1)",
        backgroundColor: "rgba(0, 191, 160, 0.5)",
      },
    ],
  };
  return (
    <div>

      <div style={{ display: 'flex' }} >
        <div className="basic-left" style={{ flex: 1, padding: '0px 10px' }}>

          <Card style={{ margin: '0 10px' }}>
            <Card.Img style={{ objectFit: 'contain', padding: '5px', width: '200px', margin: '0 auto', height: '175px' }} variant="top" src="https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png" />
            <Card.Body>
              <Card.Title className='text-center'>Welcome back <strong>{userData?.firstName || userData?.user.firstName}</strong> !</Card.Title>
              <Card.Text>
                Start your day by marking attendance or by checking active issues if any.
              </Card.Text>

            </Card.Body>
          </Card>




          {/* Graph for attendance */}

        </div>

        <div className="basic-right" style={{ flex: 2 }}>

          <Card className='mb-3'>


            <Card.Body>
              <h4>Notifications</h4>

              <p>You are all caught up! There are currently no new notifications.</p>

            </Card.Body>
          </Card>
          <Card className='mb-3'>


            <Card.Body>

              <Line options={lastFiveDaysOptions} data={lastFiveDaysData} />
            </Card.Body>
          </Card>
          <Card className='mb-3'>


            <Card.Body>

              <Line options={allTimeOptions} data={alltimeData} />
            </Card.Body>
          </Card>

          {/* <Card>


      <Card.Body>
      
     
      
      <Card.Img src="https://resources.cdn.yaclass.in/24adf49a-f4f3-4706-9302-ee944efad647/pic12.svg" />
      
      </Card.Body>
    </Card> */}

        </div>


      </div>

    </div>
  )
}

