import React from "react";
import Modal from "react-modal";

function TestModal({ isOpen, onClose, test, position }) {
  const calculateDaysLeft = () => {
    const endDate = new Date(test.endDate);
    const today = new Date();
    const timeDifference = endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Test Details"
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          top: position.top || "50%",
          left: position.left !== undefined ? position.left : "50%",
          right: position.right !== undefined ? position.right : "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "400px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          padding: "20px",
          paddingTop: "60px",
          transition: "left 1s ease-in-out, right 1s ease-in-out", // Add transition for left and right with ease-in-out
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <h2 style={{
          fontSize: "20px"
        }}>{test.name} -{test.EQL}</h2>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          &#x2715;
        </button>
      </div>
      <p style={{ fontSize: "16px", marginBottom: "10px" }}>
        Test: {test.test}
      </p>
      <p style={{ fontSize: "16px", marginBottom: "10px" }}>
        Start Date: {test.startDate}
      </p>
      {/* <p style={{ fontSize: "16px", marginBottom: "10px" }}>
        End Date: {test.endDate}
      </p> */}
      <p style={{ fontSize: "16px", marginBottom: "10px" }}>
        Status: {test.status}
      </p>
      <p style={{ fontSize: "16px", marginBottom: "10px" }}>
        Duration: {test.duration}
      </p>
      <p style={{ fontSize: "16px", marginBottom: "10px" }}>
        Materials: {test.Materials }, {test.Studies}, {test.Protocols}
      </p>
      <p style={{ fontSize: "16px", marginBottom: "10px" }}>
        {`Days Left: ${calculateDaysLeft()} days`}
      </p>
      <button
        onClick={onClose}
        style={{
          background: "#4285f4",
          color: "white",
          padding: "8px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          border: "none",
        }}
      >
        Close
      </button>
    </Modal>
  );
}

export default TestModal;