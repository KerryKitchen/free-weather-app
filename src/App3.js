// imports
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudSun, faCloudRain } from "@fortawesome/free-solid-svg-icons";
import { faSmog, faCloudShowersHeavy, faCloudBolt, faMeteor } from "@fortawesome/free-solid-svg-icons";

// Main App
class App extends React.Component {

  // State constructor + function binds
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: null
    };
    this.invokeNavigator = this.invokeNavigator.bind(this);
    this.invokeAPI = this.invokeAPI.bind(this);
    this.navigatorError = this.navigatorError.bind(this);
    this.getWeatherIcon = this.getWeatherIcon.bind(this);
    this.getWeatherDescription = this.getWeatherDescription.bind(this);
    this.getFormattedDate = this.getFormattedDate.bind(this);
  }


  // Calls the extenarl API using the built-in browser navigator
  invokeNavigator() {

    // If the navigator is enabled
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(this.invokeAPI, this.navigatorError);
    } else {
      console.log('this browser does not support navigator.geolocation');
    }
     
  }


  // Used to specify the type of error if there is a navigator error
  navigatorError(error) {

    let message = "";

    switch(error.code) {
      case error.PERMISSION_DENIED:
      message = "User denied the request for Geolocation."
      break;
      case error.POSITION_UNAVAILABLE:
      message = "Location information is unavailable."
      break;
      case error.TIMEOUT:
      message = "The request to get user location timed out."
      break;
      case error.UNKNOWN_ERROR:
      message = "An unknown error occurred."
      break;
      default:
      message = "Error: default"
    }

    this.setState({
      error: message
    });

    console.log(message);
  }


  // Uses a fetch function to get data from an external API
  invokeAPI(position) {

    // The constructed URL
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude +
    "&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto";

    // Go fetch!
    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: result
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: error
        });
      }
      )
  }


  // Returns an icon dependant on the code input
  getWeatherIcon(code) {

    let weatherIcon;

    switch(code) {
      case 0:
      case 1:
      weatherIcon = faSun;
      break;
      case 2:
      weatherIcon = faCloudSun;
      break;
      case 3:
      weatherIcon = faCloud;
      break;
      case 45:
      weatherIcon = faSmog;
      break;
      case 51:
      case 53:
      case 55:
      case 61:
      case 63:
      case 80:
      case 81:
      weatherIcon = faCloudRain;
      break;
      case 65:
      case 82:
      weatherIcon = faCloudShowersHeavy;
      break;
      case 95:
      case 96:
      case 99:
      weatherIcon = faCloudBolt;
      break;
      default:
      weatherIcon = faMeteor;
    }

    return weatherIcon;
  }


  // Returns a weather description dependant on the code input
  getWeatherDescription(code) {

    let weatherDesc;

    switch(code) {
      case 0:
      case 1:
      weatherDesc = "Clear";
      break;
      case 2:
      weatherDesc = "Partly cloudy";
      break;
      case 3:
      weatherDesc = "Cloudy";
      break;
      case 45:
      weatherDesc = "Fog";
      break;
      case 51:
      case 53:
      case 55:
      case 61:
      case 63:
      case 80:
      case 81:
      weatherDesc = "Rain";
      break;
      case 65:
      case 82:
      weatherDesc = "Heavy rain";
      break;
      case 95:
      case 96:
      case 99:
      weatherDesc = "Thunderstorm";
      break;
      default:
      weatherDesc = "Vacuum of space";
    }

    return weatherDesc;
  }


  // Returns the day of the week for a given date-parsable sting
  getFormattedDate(dateString) {

    // Weekdays in an array
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // Get the corresponding weekday using the day as the index
    const newDate = new Date(dateString);
    const today = new Date();
    let output = "";

    // Concatenate the output string
    if (newDate.getDay() === today.getDay()) {
      output += "Today";     
    } else {
      output += weekday[newDate.getDay()];
    }
    output += " " + String(newDate.getDate());
    output += " " + months[newDate.getMonth()];

    // return the output string
    return output;
  }


  // Used to render the output of this App
  render() {

    // Easier to access state variables further down
    const { error, isLoaded, items } = this.state;

    return (
      <div className="wrapper lg:flex w-4/5 mx-auto my-8">

        {/* The blurb section */}
        <div className="blurb block-style w-full h-max mb-4 lg:w-80 lg:mr-8">

          <h1 className="font-semibold text-center">Weather Application</h1>

          <p>Click the button below to get your current weather and forecast for the next week.</p>
          <p>The web application uses your browser's geolocation function to find your current longitude and latitude. It sends these coordinates via an API call to <a href="https://open-meteo.com/" title="Visit the Open-Meteo website" target="_blank" rel="noreferrer">Open-Meteo weather API</a> to get the weather for your location.</p>

          <div className="flex justify-center">
            <button className="cta" onClick={this.invokeNavigator}>Get your weather</button>
          </div>

        </div>

        {/* The data output section */}
        <div className="data lg:flex-1">

          {/* Used to determine the output */}
          {error ? error : !isLoaded ? <div className="block-style flex flex-col items-center"><div className="text-gray-400">Nothing to see here, yet...</div></div> :

          <div>

            <div className="weather-output block-style mb-4">

              {/* Current weather section */}      
              <h2 className="font-semibold mb-4 text-center lg:text-left">7-day weather forecast</h2>
              <div className="current flex flex-col items-center lg:w-80 mx-auto">
                <h2 className="mb-2 text-center">Current weather for your location</h2>
                <div className="flex items-center gap-4 mb-4">
                  <FontAwesomeIcon className="current-icon" icon={this.getWeatherIcon(items.current_weather.weathercode)} />
                  <div className="">
                    <p>{items.current_weather.temperature}°C</p>
                    <p>{this.getWeatherDescription(items.current_weather.weathercode)}</p>
                  </div>
                </div>
                <h2 className="font-semibold mb-2">{this.getFormattedDate(items.current_weather.time)}</h2>
                <div className="flex gap-3">
                  <div className="flex gap-2">
                    <p className="font-semibold temp-high">High</p>
                    <p>{items.daily.temperature_2m_max[0]}°C</p>
                  </div>
                  <div className="flex gap-2">
                    <p className="font-semibold temp-low">Low</p>
                    <p>{items.daily.temperature_2m_min[0]}°C</p>
                  </div>
                </div>
              </div>

              {/* Forecast weather section */}
              <div className="forecast lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Using map to get day headers, utilising index to get other data */}
                {items.daily.time.slice(1).map((item, index) => (
                  <div key={item} className="weather-card flex flex-col items-center p-2 gap-1">
                    <p className="font-semibold">{this.getFormattedDate(item)}</p>
                    <div className="flex gap-2">
                      <FontAwesomeIcon className="forecast-icon" icon={this.getWeatherIcon(items.daily.weathercode[index])} />
                      <p>{this.getWeatherDescription(items.daily.weathercode[index])}</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex gap-2">
                        <p className="font-semibold temp-high">High</p>
                        <p>{items.daily.temperature_2m_max[index]}°C</p>
                      </div>
                      <div className="flex gap-2">
                        <p className="font-semibold temp-low">Low</p>
                        <p>{items.daily.temperature_2m_min[index]}°C</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Under the hood section */}
            <div className="under-da-hood block-style">

              <h2 className="font-semibold">Under the hood</h2>

              <p>The front-end output is composed mainly of HTML5 and CSS3. The application also employs <a href="https://tailwindcss.com/" title="Visit the Tailwind website" target="_blank" rel="noreferrer">Tailwind</a>, a modern and responsive CSS Framework and a sprinkling of some <a href="https://fontawesome.com/" title="Visit the Font Awesome website" target="_blank" rel="noreferrer">Font Awesome</a> icons.</p>

              <p>The functional development utilises several JavaScript frameworks, such as <a href="https://nodejs.dev/" title="Visit the Node.js website" target="_blank" rel="noreferrer">Node.js</a> and <a href="https://www.npmjs.com/" title="Visit the npm website" target="_blank" rel="noreferrer">npm</a>, the most notable being <a href="https://reactjs.org/" title="Visit the React website" target="_blank" rel="noreferrer">React</a>. The React framework has many helpful uses, like the create-react-app function, which quickly creates projects and allows for rapid development and prototyping.</p>

              <p>As you've likely guessed by the URL, this web application hosting is on <a href="https://pages.github.com/" title="Visit the GitHub Pages website" target="_blank" rel="noreferrer">GitHub Pages</a>, and the source code is version controlled on <a href="https://github.com/" title="Visit the GitHub website" target="_blank" rel="noreferrer">GitHub</a>.</p>
            </div>

          </div>
          }
        </div>
      </div>
    );
  }
}

export default App;