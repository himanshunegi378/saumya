import { useState, useEffect } from "react";
import {
  format,
  subMonths,
  addMonths,
  startOfWeek,
  addDays,
  isSameDay,
  lastDayOfWeek,
  getWeek,
  addWeeks,
  subWeeks,
} from "date-fns";
import "./Calendar.css";
import axios from "axios";

const Calendar = ({ resource }) => {
    console.log("calender",resource)
  const [currentMonth, setCurrentMonth] = useState(new Date(resource.startDate));
  const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));
  const [selectedDate, setSelectedDate] = useState(new Date());
  //   const [resources, setResources] = useState([]);

//   const resources = [
//     {
//       name: "Dr. Vignesh",
//       status: "Allocated",
//       skills: "Mechanical Testing",
//       id: "1",
//       test: "Tensile Test - Low Load",
//       is_internal: "TRUE",
//       duration: "10",
//       Materials: "Aluminum Alloy",
//       Studies: "Durability Analysis",
//       Protocols: "Tensile Strength Test",
//       EQL: "EQL-9547",
//       startDate: "2024-01-15T17:17:37.874Z",
//       endDate: "2024-01-25T17:17:37.874Z",
//     },
//     {
//       name: "Dr. Manindra",
//       status: "Allocated",
//       skills: "Thermal Analysis",
//       id: "2",
//       test: "Tensile Test - High Load",
//       is_internal: "TRUE",
//       duration: "5",
//       Materials: "Aluminum Alloy",
//       Studies: "Durability Analysis",
//       Protocols: "Tensile Strength Test",
//       EQL: "EQL-8937",
//       startDate: "2024-01-25T17:17:37.874Z",
//       endDate: "2024-01-30T17:17:37.874Z",
//     },
//     {
//       name: "Dr. Vishal",
//       status: "Leave",
//       skills: "Tensile Analysis",
//       id: "3",
//       test: "Null",
//       is_internal: "TRUE",
//       duration: "3",
//     },
//     {
//       name: "Dr. Arun",
//       status: "Allocated",
//       skills: "Compression Testing",
//       id: "4",
//       test: "Compression Test - Low Pressure",
//       is_internal: "TRUE",
//       duration: "35",
//       Materials: "Aluminum Alloy",
//       Studies: "Durability Analysis",
//       Protocols: "Compression Test",
//       EQL: "EQL-4012",
//       startDate: "2024-01-15T17:19:46.780Z",
//       endDate: "2024-02-19T17:19:46.780Z",
//     },
//     {
//       name: "Dr. Anand(External)",
//       status: "Allocated",
//       skills: "Tensile Analysis",
//       id: "5",
//       test: "Compression Test - High Pressure",
//       is_internal: "FALSE",
//       duration: "50",
//       Materials: "Aluminum Alloy",
//       Studies: "Durability Analysis",
//       Protocols: "Compression Test",
//       EQL: "EQL-9769",
//       startDate: "2024-02-19T17:19:46.780Z",
//       endDate: "2024-04-09T17:19:46.780Z",
//     },
//     {
//       name: "Dr. Rahul(External)",
//       status: "Available",
//       skills: "Thermal Cycle",
//       id: "6",
//       test: "Null",
//       is_internal: "FALSE",
//     },
//   ];

  // useEffect(() => {
  //     // Fetch data from the API
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.get(
  //           "https://658c0753859b3491d3f55409.mockapi.io/resources/resources"
  //         );
  //         setResources(response.data);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };

  //     fetchData();
  //   }, []); // Empty dependency array means this effect runs once after the initial render

  const changeMonthHandle = (btnType) => {
    if (btnType === "prev") {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
    if (btnType === "next") {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const changeWeekHandle = (btnType) => {
    //console.log("current week", currentWeek);
    if (btnType === "prev") {
      //console.log(subWeeks(currentMonth, 1));
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
    }
    if (btnType === "next") {
      //console.log(addWeeks(currentMonth, 1));
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
    }
  };

  const onDateClickHandle = (day, dayStr) => {
    setSelectedDate(day);
    // showDetailsHandle(dayStr);
  };

  const renderHeader = () => {
    const dateFormat = "MMM yyyy";
    // console.log("selected day", selectedDate);
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={() => changeMonthHandle("prev")} style={{ fontSize: "13px", fontWeight: "bold" }}>
            {resource.name}
          </div>
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end">
          <div className="icon" onClick={() => changeMonthHandle("next")} style={{ fontSize: "13px", fontWeight: "bold" }}>{resource.EQL}</div>
        </div>
      </div>
    );
  };
  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };
  const renderCells = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;

        // Find the data for the first resource in the API response
        // const firstResource = resources.find(
        //   (item) => item.id === "2" // Assuming the id of the first resource is "1"
        // );

        // Check if the current day is within the date range of the first resource
        const isInRange =
          isSameDay(cloneDay, new Date(resource.startDate)) ||
          (cloneDay > new Date(resource.startDate) &&
            cloneDay < new Date(resource.endDate));

        days.push(
          <div
            className={`col cell ${
              isSameDay(day, new Date())
                ? "today"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            } ${isInRange ? "green" : ""}`}
            key={day}
            onClick={() => {
              const dayStr = format(cloneDay, "ccc dd MMM yy");
              onDateClickHandle(cloneDay, dayStr);
            }}
            style={isInRange ? { backgroundColor: "#FF7F7F" } : {}}
          >
            <span className="number">{formattedDate}</span>
            <span className="eql" >
              {isInRange ? "" : ""}
            </span>
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day - 7}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };
  const renderFooter = () => {
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={() => changeWeekHandle("prev")}>
            prev week
          </div>
        </div>
        <div>{currentWeek}</div>
        <div className="col col-end" onClick={() => changeWeekHandle("next")}>
          <div className="icon">next week</div>
        </div>
      </div>
    );
  };
  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderFooter()}
    </div>
  );
};

export default Calendar;
/**
 * Header:
 * icon for switching to the previous month,
 * formatted date showing current month and year,
 * another icon for switching to next month
 * icons should also handle onClick events to change a month
 */
