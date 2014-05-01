

function counterTimeSinceStartWindow(){
    this.id_html_element = "timeSinceStarted";
    var self = this;

    this.display = function (){
        // later record end time
        var endTime = new Date();

        // time difference in ms
        var timeDiff = endTime - self.startTime;

        // strip the miliseconds
        timeDiff /= 1000;

        // get seconds
        var seconds = Math.round(timeDiff % 60);

        // remove seconds from the date
        timeDiff = Math.floor(timeDiff / 60);

        // get minutes
        var minutes = Math.round(timeDiff % 60);

        // remove minutes from the date
        timeDiff = Math.floor(timeDiff / 60);

        // get hours
        var hours = Math.round(timeDiff % 24);

        // remove hours from the date
        timeDiff = Math.floor(timeDiff / 24);

        // the rest of timeDiff is number of days
        var days = timeDiff;

        $("#"+self.id_html_element).text("Time since window started: "+days + " days, " + hours + ":" + minutes + ":" + seconds);
        setTimeout(self.display, 1000);
    }
    
    this.hide = function (){
        $("#"+self.id_html_element).hide();
    }

    this.show = function (){
        $("#"+self.id_html_element).show();
    }

    this.start = function () {
        self.startTime = new Date();
        setTimeout(this.display, 1000);
        $("body").append('<div id="'+self.id_html_element+'"></div>');
    }
    this.start();
}


