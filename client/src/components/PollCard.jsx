import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./PollCard.css";
import socket from "../socket";
import { API_URL } from "../config";

const PollCard = () => {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPoll = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/polls/getbyid/${id}`
      );

      if (!response.ok) {
        throw new Error("Poll not found");
      }

      const data = await response.json();
      setPoll(data);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchPoll();
  }, [id]);

  useEffect(()=>{
    socket.emit('joinpoll',id);

    const handlePollUpdated = (updatedPoll) => {
    console.log("🔥 Updated poll received:", updatedPoll);
    setPoll(updatedPoll);
  };

  socket.on("pollupdated", handlePollUpdated);

    return ()=>{
      socket.off('pollupdated')
    }

  },[id])

  const handleVote = async () => {
    if (selectedOption === null || selectedOption === "") {
      alert("Please select an option to vote");
      return;
    }
    
    const alreadyVoted = localStorage.getItem(`voted_${id}`);

      if (alreadyVoted) {
    alert("You have already voted in this poll");
    return;
  }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${API_URL}/api/polls/vote/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            optionIndex: selectedOption,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Vote submission failed");
      }

      localStorage.setItem(`voted_${id}`, "true");


      alert("Vote submitted successfully!");

      // Refresh poll results
      fetchPoll();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!poll) {
    return (
      <div className="poll-page-container">
        <div className="poll-loading-box">
          <div className="poll-spinner"></div>
          <p style={{ color: "#94a3b8" }}>Loading poll details...</p>
        </div>
      </div>
    );
  }

  const totalVotes =
    typeof poll.totalvotes === "number"
      ? poll.totalvotes
      : poll.options
      ? poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0)
      : 0;

  return (
    <div className="poll-page-container">
      <div className="poll-card-detail">
        {/* ── Header & Badge ── */}
        <div className="poll-detail-header">
          <div className="poll-live-badge">
            <span className="live-dot"></span>
            Realtime Live Poll
          </div>
          <h1 className="poll-question-title">{poll.question}</h1>
          <div className="poll-total-votes-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{totalVotes} {totalVotes === 1 ? "total vote" : "total votes"}</span>
          </div>
        </div>

        {/* ── Options List with Live Percentage Progress ── */}
        <div className="poll-options-list">
          {poll.options &&
            poll.options.map((option, index) => {
              const votes = option.votes || 0;
              const percentage =
                totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
              const isSelected = selectedOption === index;

              return (
                <div
                  key={option._id || index}
                  className={`poll-option-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedOption(index)}
                >
                  {/* Progress background bar */}
                  <div
                    className="option-bg-progress"
                    style={{ width: `${percentage}%` }}
                  ></div>

                  <div className="option-left-content">
                    <div className="custom-radio">
                      <div className="custom-radio-inner"></div>
                    </div>
                    <input
                      type="radio"
                      name="poll-option"
                      className="hidden-radio"
                      value={index}
                      checked={isSelected}
                      onChange={() => setSelectedOption(index)}
                    />
                    <span className="option-label-text">{option.text}</span>
                  </div>

                  <div className="option-right-stats">
                    <span className="option-percentage-badge">{percentage}%</span>
                    <span className="option-vote-count">({votes} votes)</span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* ── Action Buttons ── */}
        <div className="poll-action-bar">
          <button
            className="btn-submit-vote"
            onClick={handleVote}
            disabled={selectedOption === null || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="poll-spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                <span>Submitting Vote...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Submit Vote</span>
              </>
            )}
          </button>

          <Link to="/" className="btn-back-home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back to All Polls</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PollCard;