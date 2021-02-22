const isEmpty = require('is-empty')
const validator = require('validator')

module.exports = function validateRegisterInput(data) {
    let errors = {}

    data.name = !isEmpty(data.name) ? data.name : ''
    data.username = !isEmpty(data.username) ? data.username : ''
    data.password = !isEmpty(data.password) ? data.password : ''
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : ''

    if (validator.isEmpty(data.name)) {
        errors.name = 'Name field is required'
    }

    if (validator.isEmpty(data.username)) {
        errors.username = 'Username field is required'
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required'
    }
    if (validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Confirm password field is required'
    }
    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be at least 6 characters'
    }
    if (!validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = 'Passwords must match'
    }

    return {
        errors,
        isValid: isEmpty(errors),
    }
}
