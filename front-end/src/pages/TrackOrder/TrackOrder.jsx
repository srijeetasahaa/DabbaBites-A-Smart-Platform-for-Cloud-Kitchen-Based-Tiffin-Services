import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import restaurantIconImg from '../../assets/restaurant.png';
import homeIconImg from '../../assets/home.png';
import deliveryIconImg from '../../assets/bike-icon.png';

const restaurantIcon = new L.Icon({
  iconUrl: restaurantIconImg,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const homeIcon = new L.Icon({
  iconUrl: homeIconImg,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const deliveryIcon = new L.Icon({
  iconUrl: deliveryIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Map follows delivery boy
const MapFollower = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
};

// Route in Kolkata
const generateRoute = () => {
  return [
    [22.5727, 88.3640], [22.5728, 88.3645], [22.5730, 88.3648],
    [22.5732, 88.3652], [22.5736, 88.3656], [22.5740, 88.3660],
    [22.5744, 88.3664], [22.5749, 88.3669], [22.5755, 88.3675],
    [22.5761, 88.3681], [22.5767, 88.3687], [22.5774, 88.3694],
    [22.5781, 88.3701], [22.5788, 88.3708], [22.5795, 88.3715],
    [22.5802, 88.3722], [22.5809, 88.3729], [22.5816, 88.3736],
    [22.5823, 88.3742], [22.5826, 88.3739] // home
  ];
};

const TrackOrder = () => {
  const { orderId } = useParams();
  const [route, setRoute] = useState([]);
  const [index, setIndex] = useState(0);
  const [eta, setEta] = useState(600); // 10 min in seconds
  const [status, setStatus] = useState("Just Left the Restaurant");
  const [delivered, setDelivered] = useState(false);

  useEffect(() => {
    setRoute(generateRoute());
  }, []);

  useEffect(() => {
    if (route.length === 0) return;

    const deliveryInterval = 600000 / route.length; // 10 min total
    const timer = setInterval(() => {
      setIndex((prev) => {
        if (prev < route.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setDelivered(true);
          return prev;
        }
      });
    }, deliveryInterval);

    const etaTimer = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) {
          clearInterval(etaTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(etaTimer);
    };
  }, [route]);

  useEffect(() => {
    const progress = (index / (route.length - 1)) * 100;
    if (progress >= 75) setStatus("Almost There 🚴");
    else if (progress >= 50) setStatus("On The Way 🛣️");
    else if (progress >= 25) setStatus("Picked Up 🍱");
  }, [index, route]);

  if (route.length === 0) return <p>Loading Map...</p>;

  const deliveryPos = route[index];
  const restaurantPos = route[0];
  const homePos = route[route.length - 1];

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div>
      <h2>Track Your Order</h2>

      {delivered ? (
        <div style={{ fontSize: "18px", color: "green", margin: "10px 0" }}>
          ✅ Your order has been delivered!
        </div>
      ) : (
        <>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>ETA:</strong> {formatTime(eta)}</p>
        </>
      )}

      <div style={{ height: "500px", marginTop: "20px" }}>
        <MapContainer center={restaurantPos} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <MapFollower position={deliveryPos} />

          <Polyline positions={route} color="blue" />

          <Marker position={restaurantPos} icon={restaurantIcon}>
            <Popup>🍴 Restaurant</Popup>
          </Marker>

          <Marker position={homePos} icon={homeIcon}>
            <Popup>🏠 Your Home</Popup>
          </Marker>

          <Marker position={deliveryPos} icon={deliveryIcon}>
            <Popup>🚴 Delivery Boy</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default TrackOrder;
