import { useState } from 'react';
import { toast } from 'sonner';

export default function useGeolocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            toast.error("Geolocation is not supported.");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ coordinates: { lat: latitude, lng: longitude } });
                toast.success("Location captured successfully!");
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                toast.error("Could not get location. Please enter manually.");
                setLoading(false);
            }
        );
    };

    return { location, error, loading, getLocation };
}
