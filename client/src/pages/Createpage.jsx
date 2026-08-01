import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Createpage.css'
import { API_URL } from '../config'

const Createpage = () => {
    const navigate = useNavigate()
    const [question, setQuestion] = useState("")
    const [options, setOptions] = useState(['', ''])
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleOptionChange = (index, value) => {
        const updated = [...options]
        updated[index] = value
        setOptions(updated)
    }

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, ''])
        }
    }

    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        const trimmedQuestion = question.trim()
        const trimmedOptions = options.map(opt => opt.trim()).filter(opt => opt !== '')

        if (!trimmedQuestion) {
            setError('Please enter a question')
            return
        }
        if (trimmedOptions.length < 2) {
            setError('Please provide at least 2 options')
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch(`${API_URL}/api/polls/createpoll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: trimmedQuestion, options: trimmedOptions })
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.message || 'Failed to create poll')
            }
            navigate(`/poll/${data._id}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="create-page">
            <div className="create-container">
                <div className="create-header">
                    <div className="header-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </div>
                    <h1>Create a New Poll</h1>
                    <p className="create-subtitle">Ask a question and let people vote in real time</p>
                </div>

                {error && (
                    <div className="error-banner">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="create-form">
                    <div className="form-group">
                        <label htmlFor="question">Your Question</label>
                        <input
                            id="question"
                            type="text"
                            placeholder="e.g. What's your favorite programming language?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Options <span className="option-count">({options.length}/6)</span></label>
                        <div className="options-list">
                            {options.map((opt, index) => (
                                <div key={index} className="option-row">
                                    <span className="option-number">{index + 1}</span>
                                    <input
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        value={opt}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        className="form-input"
                                    />
                                    {options.length > 2 && (
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeOption(index)}
                                            title="Remove option"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {options.length < 6 && (
                            <button type="button" className="add-option-btn" onClick={addOption}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                Add Option
                            </button>
                        )}
                    </div>

                    <button type="submit" className="submit-btn" disabled={submitting}>
                        {submitting ? (
                            <>
                                <span className="spinner"></span>
                                Creating...
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                                Create Poll
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Createpage