const mongoose = require('mongoose');

const ListeningHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  trackId: {
    type: String, // This will store the ID from the external music API
    required: true,
  },
  listenedAt: {
    type: Date,
    default: Date.now,
  },
  moodTags: [
    {
      type: String,
    },
  ], // e.g., ['happy', 'workout']
});

module.exports = mongoose.model('ListeningHistory', ListeningHistorySchema);

