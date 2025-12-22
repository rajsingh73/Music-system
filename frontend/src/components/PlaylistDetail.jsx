import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TrackSuggestion from './TrackSuggestion';

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tracks: [],
  });
  const [currentTrackSearch, setCurrentTrackSearch] = useState('');

  useEffect(() => {
    const fetchPlaylist = async () => {
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

        const res = await axios.get(`http://localhost:5000/api/playlists/${id}`, config);
        setPlaylist(res.data);
        setFormData({ name: res.data.name, description: res.data.description, tracks: res.data.tracks });
        setLoading(false);
      } catch (err) {
        console.error(err.response.data);
        setError('Playlist not found or unauthorized');
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id, navigate]);

  useEffect(() => {
    if (location.state && location.state.trackToAdd && playlist) {
      const { trackToAdd } = location.state;
      setFormData((prevData) => ({
        ...prevData,
        tracks: [
          ...prevData.tracks,
          {
            trackId: trackToAdd.trackId,
            title: trackToAdd.title,
            artist: trackToAdd.artist,
            albumArt: trackToAdd.albumArt,
          },
        ],
      }));
      // Clear the state so it doesn't re-add if user navigates back and forth
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, playlist, navigate, location.pathname]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onTrackChange = (index, e) => {
    const newTracks = [...formData.tracks];
    newTracks[index] = { ...newTracks[index], [e.target.name]: e.target.value };
    setFormData({ ...formData, tracks: newTracks });
  };

  const addTrackField = () => {
    setFormData({ ...formData, tracks: [...formData.tracks, { trackId: '', title: '', artist: '', albumArt: '' }] });
  };

  const handleTrackSelect = (track) => {
    setFormData({
      ...formData,
      tracks: [
        ...formData.tracks,
        {
          trackId: track.trackId,
          title: track.title,
          artist: track.artist,
          albumArt: track.albumArt,
        },
      ],
    });
    setCurrentTrackSearch('');
  };

  const removeTrackField = (index) => {
    const newTracks = formData.tracks.filter((_, i) => i !== index);
    setFormData({ ...formData, tracks: newTracks });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      };
      await axios.put(`http://localhost:5000/api/playlists/${id}`, formData, config);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
      alert('Failed to update playlist');
    }
  };

  const onDelete = async () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        await axios.delete(`http://localhost:5000/api/playlists/${id}`, config);
        navigate('/dashboard');
      } catch (err) {
        console.error(err.response.data);
        alert('Failed to delete playlist');
      }
    }
  };

  if (loading) return     <div className="min-h-screen flex items-center justify-center bg-[#191414] text-white p-6 md:p-10 lg:p-12">
      {loading && <div className="min-h-screen flex items-center justify-center bg-[#191414] text-white">Loading...</div>}
      {error && <div className="min-h-screen flex items-center justify-center bg-[#191414] text-red-500">{error}</div>}
      {!playlist && !loading && !error && null}

      {playlist && (
        <div className="min-h-screen bg-[#191414] text-white p-6 md:p-10 lg:p-12">
          <h1 className="text-4xl font-bold text-[#1DB954] mb-8 text-center">Edit Playlist</h1>
          <form onSubmit={onSubmit} className="max-w-xl mx-auto bg-[#282828] p-8 rounded-lg shadow-xl">
            <div className="mb-5">
              <label htmlFor="name" className="block text-[#B3B3B3] text-sm font-bold mb-2">
                Playlist Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                className="shadow-sm appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#1DB954] bg-gray-700 transition duration-200"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="description" className="block text-[#B3B3B3] text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={onChange}
                className="shadow-sm appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#1DB954] bg-gray-700 transition duration-200"
                rows="3"
              ></textarea>
            </div>

            <h3 className="text-2xl font-bold text-[#1DB954] mb-6">Edit Tracks</h3>

            {/* Track Search and Add */}
            <div className="mb-6">
              <label className="block text-[#B3B3B3] text-sm font-bold mb-2">Search and Add Track</label>
              <TrackSuggestion
                value={currentTrackSearch}
                onChange={setCurrentTrackSearch}
                onSelect={handleTrackSelect}
                placeholder="Type to search for tracks..."
              />
            </div>

            {/* Added Tracks List */}
            <h4 className="text-lg font-bold text-white mb-4">Playlist Tracks ({formData.tracks.length})</h4>
            {formData.tracks.map((track, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {track.albumArt && (
                    <img src={track.albumArt} alt="Album Art" className="w-12 h-12 rounded-md object-cover" />
                  )}
                  <div>
                    <p className="text-white font-medium">{track.title}</p>
                    <p className="text-[#B3B3B3] text-sm">{track.artist}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeTrackField(index)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300 transform hover:scale-105"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-[#1DB954] hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
              >
                Update Playlist
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
              >
                Delete Playlist
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
};

export default PlaylistDetail;

