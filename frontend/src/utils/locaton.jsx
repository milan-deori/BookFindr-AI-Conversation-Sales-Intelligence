import React from 'react'

const locaton = () => {
      const [latitude, setLatitude] = useState(null);
      const [longitude, setLongitude] = useState(null);


    useEffect(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLatitude(latitude);
            setLongitude(longitude);
    
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              console.log("Location details:", data);
            } catch (error) {
              console.error("Failed to fetch location details:", error);
            }
          },
          (error) => {
            console.error("Location detection failed:", error.message);
          }
        );
      }
    }, []);
  return (
    <div>locaton</div>
  )
}

export default locaton