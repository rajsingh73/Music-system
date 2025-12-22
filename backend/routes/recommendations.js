const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ListeningHistory = require('../models/ListeningHistory');

// @route   GET api/recommendations
// @desc    Get mood-based recommendations
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // TODO: Implement actual recommendation logic based on listening history and mood tags.
    // For now, this is a placeholder returning a mock recommendation.

    const userHistory = await ListeningHistory.find({ user: req.user.id }).sort({ listenedAt: -1 }).limit(10);

    let recommendedTracks = [];

    if (userHistory.length > 0) {
      // Simple logic: recommend tracks based on the most common mood tags in the user's recent history.
      const moodTagCounts = {};
      userHistory.forEach(item => {
        item.moodTags.forEach(tag => {
          moodTagCounts[tag] = (moodTagCounts[tag] || 0) + 1;
        });
      });

      const sortedMoodTags = Object.keys(moodTagCounts).sort(
        (a, b) => moodTagCounts[b] - moodTagCounts[a]
      );

      // For demonstration, just return some mock tracks based on top mood tag
      if (sortedMoodTags.length > 0) {
        const topMoodTag = sortedMoodTags[0];
        recommendedTracks = [
          { id: 'mocktrack1', title: `Recommended for ${topMoodTag} mood 1`, artist: 'Artist A', albumArt: '' },
          { id: 'mocktrack2', title: `Recommended for ${topMoodTag} mood 2`, artist: 'Artist B', albumArt: '' },
        ];
      }
    } else {
      // If no history, return some generic recommendations
      recommendedTracks = [
        { id: 'generic1', title: 'Generic Recommended Track 1', artist: 'Generic Artist 1', albumArt: '' },
        { id: 'generic2', title: 'Generic Recommended Track 2', artist: 'Generic Artist 2', albumArt: '' },
      ];
    }

    res.json(recommendedTracks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

