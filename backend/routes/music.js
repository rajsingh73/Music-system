const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const freeSongs = require('../data/songs');

// @route   GET api/music/search
// @desc    Search for music from local free music collection
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { term, page = 0 } = req.query;
    const limit = 20;
    const offset = page * limit;

    let filteredSongs = freeSongs;

    // If search term provided, filter songs
    if (term && term.trim()) {
      const searchTerm = term.toLowerCase();
      filteredSongs = freeSongs.filter(song =>
        song.title.toLowerCase().includes(searchTerm) ||
        song.artist.toLowerCase().includes(searchTerm) ||
        song.genre.toLowerCase().includes(searchTerm) ||
        song.album.toLowerCase().includes(searchTerm)
      );
    }

    // Paginate results
    const paginatedSongs = filteredSongs.slice(offset, offset + limit);

    // Format for frontend compatibility
    const songs = paginatedSongs.map(song => ({
      trackId: song.id,
      title: song.title,
      artist: song.artist,
      albumArt: song.albumArt,
      previewUrl: song.audioUrl,
      collectionName: song.album,
      duration: song.duration,
      genre: song.genre
    }));

    console.log(`Returning ${songs.length} songs from local collection (search: "${term || 'all'}", page: ${page})`);
    res.json(songs);
  } catch (err) {
    console.error('Search Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/music/browse
// @desc    Browse music by index/page (for infinite scroll)
// @access  Private
router.get('/browse', auth, async (req, res) => {
  try {
    const { page = 0 } = req.query;
    const limit = 20;
    const offset = page * limit;

    // Get songs from local collection
    const paginatedSongs = freeSongs.slice(offset, offset + limit);

    // Format for frontend compatibility
    const songs = paginatedSongs.map(song => ({
      trackId: song.id,
      title: song.title,
      artist: song.artist,
      albumArt: song.albumArt,
      previewUrl: song.audioUrl,
      collectionName: song.album,
      duration: song.duration,
      genre: song.genre
    }));

    console.log(`Browsing returned ${songs.length} songs from local collection (page: ${page})`);
    res.json(songs);
  } catch (err) {
    console.error('Browse Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

