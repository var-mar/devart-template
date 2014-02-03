function getTimestamp(str) {
    var d = str.match(/\d+/g); // extract date parts
    return +new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]); // build Date object
}

function timeStrings(time){
    var currentTimestamp = new Date();
    var secondsSinceCreated = (currentTimestamp-getTimestamp(time))/1000;
    //secondsSinceCreated = secondsSinceCreated-(3600*2);
    var output = "";
    if(secondsSinceCreated<60){
        output = "Seconds ago";
    }else if(secondsSinceCreated>=60 && secondsSinceCreated<3600){
        output = Math.floor(secondsSinceCreated/60)+"m";
    }else if(secondsSinceCreated>=3600 && secondsSinceCreated<86400){
        output = Math.floor(secondsSinceCreated/3600)+"h";
    }else{
        output = time.substring(0,10);
    }
    return output;
}
