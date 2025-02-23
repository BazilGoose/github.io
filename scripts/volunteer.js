"use strict";

class Volunteer {

    /**
     * Constructs a new Volunteer instance
     * @param opportunityId
     * @param fullName
     * @param emailAddress
     * @param preferredRole
     */
    constructor(opportunityId = 0, fullName = "", emailAddress = "", preferredRole = "") {
        this._opportunityId = opportunityId;
        this._fullName = fullName;
        this._emailAddress = emailAddress;
        this._preferredRole = preferredRole;
    }

    /**
     * Gets the opportunityId attribute
     * @returns {number}
     */
    get opportunityId() {
        return this._opportunityId;
    }

    /**
     * Gets the fullName attribute
     * @returns {string}
     */
    get fullName() {
        return this._fullName;
    }

    /**
     * Gets the emailAddress attribute
     * @returns {string}
     */
    get emailAddress() {
        return this._emailAddress;
    }

    /**
     * Gets the preferredRole attribute
     * @returns {string}
     */
    get preferredRole() {
        return this._preferredRole;
    }

    /**
     * Sets the opportunityId attribute
     * @param opportunityId
     */
    set opportunityId(opportunityId) {
        this._opportunityId = opportunityId;
    }

    /**
     * Sets the fullName attribute
     * @param fullName
     */
    set fullName(fullName) {
        this._fullName = fullName;
    }

    /**
     * Sets the emailAddress attribute
     * @param emailAddress
     */
    set emailAddress(emailAddress) {
        this._emailAddress = emailAddress;
    }

    /**
     * Sets the preferred role attribute
     * @param preferredRole
     */
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