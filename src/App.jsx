import { useState, useRef } from "react";
import countryList from "country-list";
import axios from "axios";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherDescData, setWeatherDescData] = useState(null);
  const [weatherImage, setWeatherImage] = useState(false);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [tempData, setTempData] = useState(null);
  const searchInput = useRef("");
  const apiKey = "a1d832c101f04481e98ece5a0a6cb290";
  let celsius = null;
  let convertCountryCode = null;

  // function to search for a city and fetch data
  function handleSearch() {
    setLoading(true);
    const fetchData = async () => {
      try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.current.value}&appid=${apiKey}`;

        const response = await axios.get(apiUrl);
        setLoading(false);

        // console.log(response.data);
        return (
          setWeatherData(response.data.weather[0].main),
          setWeatherDescData(response.data.weather[0].description),
          setWeatherIcon(response.data.weather[0].icon),
          setCountryData(response.data.sys.country),
          setTempData(response.data.main.temp),
          setWeatherImage(true)
        );
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
      }
    };

    fetchData();
  }

  // function to convert country code to lower case after fetching
  function convertCountryCodeToLowerCase(countryData) {
    if (typeof countryData === "string") {
      return (convertCountryCode = countryData.toLowerCase());
    } else {
      convertCountryCode = "";
    }
  }
  convertCountryCodeToLowerCase(countryData); // function call

  const countryName = countryList.getName(convertCountryCode);

  // Function to convert Kelvin to Celsius
  function kelvinToCelsius(tempData) {
    if (typeof tempData === "number" && !isNaN(tempData)) {
      return (celsius = `${Math.round(tempData - 273.15)}°C`);
    } else {
      celsius = null;
    }
  }

  kelvinToCelsius(tempData);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      handleSearch();
    }
  };

  return (
    <div className="mt-8 m-auto p-3 w-[400px] lg:w-[500px] flex flex-col">
      <h1 className="text-center text-2xl font-bold">Weather App</h1>
      <h2 className="text-center text-md font-semibold">Enter a city name to get the weather</h2>
      <input
        className="mt-8 p-2 border rounded-md w-full"
        type="search"
        name="search"
        id="search"
        placeholder="input city name here"
        ref={searchInput}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSearch}
        type="submit"
        className="bg-blue-700 p-2 rounded-md text-white mt-2 hover:bg-blue-500 transition-all duration-300 ease-in-out w-1/2 text-center text-sm font-semibold focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-blue-400 active:text-white ">
        Search
      </button>

      {loading ? (
        <div className="flex mt-8 p-4 justify-center items-center text-center rounded-md bg-blue-200">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="">Loading...</p>
        </div>
      ) : (
        <section className="relative">
          <div className="mt-8 p-4 flex flex-col gap-1 rounded-md bg-blue-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 border border-gray-100">
            <div className="flex justify-between items-center mb-[16px]">
              <span className="text-[48px] font-bold">{celsius}</span>

              <div className="flex flex-col justify-center items-center text-[14px] font-semibold">
                {weatherImage && (
                  <div>
                    <img
                      className="w-[4rem]"
                      src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                      alt=""
                    />

                    <img
                      className="absolute w-[10rem] z-0 left-20 top-1 opacity-10 translate-x-6"
                      src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                      alt=""
                    />
                  </div>
                )}
                {weatherDescData}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                Weather: <span className="text-md font-bold ml-[2px]"> {weatherData}</span>
              </div>
            </div>
            <div>
              Country: <span className="text-md font-bold">{countryName}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
export default App;
