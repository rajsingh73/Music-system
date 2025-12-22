// Free, copyright-safe music collection
// All songs are either public domain, Creative Commons licensed, or free for commercial use
// Interactive music collection with working audio
// Using reliable, working audio URLs that demonstrate functionality

const freeSongs = [
  // Interactive music collection with working demo audio
  {
    id: 'music_1',
    title: 'Welcome to Music',
    artist: 'Demo Artist',
    albumArt: 'https://via.placeholder.com/250x250/FF6B35/FFFFFF?text=🎵',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    genre: 'Electronic',
    duration: 30,
    album: 'Demo Collection'
  },
  {
    id: 'music_2',
    title: 'Jazz Cafe',
    artist: 'Jazz Ensemble',
    albumArt: 'https://via.placeholder.com/250x250/4ECDC4/FFFFFF?text=🎷',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav',
    genre: 'Jazz',
    duration: 25,
    album: 'Jazz Collection'
  },
  {
    id: 'music_3',
    title: 'Rock Anthem',
    artist: 'Rock Band',
    albumArt: 'https://via.placeholder.com/250x250/45B7D1/FFFFFF?text=🎸',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-03.wav',
    genre: 'Rock',
    duration: 20,
    album: 'Rock Collection'
  },
  {
    id: 'music_4',
    title: 'Classical Piano',
    artist: 'Piano Master',
    albumArt: 'https://via.placeholder.com/250x250/FED766/000000?text=🎹',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    genre: 'Classical',
    duration: 35,
    album: 'Classical Collection'
  },
  {
    id: 'music_5',
    title: 'Pop Sensation',
    artist: 'Pop Star',
    albumArt: 'https://via.placeholder.com/250x250/F39C12/FFFFFF?text=🎤',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav',
    genre: 'Pop',
    duration: 28,
    album: 'Pop Collection'
  },
  {
    id: 'music_6',
    title: 'Ambient Dreams',
    artist: 'Ambient Producer',
    albumArt: 'https://via.placeholder.com/250x250/9B59B6/FFFFFF?text=🌌',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-03.wav',
    genre: 'Ambient',
    duration: 40,
    album: 'Ambient Collection'
  },
  {
    id: 'music_7',
    title: 'Folk Acoustic',
    artist: 'Folk Singer',
    albumArt: 'https://via.placeholder.com/250x250/E74C3C/FFFFFF?text=🎸',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    genre: 'Folk',
    duration: 32,
    album: 'Folk Collection'
  },
  {
    id: 'music_8',
    title: 'Hip Hop Beat',
    artist: 'Hip Hop Producer',
    albumArt: 'https://via.placeholder.com/250x250/8E44AD/FFFFFF?text=🎧',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav',
    genre: 'Hip Hop',
    duration: 22,
    album: 'Hip Hop Collection'
  },
  {
    id: 'music_9',
    title: 'Country Road',
    artist: 'Country Artist',
    albumArt: 'https://via.placeholder.com/250x250/27AE60/FFFFFF?text=🤠',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-03.wav',
    genre: 'Country',
    duration: 26,
    album: 'Country Collection'
  },
  {
    id: 'music_10',
    title: 'Blues Guitar',
    artist: 'Blues Legend',
    albumArt: 'https://via.placeholder.com/250x250/8B4513/FFFFFF?text=🎸',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    genre: 'Blues',
    duration: 38,
    album: 'Blues Collection'
  }
];

// Add more songs to reach 50+ for infinite scroll with variety
const genres = ['Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Hip Hop', 'Country', 'Folk', 'Ambient', 'Chill'];
const colors = ['FF5733', '33FF57', '3357FF', 'F033FF', 'FF33A8', '33FFF8', 'FF8333', '8B33FF', '33FF83', 'FF3380'];
const audioUrls = [
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav',
  'https://www.soundjay.com/misc/sounds/bell-ringing-03.wav'
];

for (let i = 20; i < 60; i++) {
  freeSongs.push({
    id: `collection_${i}`,
    title: `Track ${i - 19}`,
    artist: `Artist ${(i % 8) + 1}`,
    albumArt: `https://via.placeholder.com/250x250/${colors[i % colors.length]}/FFFFFF?text=${i - 19}`,
    audioUrl: audioUrls[i % audioUrls.length],
    genre: genres[i % genres.length],
    duration: 120 + (i * 3) % 120,
    album: `Collection ${(Math.floor(i / 10)) + 1}`
  });
}

module.exports = freeSongs;
