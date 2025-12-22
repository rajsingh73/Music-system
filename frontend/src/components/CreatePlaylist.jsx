import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TrackSuggestion from './TrackSuggestion';

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tracks: [],
  });
  const [currentTrackSearch, setCurrentTrackSearch] = useState('');

  useEffect(() => {
    if (location.state && location.state.trackToAdd) {
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
    }
  }, [location.state]);

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
      await axios.post('http://localhost:5000/api/playlists', formData, config);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
      alert('Failed to create playlist');
    }
  };

  return (
    <div className="min-h-screen bg-[#191414] text-white p-6 md:p-10 lg:p-12">
      <h1 className="text-4xl font-bold text-[#1DB954] mb-8 text-center">Create New Playlist</h1>
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

        <h3 className="text-2xl font-bold text-[#1DB954] mb-6">Add Tracks to Playlist</h3>

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
        <h4 className="text-lg font-bold text-white mb-4">Added Tracks ({formData.tracks.length})</h4>
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

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#1DB954] hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
          >
            Create Playlist
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlaylist;

