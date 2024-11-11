import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { TextField, Box } from '@mui/material';

const Map = ({ locations }) => {
    const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Initial center

    const handleSearch = (e) => {
        const location = locations.find(loc => loc.name.toLowerCase() === e.target.value.toLowerCase());
        if (location) {
            setMapCenter([location.lat, location.lng]);
        }
    };

    function MapResizeTrigger() {
        const map = useMap();
        useEffect(() => {
            map.invalidateSize(); // Forces Leaflet to re-check the container size
        }, [map]);
        return null;
    }

    return (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
            <TextField
                label="Search Location"
                variant="outlined"
                onChange={handleSearch}
                sx={{ mb: 2 }}
            />
            <Box sx={{ width: '100%', height: '400px' }}> {/* Set container for the map */}
                <MapContainer center={mapCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
                    <MapResizeTrigger /> {/* Trigger map resize */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {locations.map((location, index) => (
                        <Marker key={index} position={[location.lat, location.lng]}>
                            <Popup>{location.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Box>
        </Box>
    );
};

export default Map;
