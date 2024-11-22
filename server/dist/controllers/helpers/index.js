export function getErrorMessage(error) {
    let errorMessage;
    if (error.code === 11000) {
        errorMessage = 'A user with that email address already exists';
    }
    else {
        let errors = [];
        for (const prop in error.errors) {
            errors.push(error.errors[prop].message);
        }
        errorMessage = errors[0];
    }
    return errorMessage;
}
