"use strict";
/**
 * Represents a Contact with a name, contact number, and email address
 */
export class Contact {
    _fullName;
    _emailAddress;
    _messageSubject;
    _message;
    /**
     * Constructs a new Contact instance
     * @param fullName
     * @param messageSubject
     * @param emailAddress
     * @param message
     */
    constructor(fullName = "", emailAddress = "", messageSubject = "", message = "") {
        this._fullName = fullName;
        this._emailAddress = emailAddress;
        this._messageSubject = messageSubject;
        this._message = message;
    }
    /**
     * Get the full name of the contact
     * @returns {string}
     */
    get fullName() {
        return this._fullName;
    }
    /**
     * Sets the full name of the contact. Validates input to ensure it is a non-empty string
     * @param fullName
     */
    set fullName(fullName) {
        if (typeof fullName !== "string" || fullName.trim() === "") {
            throw new Error("Invalid fullName: must be a non-empty string");
        }
        this._fullName = fullName;
    }
    /**
     * Gets the emailAddress of the Contact.
     * @returns {string}
     */
    get emailAddress() {
        return this._emailAddress;
    }
    /**
     * Sets the email address of the Contact. Validates the input to ensure it matches an email address format
     * @param emailAddress
     */
    set emailAddress(emailAddress) {
        const emailRegex = /[^\s@]+@[\s@]+.[^\s@]+$/;
        if (!emailRegex.test(emailAddress)) {
            throw new Error("Invalid emailAddress: must be in a valid email address format");
        }
        this._emailAddress = emailAddress;
    }
    get messageSubject() {
        return this._messageSubject;
    }
    set messageSubject(messageSubject) {
        if (typeof messageSubject !== "string" || messageSubject.trim() === "") {
            throw new Error("Invalid messageSubject: must be a non-empty string");
        }
        this._messageSubject = messageSubject;
    }
    get message() {
        return this._message;
    }
    set message(message) {
        if (typeof message !== "string" || message.trim() === "") {
            throw new Error("Invalid messageSubject: must be a non-empty string");
        }
        this._message = message;
    }
    /**
     * Converts the Contact details into a human-readable string
     * @returns {string}
     */
    toString() {
        return `Full Name: ${this._fullName}\n
                Email Address: ${this._emailAddress}
                Subject: ${this._messageSubject}\n
                Message: ${this._message}\n`;
    }
    /**
     * Serializes the Contact details into a string format suitable for storage
     * @returns {string|null}
     */
    serialize() {
        if (!this._fullName || !this._emailAddress || !this._messageSubject || !this._message) {
            console.error("One or more Contact properties are missing or invalid");
            return null;
        }
        return `${this._fullName}<|>${this._emailAddress}<|>${this._messageSubject}<|>${this._message}`;
    }
    /**
     * Deserializes a string of Contact details and updates the Contact properties
     * @param data
     * @returns {null}
     */
    deserialize(data) {
        if (data.split("<|>").length !== 4) {
            console.error("Invalid data format for deserialization (contact)");
            return;
        }
        const propArray = data.split("<|>");
        this._fullName = propArray[0];
        this._emailAddress = propArray[1];
        this._messageSubject = propArray[2];
        this._message = propArray[3];
    }
}
//# sourceMappingURL=contact.js.map