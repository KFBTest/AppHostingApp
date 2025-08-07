"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon not showing up
// This is a common issue when using Leaflet with bundlers like Webpack
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Define the type for the geolocation API response
interface GeolocationData {
  status: string;
  lat: number;
  lon: number;
  city: string;
  country: string;
}

const IpGeolocationMap: React.FC = () => {
  const [locationData, setLocationData] = useState<GeolocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const ipApiUrl = "https://ip-api.com/json";
        const response = await fetch(ipApiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch geolocation data');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setLocationData(data);
        } else {
          setError('Failed to get location.');
        }
      } catch (err) {
        console.error("Error fetching location:", err);
        setError('An error occurred while fetching your location.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Location</h1>
        {loading && (
          <p className="text-gray-600 mb-4">Fetching your location based on your IP address...</p>
        )}
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        {locationData && (
          <>
            <MapContainer
              center={[locationData.lat, locationData.lon]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: '500px', width: '100%' }}
              className="rounded-lg shadow-md"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[locationData.lat, locationData.lon]}>
                <Popup>
                  <b>You are here!</b><br />{locationData.city}, {locationData.country}
                </Popup>
              </Marker>
            </MapContainer>
            <div id="location-details" className="mt-6 text-left">
              <h3 className="text-xl font-semibold mb-2">Location Details:</h3>
              <p><strong>City:</strong> {locationData.city}</p>
              <p><strong>Country:</strong> {locationData.country}</p>
              <p><strong>Latitude:</strong> {locationData.lat}</p>
              <p><strong>Longitude:</strong> {locationData.lon}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IpGeolocationMap;
