if(document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", ready);
else
    ready();

function ready() {
    document.getElementById("createGroupForm").elements["name"].addEventListener("input", validate);
    document.getElementById("createGroupForm").elements["description"].addEventListener("input", validate);
    document.getElementById("createGroupForm").elements["name"].addEventListener("focus", showNameRules);
    document.getElementById("createGroupForm").elements["name"].addEventListener("blur", hideNameRules);
    document.getElementById("createGroupForm").elements["description"].addEventListener("focus", showDescriptionRules);
    document.getElementById("createGroupForm").elements["description"].addEventListener("blur", hideDescriptionRules);
}

function validate (event) {
    var button = document.getElementById("createGroupSubmitButton");
    if (validateName() & validateDescription()) {
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }
}

function validateName () {
    var field = document.getElementById("createGroupForm").elements["name"];
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
    var field = document.getElementById("createGroupForm").elements["description"];
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

function showNameRules () {
    var rules = document.getElementById("groupCreateNameRules");
    rules.style.display = "block";
}

function hideNameRules () {
    var rules = document.getElementById("groupCreateNameRules");
    rules.style.display = "none";
}

function showDescriptionRules () {
    var rules = document.getElementById("groupCreateDescriptionRules");
    rules.style.display = "block";
}

function hideDescriptionRules () {
    var rules = document.getElementById("groupCreateDescriptionRules");
    rules.style.display = "none";
}