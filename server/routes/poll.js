const express = require('express')
const router = express.Router();
const Poll = require("../models/Poll.js")

//get all polls , newest first

router.get('/getall', async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });
        res.status(200).json(polls)
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message })
    }
})

router.post('/createpoll', async (req, res) => {
    try {
        const { question, options } = req.body;
        if (!question || !options || options.length < 2) {
            return res.status(400).json({ message: "question and atleast 2 options" })
        }
        const formattedoptions = options.map((opt) => ({
            text: typeof opt === 'string' ? opt : opt.text,
            votes: 0
        }))

        const poll = await new Poll({ question, options: formattedoptions })
        await poll.save();
        res.status(200).json(poll);
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message })
    }
})

//get single poll
router.get('/getbyid/:pollId', async (req, res) => {
    try {
        const { pollId } = req.params;
        const poll = await Poll.findById(pollId)
        if (!poll) return res.status(404).json({ message: 'poll not found' })
        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})

//submit a vote
router.post('/vote/:id', async (req, res) => {
try {
        const { id } = req.params;
        const poll = await Poll.findById(id);
        const { optionIndex } = req.body
        if (!poll) {
            return res.status(404).json({
                message: "Poll not found",
            });
        }
        if (
            optionIndex < 0 ||
            optionIndex >= poll.options.length
        ) {
            return res.status(400).json({
                message: "Invalid option",
            });
        }
    
        poll.options[optionIndex].votes +=1;
        poll.totalvotes+=1;
    
        await poll.save();
        res.status(200).json({
            message:"vote recorded sucessfully",
            poll
        })
} catch (error) {
    res.status(500).json({
            message: "Server error",
            error: error.message,
        });
}


})


module.exports = router

