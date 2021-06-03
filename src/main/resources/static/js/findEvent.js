if(document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", ready);
else
    ready();

function ready() {
    document.getElementById("findEventForm").elements["name"].addEventListener("input", validate);
    document.getElementById("findEventForm").elements["name"].addEventListener("focus", showNameRules);
    document.getElementById("findEventForm").elements["name"].addEventListener("blur", hideNameRules);
}

function validate (event) {
    var button = document.getElementById("submitButton");
    if (validateName()) {
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }
}

function validateName () {
    var field = document.getElementById("findEventForm").elements["name"];
    var name = field.value;
    if (name === "") {
        field.style.border = "";
        return false;
    }
    var found = name.match(/[^a-zA-Z0-9\s\-\:\(\)ąĄćĆęĘłŁńŃóÓśŚżŻźŹ.,!?$]+/g);
    if (found != null) {
        field.style.border = "2px solid red";
        return false;
    }
    else {
        field.style.border = "";
        return true;
    }
}

function showNameRules () {
    var rules = document.getElementsByClassName("searchNameRules")[0];
    rules.style.display = "block";
}

function hideNameRules () {
    var rules = document.getElementsByClassName("searchNameRules")[0];
    rules.style.display = "none";
}