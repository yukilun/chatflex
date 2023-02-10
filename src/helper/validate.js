import { toast } from "react-toastify";

export function registrationValidate(values) {
    const error = nameValidate({}, values);
    emailValidate(error, values);
    passwordValidate(error, values);
    return error;
}

export function loginValidate(values) {
    const error = emailValidate({}, values);
    passwordValidate(error, values);
    return error;
}

function nameValidate(error, values) {
    const usernameFormat = /^([A-Za-z0-9]|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])([A-Za-z0-9 ]|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]){1,18}([A-Za-z0-9]|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])$/;
    if(!values.name) {
        error.name = toast.error("Name Required!");
    }
    else if(!usernameFormat.test(values.name)) {
        error.name = toast.error("Name must consist of 3-20 letters, digits or emoji.");
    }
    return error;
}

function emailValidate(error, values) {
    const emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if(!values.email) {
        error.email = toast.error("Email Address Required!");
    }
    else if(!emailFormat.test(values.email)) {
        error.email = toast.error("Invalid Email Address!");
    }
    return error;
}

function passwordValidate(error={}, values) {
    if(!values.password) {
        error.password = toast.error("Password Required!");
    }
    else if(values.password.includes(" ")) {
        error.password = toast.error("Password cannot include any space!");
    }
    else if(values.password.length < 6) {
        error.password = toast.error("Password must have at least 6 characters!");
    }
    return error;
}