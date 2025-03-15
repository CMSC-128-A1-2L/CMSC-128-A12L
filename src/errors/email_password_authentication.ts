export class WrongLoginCredentialsError extends Error {
    constructor() {
        super("Email/password could not be validated.")
    }
}

export class UserRegistrationError extends Error {
    constructor(reason: string) {
        super(`User could not be registered: ${reason}`)
    }
}

export class MissingEmailError extends UserRegistrationError {
    constructor() {
        super("Email not provided.")
    }
}

export class MissingPasswordError extends UserRegistrationError {
    constructor() {
        super("Password not provided.")
    }
}

export class InvalidEmailFormat extends UserRegistrationError {
    constructor() {
        super("Invalid email format")
    }
}

export class EmailAlreadyInUseError extends UserRegistrationError {
    constructor() {
        super("Email already in use.")
    }
}
