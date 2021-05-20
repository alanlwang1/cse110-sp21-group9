const calendar = document.getElementById("weeklycalendar");
const month = document.getElementById("month");
const week = document.getElementById("week");
const backmonth = document.getElementById("backmonth");
const forwardmonth = document.getElementById("forwardmonth");
const backweek = document.getElementById("backweek");
const forwardweek = document.getElementById("forwardweek");

var yearIn = 2021;
var monthIn = 5;
var dayIn = 1; 

const monthNames = {1:"January",2:"Feburuary",3:"March",4:"April",5:"May",6:"June",7:"July",
    8:"August",9:"September",10: "October",11: "November",12:"December"};
const weekList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

backmonth.innerHTML = "<img src='icons/back.png' alt='back' width='32' height='32'/>";
backweek.innerHTML = "<img src='icons/back.png' alt='back' width='32' height='32'/>";

forwardmonth.innerHTML = "<img src='icons/forward.png' alt='forward' width='32' height='32'/>";
forwardweek.innerHTML = "<img src='icons/forward.png' alt='forward' width='32' height='32'/>";

backmonth.addEventListener("click", function(){
    monthIn--;
    if(monthIn<1){
        monthIn=12;
        yearIn--;

    }
    resetCalendar(monthIn,yearIn,dayIn);
    populateWeek(monthIn,yearIn,dayIn, testData);
});

backweek.addEventListener("click", function(){
    if(dayIn-7<1){
        dayIn = dayIn-7+daysInMonth(yearIn,monthIn);
        monthIn--;
        if(monthIn<1){
            monthIn=12;
            yearIn--;

        }
    }
    else{
        dayIn = dayIn-7;
    }
    resetCalendar(monthIn,yearIn,dayIn);
    populateWeek(monthIn,yearIn,dayIn, testData);
    
});

forwardmonth.addEventListener("click", function(){
    monthIn++;
    if(monthIn>12){
        monthIn=1;
        yearIn++;
    }
    resetCalendar(monthIn,yearIn,dayIn);
    populateWeek(monthIn,yearIn,dayIn, testData);
});

forwardweek.addEventListener("click", function(){
    if(dayIn+7>daysInMonth(yearIn,monthIn)){
        dayIn = dayIn+7-daysInMonth(yearIn,monthIn);
        monthIn++;
        if(monthIn>12){
            monthIn=1;
            yearIn++;
        }
    }
    else{
        dayIn = dayIn+7;
    }
    resetCalendar(monthIn,yearIn,dayIn);
    populateWeek(monthIn,yearIn,dayIn, testData);

});

var testData = {
    'id_1':{
        'type': 'task', // task, event, note
        'title': 'Walk Dog',
        'date': '05/07/2021',
    },
    'id_2':{
        'type': 'task', 
        'title': 'Feed Dog',
        'date': '05/08/2021',
    },
    'id_3':{
        'type': 'event', 
        'title': 'Test',
        'date': '05/10/2021',
    },
    'id_4':{
        'type': 'event', 
        'title': 'Eat',
        'date': '05/07/2021',
    },
    'id_5':{
        'type': 'note', 
        'title': 'Hi Edmund',
        'date': '05/10/2021',
    },
    'id_6':{
        'type': 'note', 
        'title': 'heuhuehue',
        'date': '04/28/2021',
    },
    'id_7':{
        'type': 'note', 
        'title': 'heuhuehue2',
        'date': '05/01/2021',
    },
    'id_8':{
        'type': 'note', 
        'title': 'mwahahaaha',
        'date': '05/30/2021',
    },
    'id_9':{
        'type': 'note', 
        'title': 'mwahahaaha2',
        'date': '06/04/2021',
    },
};
    
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
 
// return date of starting and ending for week
function startEndWeek(month, year, day) {
    var temp = 0;
    var dayWeek = new Date(year, month-1, day); // 0 is sunday, 1 is monday, ..., 6 is saturday
    dayWeek = dayWeek.getDay();
    if(day-dayWeek<0){ // start from prev month
        temp = daysInMonth(month-1,year);

        return [temp + day-dayWeek, month-1, 6-dayWeek+day, month];
    }
    else if (day-dayWeek+6> daysInMonth(month,year)){ // end in next month
        temp = daysInMonth(month,year);
        return [day-dayWeek, month, 6-(temp-(day-dayWeek)), month+1]

    }
    else{ // in month
        return [day-dayWeek, month, day-dayWeek+6, month];
    }
    
}

// limits is 4 tuple of start of week to end of week
function weekEvents(limits, bullets){
    var list = [];
    for (const [key, value] of Object.entries(bullets)) {
        var currDay = value['date'].split('/');
        if(limits[1]==limits[3] && currDay[0]==limits[1]){ // in month
            if(currDay[1]>=limits[0] && currDay[1]<=limits[2]){
                list.push(key);
            }
        }
        else if((currDay[0]==limits[1] && currDay[1]>=limits[0]) || (currDay[0]==limits[3] && currDay[1]<=limits[2])){ // start from prev month
            list.push(key);
        }
        else if((currDay[0]==limits[1] && currDay[1]>=limits[0]) || (currDay[0]==limits[3] && currDay[1]<=limits[2])){ // end in next month
            list.push(key);
        }
    }
    return list;
}

function resetCalendar(m, y, d){
    var element = document.createElement("tr");
    element.setAttribute("id", "weekdaysrow");
    while(calendar.firstChild){
        calendar.removeChild(calendar.firstChild);
    }
   
    var bounds = startEndWeek(m,y,d);
    var i;
    if(bounds[0]==bounds[2]){
        for (i = 0; i < weekList.length; i++) {
             const number = bounds[1]+'/'+ (bounds[0]+i); 
             var date = document.createElement("td");
             date.setAttribute("id", number);
             date.innerHTML = number;   
             element.appendChild(date);
        }
    }
    else{
        for (i = 0; i < weekList.length; i++) {
            var temp = bounds[0]+i;
            if(temp>daysInMonth(bounds[1],y)){
                
                const number = bounds[3]+'/'+ (bounds[2] -6+i);
                var date = document.createElement("td");
                date.setAttribute("id", number);
                date.innerHTML = number;   
                element.appendChild(date);
            }
            else{
                const number = bounds[1]+'/'+temp;
                var date = document.createElement("td");
                date.setAttribute("id", number);
                date.innerHTML = number;   
                element.appendChild(date);
            }

        }
    
    }  

    calendar.append(element);
    
    week.innerHTML = "Week of " + monthNames[m] + " " + d + ", " + y;
    month.innerHTML = monthNames[m];
    
}

function populateWeek(month, year, day, bullets){
    var bounds = startEndWeek(month,year,day);  

    var events = weekEvents(bounds, bullets);

    events.forEach(function(e){
        var details = bullets[e];
        var currDay = details['date'].split('/');
        var dayofWeek = parseInt(currDay[0]) + "/" + parseInt(currDay[1]);
        var temp = document.getElementById(dayofWeek);
        var event = document.createElement("li");
        if(temp.childNodes.length==1){

            temp.appendChild(document.createElement("ul"));
        }
        event.innerHTML = details['title'];
        temp.childNodes[1].appendChild(event);

    });
}

var temp = startEndWeek(5,2021,31);
yearIn = 2021;
monthIn = 5;
dayIn = 10; 

console.log(temp);
console.log(weekEvents(temp,testData));

resetCalendar(monthIn,yearIn,dayIn);
populateWeek(monthIn,yearIn,dayIn,testData);