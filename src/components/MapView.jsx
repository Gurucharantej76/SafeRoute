import React, { useState, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import Map, { NavigationControl, Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import * as geojsonUtils from '@mapbox/geojson-utils';
import { MapPin, AlertTriangle, CheckCircle, Compass } from 'lucide-react';

const MapView = forwardRef((props, ref) => {
  const [viewport, setViewport] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 5
  });
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [safetyScores, setSafetyScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const mapRef = useRef();

  const calculateSafetyScore = (route) => {
    let score = 100;
    let safetyDetails = {
      wellLitAreas: 0,
      crowdedAreas: 0,
      highRiskZones: 0,
      totalSteps: route.legs[0].steps.length
    };

    // Dummy data for demonstration (replace with actual GeoJSON data)
    const dangerZones = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [80.21, 13.07]
          },
          properties: {
            type: 'highRisk',
            radius: 500
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [80.25, 13.06]
          },
          properties: {
            type: 'lowLight',
            radius: 300
          }
        }
      ]
    };

    const crowdedAreas = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [80.22, 13.08]
          },
          properties: {
            radius: 400
          }
        }
      ]
    };

    try {
      route.legs[0].steps.forEach((step) => {
        const point = {
          type: 'Point',
          coordinates: [step.end_location.lng, step.end_location.lat]
        };

        // Check for danger zones
        dangerZones.features.forEach((zone) => {
          const distance = geojsonUtils.pointDistance(point, zone.geometry);
          if (distance < 0.01) {
            score -= 30;
            if (zone.properties.type === 'highRisk') safetyDetails.highRiskZones++;
            if (zone.properties.type === 'lowLight') safetyDetails.wellLitAreas--;
          }
        });

        // Check for crowded areas
        crowdedAreas.features.forEach((area) => {
          const distance = geojsonUtils.pointDistance(point, area.geometry);
          if (distance < 0.01) {
            score += 10;
            safetyDetails.crowdedAreas++;
          }
        });
      });
    } catch (error) {
      console.error('Error calculating safety score:', error);
      return { score: 50, safetyDetails };
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      safetyDetails
    };
  };

  const getRoutesWithSafetyScore = async (origin, destination) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`,
        {
          params: {
            access_token: process.env.REACT_APP_MAPBOX_TOKEN,
            alternatives: true,
            geometries: 'geojson'
          }
        }
      );

      const routeData = response.data.routes.map(route => calculateSafetyScore(route));
      const scores = routeData.map(data => data.score);
      const safetyDetails = routeData.map(data => data.safetyDetails);

      setRoutes(response.data.routes);
      setSafetyScores(scores);
      setSelectedRoute(null);
    } catch (err) {
      console.error('Error getting routes:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRouteColor = (score) => {
    if (score >= 80) return 'bg-success';
    if (score >= 50) return 'bg-primary';
    return 'bg-accent-red';
  };

  const getRouteIcon = (score) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4" />;
    if (score >= 50) return <MapPin className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  useImperativeHandle(ref, () => ({
    getRoutesWithSafetyScore
  }));

  return (
    <div className="relative w-full h-full bg-neutral-background">
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white-surface p-6 rounded-lg shadow-lg z-10 max-w-md">
          <h3 className="text-xl font-bold text-text-primary mb-2">Calculating Safe Routes</h3>
          <p className="text-text-secondary">Analyzing safety factors including lighting, crowd density, and risk zones</p>
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white-surface p-6 rounded-lg shadow-lg z-10 max-w-md">
          <h3 className="text-xl font-bold text-accent-red mb-2">Error</h3>
          <p className="text-text-secondary">{error}</p>
        </div>
      )}

      <Map
        ref={mapRef}
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

        {userLocation && (
          <Marker
            longitude={userLocation.lng}
            latitude={userLocation.lat}
          >
            <div className="bg-primary p-2 rounded-full text-white">
              <MapPin className="w-4 h-4" />
            </div>
          </Marker>
        )}

        {routes.map((route, index) => (
          <React.Fragment key={index}>
            <Marker
              longitude={route.legs[0].steps[Math.floor(route.legs[0].steps.length / 2)].end_location.lng}
              latitude={route.legs[0].steps[Math.floor(route.legs[0].steps.length / 2)].end_location.lat}
              onClick={() => setSelectedRoute(index)}
            >
              <div className={`${getRouteColor(safetyScores[index])} p-2 rounded-full text-white flex items-center justify-center`}>
                {getRouteIcon(safetyScores[index])}
              </div>
            </Marker>

            {selectedRoute === index && (
              <Popup
                longitude={route.legs[0].steps[Math.floor(route.legs[0].steps.length / 2)].end_location.lng}
                latitude={route.legs[0].steps[Math.floor(route.legs[0].steps.length / 2)].end_location.lat}
                onClose={() => setSelectedRoute(null)}
                closeButton={false}
                anchor="bottom"
              >
                <div className="p-4 bg-white-surface rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-text-primary">Route Safety Details</h3>
                    <div className={`${getRouteColor(safetyScores[index])} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                      {safetyScores[index]}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-text-secondary">
                      <CheckCircle className="w-4 h-4 mr-2 text-success" />
                      <span>Well-lit areas: {route.safetyDetails?.wellLitAreas}</span>
                    </div>
                    <div className="flex items-center text-text-secondary">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      <span>Crowded areas: {route.safetyDetails?.crowdedAreas}</span>
                    </div>
                    <div className="flex items-center text-text-secondary">
                      <AlertTriangle className="w-4 h-4 mr-2 text-accent-red" />
                      <span>High-risk zones: {route.safetyDetails?.highRiskZones}</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-colors">
                    <Compass className="w-4 h-4 mr-2" />
                    Start Navigation
                  </button>
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}
      </Map>
    </div>
  );
});

export default MapView; 