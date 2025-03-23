"use strict";

export class Event {

    private _title:string;
    private _start:string;
    private _end:string;
    private _location:string;
    private _description:string;
    private _dataFilter:string;

    constructor(title:string = "", start:string = "", end:string = "", location:string = "",
                description:string = "", dataFilter:string = "") {
        this._title = title;
        this._start = start;
        this._end = end;
        this._location = location;
        this._description = description;
        this._dataFilter = dataFilter;
    }

    get title():string {
        return this._title;
    }

    get start():string {
        return this._start;
    }

    get end():string {
        return this._end;
    }

    get location():string {
        return this._location;
    }

    get description():string {
        return this._description;
    }

    get dataFilter():string {
        return this._dataFilter;
    }

    set title(title:string) {
        this._title = title;
    }

    set start(start:string) {
        this._start = start;
    }

    set end(end:string) {
        this._end = end;
    }

    set location(location:string) {
        this._location = location;
    }

    set description(description:string) {
        this._description = description;
    }

    set dataFilter(dataFilter:string) {
        this._dataFilter = dataFilter;
    }

    toString():string {
        return `Title: ${this._title}, Start: ${this._start},
        End: ${this._end}, Location: ${this._location}, Description: ${this._description}, DataFilter: ${this._dataFilter}`;
    }

    serialize():string|null {
        if (this._title !== "" && this._start !== "" && this._end !== "" && this._location !== ""
            && this._description !== "" && this._dataFilter !== "") {
            return `${this._title}<|>${this._start}<|>${this._end}<|>${this._location}<|>${this._description}<|>${this._dataFilter}`;
        }
        console.error("[ERROR] Serialization failed! One or more user properties are missing!");
        return null;
    }

    deserialize(data:string) {
        let propertyArray:string[] = data.split("<|>");
        if (propertyArray.length <= 5) {
            console.error("Invalid data format for deserialization (event)");
            return;
        }
        this._title = propertyArray[0].trim();
        this._start = propertyArray[1].trim();
        this._end = propertyArray[2].trim();
        this._location = propertyArray[3].trim();
        this._description = propertyArray[4].trim();
        this._dataFilter = propertyArray[5].trim();
    }

    toJSON() {
        return {
            title: this._title,
            start: this._start,
            end: this._end,
            location: this._location,
            description: this._description,
            dataFilter: this._dataFilter,
        }
    }

    fromJSON(data:{title:string,start:string,end:string,location:string,description:string,dataFilter:string}) {
        this._title = data.title;
        this._start = data.start;
        this._end = data.end;
        this._location = data.location;
        this._description = data.description;
        this._dataFilter = data.dataFilter;
    }

}