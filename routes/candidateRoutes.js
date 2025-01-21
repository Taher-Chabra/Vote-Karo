const router = require('express').Router();
const Candidate = require('../models/candidate');
const User = require('../models/user');
const { jwtAuthMiddleware } = require('../jwt');

// Function to check if the user has admin role

async function checkAdminRole(userId) {
   try {
      const user = await User.findById(userId);
      return user.role === 'admin';
   } catch (error) {
      console.error(error);
      return false;
   }
}

// POST route to create a new candidate

router.post('/', jwtAuthMiddleware, async (req, res) => {
   try {
      // Check if the user has admin role
      if (!(await checkAdminRole(req.user.id)))
         return res.status(403).json({message: 'User does not have admin role'});

      const data = req.body;
      const newCandidate = new Candidate(data);
      const response = await newCandidate.save();
      console.log('Candidate created');
      res.status(200).json({message: 'Candidate created', candidate: response});
   }
   catch (err) {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
   }
});

// update candidate info

router.put('/:candidateId', jwtAuthMiddleware, async (req, res) => {
   try {
      if (!(await checkAdminRole(req.user.id)))
         return res.status(403).json({message: 'User does not have admin role'});

      // Extract the candidate id from the params
      const candidateId = req.params.candidateId;
      // Extract the updated data from the request body
      const updatedData = req.body;
      // Find the candidate by id and update the data
      const response = await Candidate.findByIdAndUpdate(candidateId, updatedData, {
         new: true,
         runValidators: true
      });

      if (!response)
         return res.status(404).json({message: 'Candidate not found'});

      console.log('Candidate data updated');
      res.status(200).json({message: 'Candidate data updated', candidate: response});
   }
   catch (error) { 
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
   }
});

// delete candidate

router.delete('/:candidateId', jwtAuthMiddleware,
    async (req, res) => {
   try {
      if (!(await checkAdminRole(req.user.id)))
         return res.status(403).json({message: 'User does not have admin role'});

      const candidateId = req.params.candidateId;
      const response = await Candidate.findByIdAndDelete(candidateId);

      if (!response)
         return res.status(404).json({message: 'Candidate not found'});

      console.log('Candidate deleted');
      res.status(200).json({message: 'Candidate deleted'});
   } 
   catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
   }
});

// Voting the candidate

router.post('/vote/:candidateId', jwtAuthMiddleware, async (req, res) => {
   // Admin cannot vote
   // User can only vote once
   const candidateId = req.params.candidateId;
   const userId = req.user.id;
   try {
      const candidate = await Candidate.findById(candidateId);
      if (!candidate)
         return res.status(404).json({message: 'Candidate not found'});

      const user = await User.findById(userId);
      if (!user)
         return res.status(404).json({message: 'User not found'});

      // Check if the user has already voted
      if (user.isVoted)
         return res.status(403).json({message: 'User has already voted'});

      // Check if the user has admin role
      if (user.role === 'admin')
         return res.status(403).json({message: 'Admin cannot vote'});

      // Update the candidate document by adding the user id to the votes array
      candidate.votes.push({user : userId});
      // Increment the vote count
      candidate.voteCount++;
      await candidate.save();

      // Update the user document to indicate that the user has voted
      user.isVoted = true;
      await user.save();

      res.status(200).json({message: 'Vote added'});
   } 
   catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
   }
});

// Get total vote count of a candidate

router.get('/vote/count', async (req, res) => {
   try {
      // Find all candidates and sort them by vote count in descending order
      const candidates = await Candidate.find().sort({voteCount: "desc"});

      const voteRecords = candidates.map(candidate => {
         return {
            party: candidate.party,
            count: candidate.voteCount
         }
      });

      res.status(200).json({voteRecords});
   }
   catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
   }
});

// Get all candidates

router.get('/candidates', async (req, res) => {
   try {
      const allCandidates = await Candidate.find();

      const candidateRecords = allCandidates.map(candidate => {
         return {
            name: candidate.name,
            party: candidate.party,
         }
      })

      res.status(200).json({candidateRecords});
   }
   catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
   }
});

module.exports = router;