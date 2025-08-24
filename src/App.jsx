import React, { useState } from "react";
import axios from "axios";

const apiKey = "13831b532ba34ba90b49ae8470540329";

//images for each weather type 
const weatherBackgrounds = {
  Clear: "https://images.squarespace-cdn.com/content/v1/621fdbf4dee9cb1743074e0a/b03a4c8e-25f2-4255-9b4d-c854933833d8/Sugar+maple+tree_fall+colour.jpg",
  Clouds: "https://live.staticflickr.com/1828/28636482297_bd428f26e8_b.jpg",
  Rain: "https://img.freepik.com/free-photo/weather-effects-composition_23-2149853295.jpg?semt=ais_hybrid&w=740",
  Snow: "https://www.usatoday.com/gcdn/authoring/authoring-images/2024/10/17/USAT/75714706007-usatsi-24195665.jpg?crop=3475,1955,x0,y169&width=3200&height=1801&format=pjpg&auto=webp",
  Thunderstorm: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Lightning_Pritzerbe_01_%28MK%29.jpg/960px-Lightning_Pritzerbe_01_%28MK%29.jpg",
  Drizzle: "https://t3.ftcdn.net/jpg/02/59/08/18/360_F_259081839_nSKUdEPnAnL2ybKqfwuv6tK3uWLEK6ry.jpg",
  Mist: "https://openweather.co.uk/_next/image?url=%2Fapi%2Fmedia%2Ffile%2Fow_fog_1.jpg&w=1920&q=75",
  Default: "https://images.pexels.com/photos/1107717/pexels-photo-1107717.jpeg?cs=srgb&dl=pexels-fotios-photos-1107717.jpg&fm=jpg",
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      setWeather(res.data);
    } catch (err) {
      setError("City not found or invalid API key");
    } finally {
      setLoading(false);
    }
  };

  const getBackground = () => {
    if (!weather) return weatherBackgrounds.Default;
    return weatherBackgrounds[weather.weather[0].main] || weatherBackgrounds.Default;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-3 transition-all duration-700"
      style={{ backgroundImage: `url(${getBackground()})` }}
    >
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-md">Weather</h1>

        {/*-------------------Search-------------------*/}
        <div className="flex mb-6">
          <input
            type="text"
            placeholder="Enter city..."
            className="flex-1 px-[13px] py-2 rounded-l-2xl outline-none text-black"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-r-2xl hover:bg-blue-700"
            onClick={fetchWeather}
          >
            Search
          </button>
        </div>

        {/*-------------------Loading-------------------*/}
        {loading && <p className="text-white mb-4">Loading...</p>}

        {/*-------------------Error-------------------*/}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        {/*-------------------Weather Card------------------------*/}
        {weather && (
          <div className="bg-white/20 p-4 rounded-2xl shadow-2xl text-white backdrop-blur-md">
            <h2 className="text-xl font-semibold">{weather.name}, {weather.sys?.country}</h2>
            <div className="flex items-center justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@4x.png`}
                alt={weather.weather?.[0]?.description}
                className="w-[20vw] h-[9vh] md:w-[10vw] md:h-[19vh]"
              />
              <h1 className="text-5xl font-bold ml-4">{Math.round(weather.main?.temp)}°C</h1>
            </div>
            <p className="text-lg capitalize">{weather.weather?.[0]?.description}</p>
            <div className="flex justify-between mt-4 text-white/90 font-medium">
              <p>Humidity: {weather.main?.humidity}%</p>
              <p>Wind: {weather.wind?.speed} m/s</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
