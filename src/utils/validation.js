const validator = require('validator')

const validateSignupData = (req) => {
    const {firstName,lastName,emailId,password} = req.body;

    if(!firstName || !lastName)
        throw new Error('Name is not valid');
    else if(!validator.isEmail(emailId))
        throw new Error('Email id is not valid')
}

const validateProfileData = (req) => {
    const allowedFields = ['firstName','lastName','emailId','photoUrl','age','about','skills','gender'];
    const isAllowedEdit = Object.keys(req.body).every(field => allowedFields.includes(field));
    return isAllowedEdit
}

const validatePassword = (req) =>{
    const password = req.body.newPassword;
    if(!password)
        throw new Error('Invalid edit request');
    else if(!password.length>=5 && !password.length < 10)
        throw new Error('Write a strong password')
}
module.exports = {validateSignupData,validateProfileData,validatePassword}