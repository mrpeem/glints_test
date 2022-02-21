const daysDict = {"Mon": 0, "Tues": 1, "Weds": 2, "Thurs": 3, "Fri": 4, "Sat": 5, "Sun": 6}
/**  
 * @name parseOpeningHours
 * @description Takes opening hour string and parses it into an array. 
 * Time will be string formatted as <day index>;<24-hour time>
 * where <day index> will be integers ranging from 0-6, with each
 * number corresponding to a day. ex. 0 = monday, 1 = tuesday, ... 6 = sunday 
 * However, there's an exception to this; 7 = monday (instead of 0) if the
 * closing hour of Sunday is past midnight and goes over to Monday
 * @param {string} openingHours
 * @return {obect} an array with 6 elements containing opening and closing times
 */
const parseOpeningHours = (openingHours) => {
  const openingHoursArr = [[],[],[],[],[],[],[]]
  
  const split = openingHours.split("/");
  split.forEach(e => {

    timeIndex = e.search(/\d/) // first digit of number; where time begins in the string

    // splits time range string into array; ex from "10 am - 7:45 pm" to ["10 am", "7:45 pm"]
    const time = e.substring(timeIndex, e.length).trim().split(" - ");

    // substring consisting of days
    let days = e.substring(0, timeIndex-1).trim();

    // check if there are instances of dash (-) in string
    // since days can sometimes be formatted as range ex. Sun - Weds 12:45 pm - 2:30 am
    if (days.includes("-")) {
      
      // find the word before the dash
      let from = days.match(/(\w+) -/);

      // match() will return null if days don't have a space between them (ex. Sun-Weds)
      if (from == null) { 
        // modified string to have space between dash and days
        days = days.substring(0, days.indexOf('-')) + " - " + days.substring(days.indexOf('-') + 1, days.length)
        from = days.match(/(\w+) -/)
      }

      // find the word before the dash
      let to   = days.match(/- (\w+)/);

      // inclusively loop through all days indicated in the range
      for (let i = daysDict[from[1]]; i <= daysDict[to[1]]; i++) {
        const open = convertTime(time[0]);
        const close = convertTime(time[1]);

        const openIndex = i;
        const closeIndex = (open > close)? i+1 : i;

        const openStr = openIndex + ";" + open;
        const closeStr = closeIndex + ";" + close;
        openingHoursArr[i] = [openStr, closeStr];
      }
    }

    // the rest of the days that are by themselves
    days.match(/(Mon|Tues|Weds|Thurs|Fri|Sat|Sun)/g).forEach(day => {
      if ( openingHoursArr[ daysDict[day] ].length == 0 ) {
        const open = convertTime(time[0]);
        const close = convertTime(time[1]);

        const dayIndex = daysDict[day];
        const openIndex = dayIndex;
        const closeIndex = (open > close)? dayIndex+1 : dayIndex;

        const openStr = openIndex + ";" + open;
        const closeStr = closeIndex + ";" + close;
        openingHoursArr[ daysDict[day] ] = [openStr, closeStr]; 
        
      }
    })
  })

  return openingHoursArr;
}

/**
 * @name convertTime
 * @description converts time from 12-hour format to 24-hour
 * @param {string} time 
 * @return {string} 24-hour time
 */
const convertTime = (time) => {
  // console.log("time = "+time);
  const designation = time.slice(-2);

  const t = time.slice(0, -3);

  const separator = t.indexOf(':');

  if (separator !== -1) { // has hour/min separator
    
    let hour = t.substring(0, separator);
    const min = t.substring(separator+1, t.length);
    

    const parsedHour = parseInt(hour);
    const parsedMin = parseInt(min);
    if (parsedHour < 1 || parsedHour > 12 || parsedMin < 0 || parsedMin > 59) {
      return "invalid time";
    }

    if (designation == "pm" && hour != "12") {
      hour = parseInt(hour) + 12;
      return hour+":"+min;
    }
    else if (designation == "am" && hour == "12") {
      return "00:"+min;
    }
    const str = (hour+":"+min).trim();
    return (str.length == 5)? str : "0"+str;
  }
  else { // no hour/min separator: time only shown in hours
    let hour = t;
    const min = "00"

    const parsedHour = parseInt(hour);
    if (parsedHour < 1 || parsedHour > 12) {
      return "invalid time";
    }

    if (designation == "pm" && hour != "12") {
      hour = parseInt(hour) + 12;
      return hour+":"+min;
    }
    else if (designation == "am" && hour == "12") {
      return "00:"+min;
    }
    const str = (hour+":"+min).trim();
    return (str.length == 5)? str : "0"+str;
  } 
}

/**
 * @name checkRestaurantOpen
 * @description checks whether the restaurant is open at a given time
 * @param {string} str    string containing opening hours
 * @param {string} input  time to check against
 * @return {boolean} true if restaurant is open, false if not
 */
const checkRestaurantOpen = (str, input) => {
  input = input.trim();
  const match = input.match(/(Mon|Tues|Weds|Thurs|Fri|Sat|Sun)/g);
  if(match) {
    const day = match[0];
    const time = convertTime( input.substring(input.search(/\d/), input.length) );
    const designation = input.trim().slice(-2);
  
    // parse opening hour string into opening hour object array
    let openingHours =  parseOpeningHours(str);
  
    if (time != "invalid time") {
      let str = daysDict[day] + ";" + time;
      
      // boolean showing whether or not the time is within opening hour range
      let open = str >= openingHours[ daysDict[day] ][0] && str <= openingHours[ daysDict[day] ][1];
      if (open) {
        return open;
      }
      else if (designation == "am") { // possibly in the early am, check previous day's hours instead
        let dayIndex;
        if (daysDict[day] == daysDict["Mon"]) { // if monday, loop back to sunday
          dayIndex = daysDict["Sun"];
        }
        else { // for every other day, just go back one day
          dayIndex = daysDict[day] - 1;
        }
  
        check = str >= openingHours[ daysDict[day] ][0] && str <= openingHours[ daysDict[day] ][1];
        
        // if Sunday's hour goes over to Monday, use day index indicator for Monday as 7 instead of 0
        if (!check && dayIndex == 6 && day == "Mon") {
          str = "7" + str.substring(1, str.length);
        }
        return str <= openingHours[ dayIndex ][1];
      }
    }
    return false;
  }
  return false;
  
}

// days array to be used in datetimeCustom and datetimeCurrent
const daysArr = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"]

/**
 * @name datetimcCustom
 * @description parse user inputted date time 
 * @param {string} transactionDate 
 * @return {object} datetime
 */
const datetimeCustom = (transactionDate) => {
  const month = transactionDate.substring(0,2);
  const day = transactionDate.substring(3,5);
  const year = transactionDate.substring(6,11);
  const d = new Date(year, month - 1, day, 1, 1, 1);

  const split = transactionDate.split(" ");
  const time = split[1].includes(":") ? split[1] : split[1] + ":00";

  const datetime = {
    "openingHoursFormat": daysArr[d.getDay()] + " " + split[1] + " " + split[2].toLowerCase(),
    "transactionDate": split[0] + " " + time + " " + split[2].toUpperCase()
  };
  return datetime;
}

/**
 * @name datetimeCurrent
 * @description use and parse user date given by Date object
 * @return {object} datetime
 */
const datetimeCurrent = () => { // use current day given by Date
  const d = new Date();
  const day = daysArr[d.getDay()];

  const month = (d.getMonth()+1).toString().padStart(2, '0');
  const date = d.getDate().toString().padStart(2, '0');
  const year = d.getUTCFullYear();

  let hours = d.getHours();
  let minutes = d.getMinutes();
  let designation = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');

  let str = month + "/" + date + "/" + year + " ";
  str += hours + ":" + minutes + " " + designation.toUpperCase();

  const datetime = {
    "openingHoursFormat": day + ' ' + hours + ':' + minutes + ' ' + designation,
    "transactionDate": str
  }
  return datetime;
}

module.exports = {parseOpeningHours, convertTime, checkRestaurantOpen, datetimeCustom, datetimeCurrent};
