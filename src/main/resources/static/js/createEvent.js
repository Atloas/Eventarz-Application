if(document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", ready);
else
    ready();

function ready() {
    document.getElementById("createEventForm").elements["name"].addEventListener("input", validate);
    document.getElementById("createEventForm").elements["description"].addEventListener("input", validate);
    document.getElementById("createEventForm").elements["maxParticipants"].addEventListener("input", validate);
    document.getElementById("createEventForm").elements["eventDate"].addEventListener("input", validate);
    document.getElementById("createEventForm").elements["name"].addEventListener("focus", showNameRules);
    document.getElementById("createEventForm").elements["name"].addEventListener("blur", hideNameRules);
    document.getElementById("createEventForm").elements["description"].addEventListener("focus", showDescriptionRules);
    document.getElementById("createEventForm").elements["description"].addEventListener("blur", hideDescriptionRules);
}

function validate (event) {
    var button = document.getElementById("createEventSubmitButton");
    if (validateName() & validateDescription() & validateMaxParticipants() & validateEventDate()) {
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }
}

function validateName () {
    var field = document.getElementById("createEventForm").elements["name"];
    var name = field.value;
    if (name === "") {
        field.style.border = "";
        return false;
    }
    var found = name.match(/[^a-zA-Z0-9\s\-\:\(\)ąĄćĆęĘłŁńŃóÓśŚżŻźŹ.,!?$]+/g);
    if (name.length < 5 || found != null) {
        field.style.border = "2px solid red";
        return false;
    }
    else {
        field.style.border = "";
        return true;
    }
}

function validateDescription () {
    var field = document.getElementById("createEventForm").elements["description"];
    var found = field.value.match(/[^a-zA-Z0-9\s\-\:\(\)ąĄćĆęĘłŁńŃóÓśŚżŻźŹ.,!?$]+/g);
    if (found != null) {
        field.style.border = "2px solid red";
        return false;
    }
    else {
        field.style.border = "";
        return true;
    }
}

function validateMaxParticipants () {
    //Not much validating here.
    var field = document.getElementById("createEventForm").elements["maxParticipants"];
    if (field.value < 1) {
        field.style.border = "2px solid red";
        return false;
    }
    else {
        field.style.border = "";
        return true;
    }
}

function validateEventDate() {
    var field = document.getElementById("createEventForm").elements["eventDate"];
    var eventDateString = field.value;
    if (eventDateString == "") {
        field.style.border = "";
        return false;
    }
    var eventDate = new Date(eventDateString);
    var currentDate = new Date();
    if (currentDate > eventDate) {
        field.style.border = "2px solid red";
        return false;
    }
    else {
        field.style.border = "";
        return true;
    }
}


function showNameRules () {
    var rules = document.getElementById("eventCreateNameRules");
    rules.style.display = "block";
}

function hideNameRules () {
    var rules = document.getElementById("eventCreateNameRules");
    rules.style.display = "none";
}

function showDescriptionRules () {
    var rules = document.getElementById("eventCreateDescriptionRules");
    rules.style.display = "block";
}

function hideDescriptionRules () {
    var rules = document.getElementById("eventCreateDescriptionRules");
    rules.style.display = "none";
}