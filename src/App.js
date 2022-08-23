// Used for main class
import React from 'react';

// Used for fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudSun, faCloudRain } from "@fortawesome/free-solid-svg-icons";
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
    this.returnTime = this.returnTime.bind(this);
    this.returnFormattedDate = this.returnFormattedDate.bind(this);
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

  returnTime(dateObj) {


    let newDate = new Date(dateObj);

    let outputString = "";
    if (newDate.getHours() < 10) {
      outputString = "0" + newDate.getHours();
    } else {
      outputString = newDate.getHours();
    }

    outputString += ":";

    if (newDate.getMinutes() < 10) {
      outputString += "0" + newDate.getMinutes();
    } else {
      outputString += newDate.getMinutes();
    }

    return outputString;
  }

  returnFormattedDate(dateString) {
    
    let tempString = "x";

    let newDate = new Date(dateString);

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    tempString = weekday[newDate.getDay()];

    return tempString;
  }

  //
  render() {

    const { error, isLoaded, items } = this.state;

    const btn = <button onClick={this.updateCoords}>Print geolocation</button>;

    if (error) {
      return <div key="error">Error: {error.message}</div>;

    } else if (!isLoaded) {
      return <div key="loading">{btn}<br /><br />Loading...</div>;

    } else {

      // let weatherClasses = this.getWeatherIcon(items.current_weather.weathercode);
      // console.log("::" + weatherIcon);

      return (
        <div>

          <div key="output">      
            {btn}<br /><br />
            {items.current_weather.temperature}<br />
            <FontAwesomeIcon icon={this.getWeatherIcon(items.current_weather.weathercode)} /><br />
            {items.current_weather.winddirection}<br />
            {items.current_weather.windspeed}
          </div>

          <table>

            <thead>
              <tr>
                {items.daily.time.map((item, index) => (
                <th key={index}>
                  {this.returnFormattedDate(item)}
                </th>
              ))}
              </tr>
            </thead>

            <tbody>
              <tr>
              {items.daily.weathercode.map((item, index) => (
                <td key={index}>
                  <FontAwesomeIcon icon={this.getWeatherIcon(item)} />
                </td>
              ))}
              </tr>

              <tr>
              {items.daily.temperature_2m_max.map((item, index) => (
                <td key={index}>
                  High: {item}°C
                </td>
              ))}
              </tr>

              <tr>
              {items.daily.temperature_2m_min.map((item, index) => (
                <td key={index}>
                  Low: {item}°C
                </td>
              ))}
              </tr>

              <tr>
              {items.daily.precipitation_sum.map((item, index) => (
                <td key={index}>
                  Total rain: {item}mm
                </td>
              ))}
              </tr>

              <tr>
              {items.daily.sunrise.map((item, index) => (
                <td key={index}>
                  Sunrise: {this.returnTime(item)}
                </td>
              ))}
              </tr>

              <tr>
              {items.daily.sunset.map((item, index) => (
                <td key={index}>
                  Sunset: {this.returnTime(item)}
                </td>
              ))}
              </tr>
            </tbody>

          </table>

        </div>
      );
    }
  }

}

export default App;
