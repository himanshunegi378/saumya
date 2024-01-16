import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalenderView.css";
// import { Tooltip } from "react-tooltip";
import TestModal from "./TestModal";
import axios from "axios";

import dummyTests from "./dummyTests.json";

function CalenderView() {

    const [resources, setResources] = React.useState([]);

    React.useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
          try {
            const response = await axios.get(
              "https://658c0753859b3491d3f55409.mockapi.io/resources/resources"
            );
            setResources(response.data);
            console.log(response.data)
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();

      }, []); 
  const testsByDate = resources.reduce((acc, test) => {
    if (test.startDate && test.endDate) {
      const startDate = formatDate(new Date(test.startDate));
      const endDate = formatDate(new Date(test.endDate));

      if (!acc[startDate]) {
        acc[startDate] = [];
      }
      acc[startDate].push({ ...test, type: "start" });

      if (!acc[endDate]) {
        acc[endDate] = [];
      }
      acc[endDate].push({ ...test, type: "end" });
    }
    return acc;
  }, {});

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  function formatDate(date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  const tileContent = ({ date }) => {
    const formattedDate = formatDate(date);
    if (testsByDate[formattedDate]) {
      return (
        <div
          className="test-list"
          data-tip={formattedDate}
          data-for={formattedDate}
        >
          {testsByDate[formattedDate].map((test, index) => (
            <p
              key={index}
              className={`test-title ${test.type}`}
              onClick={(e) => handleTestClick(e, test)}
            >
              {test.name} - {test.test}
            </p>
          ))}
          {/* <Tooltip id={formattedDate} place="top" effect="solid">
            {formattedDate}
          </Tooltip> */}
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ view }) => {
    if (view === "month") {
      return "calendar-month";
    }
    return null;
  };

  const handleTestClick = (e, test) => {
    setSelectedTest(test);

    // Calculate modal positions based on the click event for each task
    const rect = e.currentTarget.getBoundingClientRect();
    const modalTop = rect.top + window.scrollY;
    const modalLeft = rect.left + window.scrollX + rect.width + -400;
    const modalRight = window.innerWidth - rect.left - window.scrollX;

    // Choose the side with more available space
    const preferredSide = modalLeft > modalRight ? "left" : "right";

    // Set the modal position based on the chosen side
    if (preferredSide === "left") {
      setModalPosition({ top: modalTop, left: modalLeft });
    } else {
      setModalPosition({ top: modalTop, right: modalRight });
    }

    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTest(null);
  };

  return (
    <div className="calendar-container">
      <Calendar
        className="calendarView"
        tileContent={tileContent}
        tileClassName={tileClassName}
      />
      {selectedTest && (
        <TestModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          test={selectedTest}
          position={modalPosition}
        />
      )}
    </div>
  );
}

export default CalenderView;