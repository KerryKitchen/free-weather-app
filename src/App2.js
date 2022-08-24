// Used for main class
import React from 'react';

// Used for fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudSun, faCloudRain, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faSmog, faCloudShowersHeavy, faCloudBolt, faMeteor } from "@fortawesome/free-solid-svg-icons";

// 
class App extends React.Component {

  //
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: null
    };
    this.updateCoords = this.updateCoords.bind(this);
    this.callAPI = this.callAPI.bind(this);
    this.errorWithAPI = this.errorWithAPI.bind(this);
    this.getWeatherIcon = this.getWeatherIcon.bind(this);
    this.getWeatherDescription = this.getWeatherDescription.bind(this);
    this.getWindDirection = this.getWindDirection.bind(this);
    this.getTime = this.getTime.bind(this);
    this.getFormattedDate = this.getFormattedDate.bind(this); 
  }

  //
  updateCoords() {

    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(this.callAPI, this.errorWithAPI);
    } else {
      console.log('this browser does not support navigator.geolocation');
    }
    
  }

  //
  errorWithAPI(error) {

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

    console.log(message);
  }

  //
  callAPI(position) {

    //
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = "https://api.open-meteo.com/v1/forecast?"+
    "latitude="+lat+
    "&longitude="+lon+
    "&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&current_weather=true&timezone=auto";

    //
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

  getWindDirection(dir) {

    if (dir >= 337.5 || dir < 22.5) {
      return "N";
    } else if (dir >= 22.5 && dir < 67.5) {
      return "NE";
    } else if (dir >= 67.5 && dir < 112.5) {
      return "E";
    } else if (dir >= 112.5 && dir < 157.5) {
      return "SE";
    } else if (dir >= 157.5 && dir < 202.5) {
      return "S";
    } else if (dir >= 202.5 && dir < 247.5) {
      return "SW";
    } else if (dir >= 247.5 && dir < 292.5) {
      return "W";
    } else if (dir >= 292.5 && dir < 337.5) {
      return "NW";
    }
  }

  getTime(dateObj) {


    let newDate = new Date(dateObj);

    let outputString = "";
    if (newDate.getHours() < 10) {
      outputString = newDate.getHours();
    } else if (newDate.getHours() >=13) {
      outputString = newDate.getHours() - 12;
    }

    outputString += ":";

    if (newDate.getMinutes() < 10) {
      outputString += "0" + newDate.getMinutes();
    } else {
      outputString += newDate.getMinutes();
    }

    return outputString;
  }

  getFormattedDate(dateString) {

    let newDate = new Date(dateString);

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    let tempString = weekday[newDate.getDay()];

    return tempString;
  }

  //
  render() {

    const { error, isLoaded, items } = this.state;

    const btn = <button onClick={this.updateCoords}>Load weather</button>;

    if (error) {
      return <div>Error: {error.message}</div>;

    } else if (!isLoaded) {
      return <div>{btn}<br /><br />Loading...</div>;

    } else {

      return (
        <div>

          {btn}<br /><br />

          <div>   
            <p>Current temperature: {items.current_weather.temperature}°C<br />
            <FontAwesomeIcon icon={this.getWeatherIcon(items.current_weather.weathercode)} />
            <span> {this.getWeatherDescription(items.current_weather.weathercode)}</span><br />
            <span>Wind direction: <FontAwesomeIcon icon={faArrowUp} transform={{ rotate: items.current_weather.winddirection }}/> </span>
            {this.getWindDirection(items.current_weather.winddirection)}<br />
            Wind speed: {items.current_weather.windspeed} km/h</p>
          </div>

          <br />

          <div className="flex flex-col md:flex-row gap-1">

            {/* Using map to get day headers, utilising index to get other data */}
            {items.daily.time.map((item, index) => (
              <div key={index} className="weather-card">
                
                {/* Day and weather icon */}
                <div className="day card-data">
                  <span className="card-header">{this.getFormattedDate(item)}</span>
                  <FontAwesomeIcon icon={this.getWeatherIcon(items.daily.weathercode[index])} />
                </div>

                {/* Temperature */}
                <div className="temp card-data">
                  <span className="card-sub-header">Temp</span>
                  <span>{items.daily.temperature_2m_max[index]}°C / {items.daily.temperature_2m_min[index]}°C</span>
                </div>

                {/* Description */}
                <div className="desc card-data">
                  <span className="card-sub-header">Desc</span>
                  <span>{this.getWeatherDescription(items.daily.weathercode[index])}</span>
                </div>

                {/* Rain */}
                <div className="rain card-data">
                  <span className="card-sub-header">Rain</span>
                  <span>{items.daily.precipitation_sum[index]} mm</span>
                </div>

                {/* Sun */}
                <div className="sun card-data">
                  <span className="card-sub-header">Sun</span>
                  <span>{this.getTime(items.daily.sunrise[index])} {this.getTime(items.daily.sunset[index])}</span>
                </div>
                
              </div>
            ))}
          </div>

        </div>
      );
    }
  }
}

export default App;