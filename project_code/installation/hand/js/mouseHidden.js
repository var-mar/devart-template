/*
Hide mouse if is not move after 5 seconds
*/
var timeoutMouse;
var isHidden = false;

document.addEventListener("mousemove", magicMouse);

function magicMouse() {
    if (timeoutMouse) {
        clearTimeout(timeoutMouse );
    }
    timeoutMouse = setTimeout(function() {
        if (!isHidden) {
            document.querySelector("body").style.cursor = "none";
            
            isHidden = true;
        }
    }, 5000);
    if (isHidden) {
        document.querySelector("body").style.cursor = "auto";
        isHidden = false;
    }
};