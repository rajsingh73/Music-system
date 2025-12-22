const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Playlist = require('../models/Playlist');
const { check, validationResult } = require('express-validator');

// @route   GET api/playlists
// @desc    Get all user playlists
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(playlists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/playlists
// @desc    Create a playlist
// @access  Private
router.post(
  '/',
  [auth, [check('name', 'Name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, tracks } = req.body;

    try {
      const newPlaylist = new Playlist({
        user: req.user.id,
        name,
        description,
        tracks,
      });

      const playlist = await newPlaylist.save();
      res.json(playlist);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/playlists/:id
// @desc    Update a playlist
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, description, tracks } = req.body;

  // Build playlist object
  const playlistFields = {};
  if (name) playlistFields.name = name;
  if (description) playlistFields.description = description;
  if (tracks) playlistFields.tracks = tracks;

  try {
    let playlist = await Playlist.findById(req.params.id);

    if (!playlist) return res.status(404).json({ msg: 'Playlist not found' });

    // Make sure user owns playlist
    if (playlist.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    playlist = await Playlist.findByIdAndUpdate(
      req.params.id,
      { $set: playlistFields },
      { new: true }
    );

    res.json(playlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/playlists/:id
// @desc    Delete a playlist
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) return res.status(404).json({ msg: 'Playlist not found' });

    // Make sure user owns playlist
    if (playlist.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Playlist.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Playlist removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

