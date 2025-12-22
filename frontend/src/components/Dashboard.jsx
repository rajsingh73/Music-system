import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PlaylistCard from './PlaylistCard';
import AudioControls from './AudioControls';
import ExploreMoreModal from './ExploreMoreModal';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const navigate = useNavigate();

  const loadFeaturedSongs = async (config) => {
    try {
      console.log('Loading featured songs...');
      const res = await axios.get('http://localhost:5000/api/music/search?page=0', config);
      const songs = res.data.slice(0, 5); // Show first 5 songs as featured
      setFeaturedSongs(songs);
      console.log('Loaded featured songs:', songs);
    } catch (err) {
      console.error('Failed to load featured songs:', err);
      setFeaturedSongs([]);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return navigate('/login');
        }

        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        // Fetch user profile
        const userRes = await axios.get('http://localhost:5000/api/profile', config);
        setUser(userRes.data);

        // Fetch user playlists
        const playlistsRes = await axios.get('http://localhost:5000/api/playlists', config);
        setPlaylists(playlistsRes.data);

        // Fetch recommendations (fallback to featured songs if empty)
        try {
          const recsRes = await axios.get('http://localhost:5000/api/recommendations', config);
          if (recsRes.data && recsRes.data.length > 0) {
            setRecommendations(recsRes.data);
          } else {
            // Load featured songs from our music collection
            await loadFeaturedSongs(config);
          }
        } catch (err) {
          console.log('Recommendations not available, loading featured songs...');
          await loadFeaturedSongs(config);
        }
      } catch (err) {
        console.error(err.response.data);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const playTrack = (track) => {
    setCurrentTrack(track);
    console.log('Playing track:', track.title);
  };

  const addTrackToPlaylist = (track) => {
    navigate('/create-playlist', { state: { trackToAdd: track } });
  };

  const openExploreModal = () => {
    setShowExploreModal(true);
  };

  const closeExploreModal = () => {
    setShowExploreModal(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return navigate('/login');
      }
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.get(`http://localhost:5000/api/music/search?term=${searchTerm}`, config);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err.response.data);
      alert('Failed to search for music');
    }
  };

  return (
    <div className="min-h-screen bg-[#191414] text-white p-6 md:p-10 lg:p-12">
      <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#282828]">
        <h1 className="text-4xl font-extrabold text-[#1DB954]">Welcome, {user && user.username}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* Music Search Section */}
      <div className="mb-12 p-6 bg-[#282828] rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-[#1DB954] mb-6">Search for Music</h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search by song title or artist..."
            className="flex-grow shadow-sm appearance-none border border-gray-600 rounded-full w-full py-3 px-5 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#1DB954] bg-gray-700 transition duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#1DB954] hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
          >
            Search
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-2xl font-bold text-[#1DB954]">Search Results</h3>
            {searchResults.map((track) => (
              <div key={track.trackId} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between transition duration-300 hover:bg-gray-700">
                <div className="flex items-center space-x-4">
                  {track.albumArt && <img src={track.albumArt} alt="Album Art" className="w-16 h-16 rounded-md object-cover shadow-md" />}
                  <div>
                    <h4 className="text-xl font-bold text-white">{track.title}</h4>
                    <p className="text-[#B3B3B3]">{track.artist} - {track.collectionName}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => playTrack(track)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 text-sm"
                  >
                    Play Preview
                  </button>
                  <button
                    onClick={() => navigate('/create-playlist', { state: { trackToAdd: track } })}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 text-sm"
                  >
                    Add to Playlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Playlists Section */}
        <div className="p-6 bg-[#282828] rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-[#1DB954] mb-6">Your Playlists</h2>
          <button
            onClick={() => navigate('/create-playlist')}
            className="bg-[#1DB954] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full mb-6 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
          >
            Create New Playlist
          </button>
          {playlists.length > 0 ? (
            <div className="space-y-6">
              {playlists.map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} playTrack={playTrack} />
              ))}
            </div>
          ) : (
            <p className="text-[#B3B3B3] text-lg">You don't have any playlists yet. Create one!</p>
          )}
        </div>

        {/* Recommendations/Featured Songs Section */}
        <div className="p-6 bg-[#282828] rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#1DB954]">
              {recommendations.length > 0 ? 'Recommended For You' : 'Featured Songs'}
            </h2>
            <button
              onClick={openExploreModal}
              className="bg-[#1DB954] hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105"
            >
              Explore More
            </button>
          </div>
          {(recommendations.length > 0 || featuredSongs.length > 0) ? (
            <div className="space-y-6">
              {(recommendations.length > 0 ? recommendations : featuredSongs).map((track) => (
                <div key={track.trackId || track.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between transition duration-300 hover:bg-gray-700">
                  <div className="flex items-center space-x-4">
                    {track.albumArt && <img src={track.albumArt} alt="Album Art" className="w-16 h-16 rounded-md object-cover shadow-md" />}
                    <div>
                      <h3 className="text-xl font-bold text-white">{track.title}</h3>
                      <p className="text-[#B3B3B3]">{track.artist} {track.collectionName && `- ${track.collectionName}`}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => playTrack(track)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 text-sm"
                    >
                      Play
                    </button>
                    <button
                      onClick={() => addTrackToPlaylist(track)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 text-sm"
                    >
                      Add to Playlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#B3B3B3] text-lg">Loading songs...</p>
          )}
        </div>
      </div>

      {/* Audio Controls */}
      {currentTrack && <AudioControls track={currentTrack} />}

      {/* Explore More Modal */}
      <ExploreMoreModal
        isOpen={showExploreModal}
        onClose={closeExploreModal}
        playTrack={playTrack}
        addToPlaylist={addTrackToPlaylist}
      />
    </div>
  );
};

export default Dashboard;

