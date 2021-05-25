const calendar = document.getElementById('calendar');
const month = document.getElementById('month');
const year = document.getElementById('year');
const backmonth = document.getElementById('backmonth');
const forwardmonth = document.getElementById('forwardmonth');
const backyear = document.getElementById('backyear');
const forwardyear = document.getElementById('forwardyear');

var monthIn = 5;
var yearIn = 2021;
var dayIn = 25;

const monthNames = {
  1: 'January',
  2: 'Feburuary',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
};

const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

backmonth.innerHTML = '&#10094;';
backyear.innerHTML = '<img src="back.png" alt="back" width="32" height="32"/>';

forwardmonth.innerHTML = '&#10095;';
forwardyear.innerHTML = '<img src="forward.png" alt="forward" width="32" height="32"/>';

// Date MM/DD/YYYY/X:  Bullet name
// X is some random identifier
const testData = {
  id_1: {
    type: 'task', // task, event, note
    title: 'Walk Dog',
    date: '2021-05-07T20:00'
  },
  id_2: {
    type: 'task',
    title: 'Feed Dog',
    date: '2021-05-08T20:00'
  },
  id_3: {
    type: 'event',
    title: 'Test',
    date: '2021-05-10T20:00'
  },
  id_4: {
    type: 'event',
    title: 'Eat',
    date: '2021-05-07T20:00'
  },
  id_5: {
    type: 'note',
    title: 'Hi Edmund',
    date: '2021-05-10T20:00'
  },
  id_6: {
    type: 'note',
    title: 'heuhuehue',
    date: '2021-04-28T20:00'
  },
  id_7: {
    type: 'note',
    title: 'heuhuehue2',
    date: '2021-05-01T20:00'
  },
  id_8: {
    type: 'note',
    title: 'mwahahaaha',
    date: '2021-05-30T20:00'
  },
  id_9: {
    type: 'note',
    title: 'mwahahaaha2',
    date: '2021-06-04T20:00'
  },
  id_10: {
    type: 'event', 
    title: 'Walk',
    date: '2021-05-07T20:00'
  },
  id_11: {
    type: 'event', 
    title: 'Walk2',
    date: '2021-05-07T20:00'
  },
  id_12: {
    type: 'event', 
    title: 'Walk3',
    date: '2021-05-07T20:00'
  },
  id_13: {
    type: 'event',
    title: 'Walk4',
    date: '2021-05-07T20:00'
  },

};

backmonth.addEventListener('click', function() {
  monthIn--;
  if (monthIn < 1) {
    monthIn = 12;
    yearIn--;
  }

  resetCalendar();
  const data = getDataLocal(monthIn, yearIn);
  populateCalendar(monthIn, yearIn, data);
  let hashed = generateHash(false);
  updateURL(hashed);
});

backyear.addEventListener('click', function() {
  yearIn--;
  resetCalendar();
  const data = getDataLocal(monthIn, yearIn);
  populateCalendar(monthIn, yearIn, data);
  let hashed = generateHash(false);
  updateURL(hashed);
});

forwardmonth.addEventListener('click', function() {
  monthIn++;
  if (monthIn > 12) {
    monthIn = 1;
    yearIn++;
  }
  resetCalendar();
  const data = getDataLocal(monthIn, yearIn);
  populateCalendar(monthIn, yearIn, data);
  let hashed = generateHash(false);
  updateURL(hashed);
});

forwardyear.addEventListener('click', function() {
  yearIn++;
  resetCalendar();
  const data = getDataLocal(monthIn, yearIn);
  populateCalendar(monthIn, yearIn, data);
  let hashed = generateHash(false);
  updateURL(hashed);
});

// updates local storage if there is nothing in it
function updateLocalStorage() {
  if (localStorage.getItem('bulletIDs') === null) {
    const array = [];
    for (const [key, value] of Object.entries(testData)) {
      localStorage.setItem(key, JSON.stringify(value));
      array.push(key);
    }
    localStorage.setItem('bulletIDs', array);
  }
}

// gets month + - 1 information
function getDataLocal(month, year) {
  const data = {};
  if (localStorage.getItem('bulletIDs') === null) {
    return data;
  }
  const bulletIds = localStorage.getItem('bulletIDs').split(',');
  for (let i = 0; i < bulletIds.length; i++) {
    const item = JSON.parse(localStorage.getItem(bulletIds[i]));
    if(item==null){
      continue;
    }
    const date = item.date.split('/');
    if (parseInt(date[2]) === year && parseInt(date[0]) === month) {
      data[bulletIds[i]] = item;
    }
  }
  return data;
}

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function startDate(month, year) {
  const day = new Date(year, month - 1, 1); // 0 is sunday, 1 is monday, ..., 6 is saturday
  return day.getDay();
}

// populates calender with all of the days of the associated month and year
// adds click ability to each date
function populateCalendar(month, year, data) {
  let element;
  let i;
  let start = false;
  let counter = 1;
  for (i = 0; i < 42; i++) {
    if (i % 7 === 0) {
      element = document.createElement('tr');
    }
    const day = i % 7;
    if (day === startDate(month, year) && start === false &&
    counter < daysInMonth(month, year) + 1) {
      start = true;
    }
    if (start) {
      const date = document.createElement('td');
      date.setAttribute('id', counter);
      date.innerHTML = counter;
      date.addEventListener('click', function() {
        console.log(date.childNodes[0]);
        hash = '#month=' + monthIn + '?year='+yearIn+'?day='+date.innerHTML;
        var root = document.URL.split("/")[2];
        var path = 'http://' + root + '/source/frontend/app/page-day/day.html';
        var url_ob = new URL(path);
        url_ob.hash = hash;
        console.log(url_ob);
        window.location.href = url_ob.href;
        
      });
      counter++;
      element.appendChild(date);
    } else {
      const date = document.createElement('td');
      element.appendChild(date);
    }
    if (counter === daysInMonth(month, year) + 1) {
      start = false;
    }
    if (i % 7 === 6) {
      calendar.appendChild(element);
      if (counter === daysInMonth(month, year) + 1) {
        break;
      }
    }
  }
  bulletAppend(data);
}

// resets calender and inserts header of days of the week
function resetCalendar() {
  const element = document.createElement('tr');
  while (calendar.firstChild) {
    calendar.removeChild(calendar.firstChild);
  }
  week.forEach(function(e) {
    const date = document.createElement('th');
    date.innerHTML = e;
    element.appendChild(date);
  });
  calendar.append(element);
  year.innerHTML = yearIn;
  month.innerHTML = "<div id='monthTitle'><b>"+monthNames[monthIn]+"</b></div>"+"<div id=yearTitle>" + yearIn+"</div>";
}

// for a specific month only
// TO DO make a filter per month or something
function bulletAppend(bullets) {
  for (const [key, value] of Object.entries(bullets)) {
    const date = value.date.split('/')[1];
    const temp = document.getElementById(parseInt(date));
    const event = document.createElement('li');
    if (temp.childNodes.length === 1) {
      temp.appendChild(document.createElement('ul'));
    }
    event.innerHTML = value.title;
    if(temp.childNodes[1].childNodes.length<5){
      temp.childNodes[1].appendChild(event);
    }
  }
}

function getTasks(bullets){
  var tasks = []
  for (const [key, value] of Object.entries(bullets)) {
    if(value['type']=='task' && value['tag']=='monthly'){
      tasks.push(key);
    }
  }
  return tasks;
}

function getNotes(bullets){
  var notes = []
  for (const [key, value] of Object.entries(bullets)) {
    if(value['type']=='note' && value['tag']=='monthly'){
      notes.push(key);
    }
  }
  return notes;
}

function generateHash(onload=true){
  var curr = document.URL;

  if(onload){
    var month;
    var year;
    var day;
    if(curr.includes('#')){
      curr = document.URL.split('#')[1].split('?');
      month = parseInt(curr[0].split('=')[1]);
      year = parseInt(curr[1].split('=')[1]);
      day = parseInt(curr[2].split('=')[1]);
      
      return '#month=' + month + '?year='+year + '?day='+day;
    }
    else{
      var date = new Date();
      date = date.toISOString().split('T')[0].split('-');
      month = parseInt(date[1]);
      year = parseInt(date[0]);
      day = parseInt(date[2]);
      return '#month=' + month + '?year='+year + '?day='+day;
    }
  }
  else{
    return '#month=' + monthIn + '?year='+ yearIn + '?day='+dayIn;
  }
  
}

function readHash(hash){
  var curr = hash.split('?');

  var month;
  var year;
  var day;

  month = parseInt(curr[0].split('=')[1]);
  year = parseInt(curr[1].split('=')[1]);
  day = parseInt(curr[2].split('=')[1]);

  return [month, year, day];
}

function updateURL(hash){
  var url_ob = new URL(document.URL);
  url_ob.hash = hash;
  document.location.href = url_ob.href;
}

let hashed = generateHash();
[monthIn, yearIn, dayIn] = readHash(hashed);
updateURL(hashed);

updateLocalStorage();
const data = getDataLocal(monthIn, yearIn);
resetCalendar();
populateCalendar(monthIn, yearIn, data);

console.log(getTasks(data));
console.log(getNotes(data));
