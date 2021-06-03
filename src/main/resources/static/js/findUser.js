if(document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", ready);
else
    ready();

function ready() {
    document.getElementById("findUserForm").elements["username"].addEventListener("input", validate);
    document.getElementById("findUserForm").elements["username"].addEventListener("focus", showNameRules);
    document.getElementById("findUserForm").elements["username"].addEventListener("blur", hideNameRules);
}

function validate (event) {
    var button = document.getElementById("submitButton");
    if (validateUsername()) {
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }
}

function validateUsername () {
    var field = document.getElementById("findUserForm").elements["username"];
    var username = field.value;
    if (username === "") {
        field.style.border = "";
        return false;
    }
    var found = username.match(/[^a-zA-Z0-9]+/g);
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