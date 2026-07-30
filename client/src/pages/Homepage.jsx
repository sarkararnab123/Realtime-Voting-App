import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Home = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPolls = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/polls/getall");

      if (!response.ok) {
        throw new Error("Failed to fetch polls");
      }

      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const calculateTotalVotes = (poll) => {
    if (typeof poll.totalvotes === "number" && poll.totalvotes > 0) {
      return poll.totalvotes;
    }
    return poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
  };

  const filteredPolls = polls.filter((poll) =>
    poll.question?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="homepage">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading realtime polls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* ── Hero Banner ── */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          Live Realtime Polling Platform
        </div>
        <h1 className="hero-title">
          Create, Share & Vote on <br className="hidden-mobile" />
          <span className="hero-title-gradient">Realtime Polls</span>
        </h1>
        <p className="hero-subtitle">
          Instantly launch interactive polls, collect votes live, and visualize 
          community opinions with real-time tallying.
        </p>
        <div className="hero-actions">
          <Link to="/create" className="btn-create-poll">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Create a New Poll
          </Link>
        </div>
      </section>

      {/* ── Filter / Search Header ── */}
      <div className="content-header">
        <div className="section-title-group">
          <h2 className="section-title">Active Polls</h2>
          <span className="poll-count-badge">{polls.length} Total</span>
        </div>

        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search polls by question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ── Polls List / Grid ── */}
      {filteredPolls.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="empty-title">
            {searchTerm ? "No matching polls found" : "No polls available yet"}
          </h3>
          <p className="empty-text">
            {searchTerm
              ? `We couldn't find any polls matching "${searchTerm}". Try a different keyword.`
              : "Be the first person to create a poll and get the community voting!"}
          </p>
          {!searchTerm && (
            <Link to="/create" className="btn-create-poll">
              Create Your First Poll
            </Link>
          )}
        </div>
      ) : (
        <div className="polls-grid">
          {filteredPolls.map((poll) => {
            const totalVotes = calculateTotalVotes(poll);

            return (
              <div key={poll._id} className="poll-card">
                <div className="poll-card-header">
                  <h3 className="poll-question">{poll.question}</h3>
                  <div className="poll-meta">
                    <div className="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{totalVotes} {totalVotes === 1 ? "vote" : "votes"}</span>
                    </div>
                    <div className="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16M4 12h16M4 18h7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{poll.options ? poll.options.length : 0} options</span>
                    </div>
                  </div>
                </div>

                <div className="options-preview">
                  {poll.options &&
                    poll.options.slice(0, 3).map((option) => {
                      const percentage =
                        totalVotes > 0
                          ? Math.round((option.votes / totalVotes) * 100)
                          : 0;

                      return (
                        <div key={option._id || option.text} className="option-item">
                          <div
                            className="option-progress-bar"
                            style={{ width: `${percentage}%` }}
                          ></div>
                          <div className="option-content">
                            <span className="option-text">{option.text}</span>
                            <span className="option-votes">
                              {percentage}% ({option.votes || 0})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  {poll.options && poll.options.length > 3 && (
                    <div className="more-options-tag">
                      +{poll.options.length - 3} more options
                    </div>
                  )}
                </div>

                <div className="poll-card-footer">
                  <Link to={`/poll/${poll._id}`} className="btn-view-poll">
                    <span>Vote & View Live Results</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;