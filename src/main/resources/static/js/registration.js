if(document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", ready);
else
    ready();

function ready() {
    document.getElementById("registrationForm").elements["username"].addEventListener("input", validate);
    document.getElementById("registrationForm").elements["password"].addEventListener("input", validate);
    document.getElementById("registrationForm").elements["repeatPassword"].addEventListener("input", validate);
    document.getElementById("registrationUsernameField").addEventListener("focus", showUsernameRules);
    document.getElementById("registrationUsernameField").addEventListener("blur", hideUsernameRules);
    document.getElementById("registrationPasswordField").addEventListener("focus", showPasswordRules);
    document.getElementById("registrationPasswordField").addEventListener("blur", hidePasswordRules);
}

function validate (event) {
    var button = document.getElementById("registrationSubmitButton");
    if (validateUsername() & validatePassword() & validateRepeatPassword()) {
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }
}

function validateUsername () {
    var field = document.getElementById("registrationForm").elements["username"];
    if (field.value === "") {
        field.style.border = "";
        return false;
    }
    var found = field.value.match(/[^a-zA-Z0-9]+/g);
    if (field.value.length < 5 || found != null) {
        field.style.border = "2px solid red";
        return false;
    }
    else {
        field.style.border = "";
        return true;
    }
}

function validatePassword () {
    var field = document.getElementById("registrationForm").elements["password"];
    var password = field.value;
    if (password === "") {
        field.style.border = "";
        return false;
    }
    //At least one upper case, one lower case, one number
    if (password.length < 8 ||
        password.match(/[a-z]+/g) == null ||
        password.match(/[A-Z]+/g) == null ||
        password.match(/[0-9]+/g) == null)
        {
        field.style.border = "2px solid red";
        return false;
    }
    else {
        field.style.border = "";
        return true;
    }
}

function validateRepeatPassword () {
    var field = document.getElementById("registrationForm").elements["repeatPassword"];
    var password = document.getElementById("registrationForm").elements["password"].value;
    var repeatPassword = field.value;
    if (repeatPassword === "") {
        field.style.border = "";
        return false;
    }
    if (repeatPassword !== password) {
        field.style.border = "2px solid red";
        return false;
    }
    else {
        field.style.border = "";
        return true;
    }
}

function showUsernameRules () {
    var rules = document.getElementById("registrationUsernameRules");
    rules.style.display = "block";
}

function hideUsernameRules () {
    var rules = document.getElementById("registrationUsernameRules");
    rules.style.display = "none";
}

function showPasswordRules () {
    var rules = document.getElementById("registrationPasswordRules");
    rules.style.display = "block";
}

function hidePasswordRules () {
    var rules = document.getElementById("registrationPasswordRules");
    rules.style.display = "none";
}