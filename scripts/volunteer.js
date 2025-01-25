"use strict";

class Volunteer {

    constructor(opportunityId = 0, fullName = "", emailAddress = "", preferredRole = "") {
        this._opportunityId = opportunityId;
        this._fullName = fullName;
        this._emailAddress = emailAddress;
        this._preferredRole = preferredRole;
    }

    get opportunityId() {
        return this._opportunityId;
    }

    get fullName() {
        return this._fullName;
    }

    get emailAddress() {
        return this._emailAddress;
    }

    get preferredRole() {
        return this._preferredRole;
    }

    set opportunityId(opportunityId) {
        this._opportunityId = opportunityId;
    }

    set fullName(fullName) {
        this._fullName = fullName;
    }

    set emailAddress(emailAddress) {
        this._emailAddress = emailAddress;
    }

    set preferredRole(preferredRole) {
        this._preferredRole = preferredRole;
    }

    toString() {
        return `Opportunity ID: ${this._opportunityId}\n
                Full Name: ${this._fullName}\n
                Email: ${this._emailAddress}\n
                Role: ${this._preferredRole}`;
    }

    /**
     * Serializes the Opportunity details into a string format separated by '<|>'
     * (as commas are too common in descriptions) so that it is suitable for storage
     * @returns {string|null}
     */
    serialize() {
        if (!this._opportunityId || !this._fullName || !this._emailAddress || !this._preferredRole) {
            console.error("One or more Volunteer properties missing or invalid");
            return null;
        }
        return `${this._opportunityId}<|>${this._fullName}<|>${this._emailAddress}<|>${this.preferredRole}`;
    }

    /**
     * Deserializes a string of Opportunity details and updates the Opportunity properties
     * @param data
     * @returns {null}
     */
    deserialize(data) {
        if (typeof data !== "string" || data.split("<|>").length !== 4) {
            console.error("Invalid data format for deserialization");
            return null;
        }
        const propArray = data.split("<|>");
        this._opportunityId = number(propArray[0]);
        this._fullName = propArray[1];
        this._emailAddress = propArray[2];
        this._preferredRole = propArray[3];
    }

}