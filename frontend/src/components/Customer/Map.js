import React, { useEffect, useRef } from 'react';

const Map = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        // Function to initialize the map
        const initMap = () => {
            new window.google.maps.Map(mapRef.current, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });
        };

        // Load the Google Maps script and call initMap
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?sensor=false&callback=initMap`;
            script.async = true;
            script.defer = true;
            script.onload = initMap; // Initialize map once script is loaded
            document.head.appendChild(script);
        };

        // Check if the Google Maps API script is already present
        if (!window.google) {
            loadGoogleMapsScript();
        } else {
            initMap(); // Initialize map if Google Maps is already loaded
        }
    }, []);

    return (
        <div
            ref={mapRef}
            style={{ height: '800px', width: '100%' }} // Set desired map size here
        />
    );
};

export default Map;
