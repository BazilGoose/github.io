"use strict";

/**
 * Represents a Contact with a name, contact number, and email address
 */
(function (core) {
    class Contact {

        /**
         * Constructs a new Contact instance
         * @param fullName
         * @param contactNumber
         * @param emailAddress
         */
        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this._fullName = fullName;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
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
         * Gets the contactNumber for the Contact
         * @returns {string}
         */
        get contactNumber() {
            return this._contactNumber;
        }

        /**
         * Sets the contact number of the Contact. Validates the input to ensure it matches a 10-digit phone number format
         * @param contactNumber
         */
        set contactNumber(contactNumber) {
            //905-555-5555
            const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
            if (!phoneRegex.test(contactNumber)) {
                throw new Error("Invalid contactNumber: must be a 10 digit number");
            }

            this._contactNumber = contactNumber;
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
            // Email regex gotten from: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
            const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailRegex.test(emailAddress)) {
                throw new Error("Invalid emailAddress: must be in a valid email address format");
            }

            this._emailAddress = emailAddress;
        }

        /**
         * Converts the Contact details into a human-readable string
         * @returns {string}
         */
        toString() {
            return `Full Name: ${this._fullName}\n
                Contact Number: ${this._contactNumber}\n
                Email Address: ${this._emailAddress}`;
        }

        /**
         * Serializes the Contact details into a string format (csv) suitable for storage
         * @returns {string|null}
         */
        serialize() {
            if (!this._fullName || !this._contactNumber || !this._emailAddress) {
                console.error("One or more Contact properties are missing or invalid");
                return null;
            }
            return `${this._fullName}<|>${this._contactNumber}<|>${this._emailAddress}`;
        }

        /**
         * Deserializes a (csv) string of Contact details and updates the Contact properties
         * @param data
         * @returns {null}
         */
        deserialize(data) {
            if (typeof data !== "string" || data.split("<|>").length !== 3) {
                console.error("Invalid data format for deserialization");
                return null;
            }
            const propArray = data.split("<|>");
            this._fullName = propArray[0];
            this._contactNumber = propArray[1];
            this._emailAddress = propArray[2];
        }

    }

    core.Contact = Contact;

})(core || (core = {}));