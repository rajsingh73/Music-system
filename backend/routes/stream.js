const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');
const freeSongs = require('../data/songs');

require('dotenv').config();

// @route   GET api/stream/:trackId
// @desc    Stream a track from local free music collection
// @access  Private
router.get('/:trackId', auth, async (req, res) => {
  try {
    const { trackId } = req.params;

    // Find the song in our local collection
    const song = freeSongs.find(song => song.id === trackId);

    if (song) {
      console.log(`Found audio URL for track ${trackId}: ${song.title}`);
      return res.json({ previewUrl: song.audioUrl });
    }

    // If not found in local collection, check for generated/browse tracks
    if (trackId.startsWith('generated_') || trackId.startsWith('browse_')) {
      // Extract index from generated track ID
      const indexMatch = trackId.match(/(\d+)$/);
      if (indexMatch) {
        const index = parseInt(indexMatch[1]);
        if (index >= 0 && index < freeSongs.length) {
          const song = freeSongs[index];
          console.log(`Found generated audio URL for track ${trackId}: ${song.title}`);
          return res.json({ previewUrl: song.audioUrl });
        }
      }
    }

    // Handle legacy demo tracks
    if (trackId.startsWith('demo_') || trackId.startsWith('fallback_')) {
      const demoTracks = {
        'demo_1': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        'demo_2': 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav',
        'demo_3': 'https://www.soundjay.com/misc/sounds/bell-ringing-03.wav',
        'fallback_1': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        'fallback_2': 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav'
      };

      const previewUrl = demoTracks[trackId];
      if (previewUrl) {
        console.log(`Returning legacy demo track URL for ${trackId}`);
        return res.json({ previewUrl });
      }
    }

    console.log(`No audio URL found for track ${trackId}`);
    return res.status(404).json({ msg: 'Audio URL not found for this track.' });

  } catch (err) {
    console.error('Stream API Error:', err.message);

    // Ultimate fallback - return a working audio URL
    console.log('Using ultimate fallback audio URL');
    return res.json({
      previewUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    });
  }
});

module.exports = router;

