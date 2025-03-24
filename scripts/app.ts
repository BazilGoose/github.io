"use strict";

// Names: Cole de Ruiter, Noah Barraclough
// Student IDS: 100906323, 100923580
// Date: March 21, 2025

import {Contact} from "./contact.js";
import {LoadHeader} from "./header.js";
import {Router} from "./router.js";
import {LoadFooter} from "./footer.js";
import {AuthGuard} from "./authguard.js";
import {User} from "./user.js";
import {LoadBackToTop} from "./backToTop.js";
import {Gallery} from "./gallery.js";
import {NotificationToast} from "./notification.js";
import * as EventObj from "./event.js";

interface event {
    title: string;
    start: string;
    end: string;
    location: string;
    description: string;
    dataFilter: string;
}

interface eventDataJson {
    events: event[];
}

interface eventType {
    name: string;
    val: string;
}

interface eventTypesJson {
    types: eventType[];
}

const pageTitles:Record<string, string> = {
    "/": "Home",
    "/home": "Home",
    "/about": "About Us",
    "/contact": "Contact",
    "/login": "Login",
    "/register": "Register",
    "/gallery": "Gallery",
    "/event": "Events",
    "/event-plan": "Event Planning",
    "/event-edit" : "Event Edit",
    "/donate": "Donate",
    "/services": "Services",
    "/opportunity": "Opportunity",
    "/privacyPolicy": "Privacy Policy",
    "/serviceTerms": "Terms of Service",
    "/statistic" : "Statistics",
    "/404": "404 | Page Not Found"
};

const routes = {
    "/": "views/pages/home.html",
    "/home": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/contact": "views/pages/contact.html",
    "/login": "views/pages/login.html",
    "/register": "views/pages/register.html",
    "/gallery": "views/pages/gallery.html",
    "/event": "views/pages/event.html",
    "/event-plan": "views/pages/event-plan.html",
    "/event-edit": "views/pages/event-edit.html",
    "/donate": "views/pages/donate.html",
    "/services": "views/pages/services.html",
    "/opportunity": "views/pages/opportunity.html",
    "/privacyPolicy": "views/pages/privacyPolicy.html",
    "/serviceTerms": "views/pages/serviceTerms.html",
    "/statistic" : "views/pages/statistic.html",
    "/404": "views/pages/404.html"
};

const router = new Router(routes);

//IIFE - Immediately Invoke Functional Expression

(function () {

    let GallerySlideIndex = 1;

    /**
     * Called when displaying the homepage
     */
    function DisplayHomePage(){
        console.log("Calling DisplayHomePage...");

        // Get Involved Button Configuration
        let getInvolvedButton = document.getElementById("GetInvolvedBtn");

        if (getInvolvedButton) {
            getInvolvedButton.addEventListener("click", function(){
                location.href = "opportunity.html";
            });
        }
        displayPlaces();
    }

    /**
     * Displays the new foursquare places and attractions in the home page
     */
    async function displayPlaces(): Promise<void> {

        // https://foursquare.com/developers/home
        const apiKey = "fsq3NDg1qRl7Cpike3JK4CbR6BSimnxk0WKduffUuJhEg8g=";
        const resultLimit = 5;

        const apiMessage = document.getElementById("apiMessage") as HTMLElement;

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: apiKey
            }
        };

        try {
            // Gets places from the foursquare api
            const response = await fetch(`https://api.foursquare.com/v3/places/search?ll=43.944325410989336%2C-78.8966073510502&radius=10000&categories=4d4b7104d754a06370d81259&sort=RELEVANCE&limit=${resultLimit}`, options)

            if (!response.ok) {
                throw new Error("Failed to fetch the places data");
            }

            apiMessage.textContent = "";

            const responseData = await response.json();
            const placesList = document.getElementById("placesList");
            let data = "";

            // No attractions in area
            if (!(responseData.results.length > 0)) {
                apiMessage.textContent = "No places found.";
            }

            // Adds each of the foursquare places information to the home page
            responseData.results.forEach((place: any) => {

                // I figured out how to use the icon url from this
                // https://stackoverflow.com/questions/24377797/get-the-icon-of-a-foursquare-category-from-its-id
                const category = place.categories[0];
                const iconUrl = category.icon.prefix + "32" + category.icon.suffix;

                const placeName = place.name;
                const placeAddress = place.location.formatted_address;

                data += `
                    <div class="card mb-3">
                        <div class="card-body bg-black">
                            <img src="${iconUrl}" alt="Catagory icon" class="card-img-top text-white">
                            <h5 class="card-title text-white">${placeName}</h5>
                            <p class="card-text text-white">${placeAddress}</p>
                        </div>
                    </div>
                     `;
            })
            if (placesList) {
                placesList.innerHTML += data;
            }
        } catch (error: any) {
            console.error(`[ERROR] ${error}`);
            apiMessage.innerText = error.message;
        }
    }

    /**
     * Called when displaying the opportunities page
     */
    function DisplayOpportunityPage() {
        console.log("Calling DisplayOpportunityPage...");

        // Getting the opportunityList and opportunityModal working
        let opportunityList = document.getElementById("opportunityList") as HTMLElement;
        let data = "";

        async function GetOpportunities() {
            try {
                const response = await fetch("data/opportunities.json");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const jsonData = await response.json();
                const opportunitiesGet = jsonData.opportunity;
                if (!Array.isArray(opportunitiesGet)) {
                    throw new Error("[ERROR] JSON data does not contain a valid array!");
                }

                for (let opportunity of opportunitiesGet) {
                    data += `<tr>
                                <th scope="row" class="text-center">${opportunity.id}</th>
                                <td>${opportunity.title}</td>
                                <td>${opportunity.description}</td>
                                <td>${opportunity.dateTime}</td>
                                <td>
                                    <button type="button" class="btn btn-primary signUpButton" data-bs-toggle="modal" data-bs-target="#opportunityModal" value="${opportunity.id}">Sign Up</button>
                                </td>
                             </tr>`;
                }
            }
            catch (error) {
                console.error(`[ERROR] Opportunity get failed: ${error}`);
            }
        }

        GetOpportunities().then(() => {
            opportunityList.innerHTML = data;
        });

        const signUpButtons = document.getElementsByClassName("signUpButton") as HTMLCollectionOf<HTMLButtonElement>;
        const sendButton = document.getElementById("sendButton") as HTMLButtonElement;
        const opportunityId = document.getElementById("opportunityId") as HTMLElement;
        const fullName = document.getElementById("fullName") as HTMLInputElement;
        const emailAddress = document.getElementById("emailAddress") as HTMLInputElement;
        const preferredRole = document.getElementById("preferredRole") as HTMLInputElement;
        const thanksMessage = document.getElementById("thanksMessage") as HTMLElement;

        for (const signUpButton of signUpButtons) {
            signUpButton.addEventListener("click", function(event) {
                event.preventDefault();
                let currentButton = event.target as HTMLButtonElement;
                let opportunityId = document.getElementById("opportunityId") as HTMLElement;
                if (currentButton && opportunityId) {
                    opportunityId.textContent = currentButton.value;
                }
            })
        }

        // Getting the opportunityModal working
        sendButton.addEventListener("click", function(e){
            e.preventDefault();

            console.log(`ID: ${opportunityId.textContent}, Full Name: ${fullName.value}, Email: ${emailAddress.value}, Role: ${preferredRole.value}`);
            let volunteer = new Volunteer(Number(opportunityId.textContent), fullName.value, emailAddress.value, preferredRole.value);

            const serialized = volunteer.serialize();
            if (serialized) {
                let key = `volunteer_${Date.now()}`;
                localStorage.setItem(key, serialized);
            }
            if (thanksMessage) {
                thanksMessage.textContent = "Thank you for volunteering!";
            }
        });
    }

    /**
     * Called when displaying the event page
     */
    async function DisplayEventPage() {
        console.log("Calling DisplayEventPage...");

        fetch("../github.io/data/events.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`[ERROR] Failed to fetch event types ${response.status}`);
                }
                return response.json();
            })
            .then(resData => {
                const filterSelect = document.getElementById("filterSelect") as HTMLSelectElement;

                resData.types.forEach((type:eventType) => {
                    filterSelect.innerHTML += `<option value="${type.val}">${type.name}</option>`
                })
            })
            .catch(error => {
                console.error(`[ERROR] Failed to add filter options ${error}`);
                return;
            });

        let data:eventDataJson = {
            "events": []
        };
        let keys = Object.keys(localStorage);

        keys.forEach((key:string) => {
            if (key.startsWith("event_")) {
                const eventData: string|null = localStorage.getItem(key);
                if (!eventData) {
                    console.error(`[ERROR] No data found for key: ${key}. Skipping`);
                    return;
                }

                try {
                    let event = new EventObj.Event();
                    event.deserialize(eventData);
                    data.events.push(event.toJSON());
                } catch (error) {
                    console.error(`[ERROR] Error deserializing event data: ${data}`);
                }
            } else {
                console.warn(`[WARNING] Skipping non-event (not 'event_') key: ${key}`);
            }
        });

        if (!data.events) {
            console.error(`[ERROR] No event data`);
            return;
        }

        let calendarEl = document.getElementById('calendar') as HTMLElement;

        // Class is imported in html so ignore error
        // @ts-ignore
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: data.events
        });

        calendar.render();

        let filterSelect = document.getElementById('filterSelect') as HTMLSelectElement;
        if(filterSelect) {
            filterSelect.addEventListener('change', function () {
                let selectedFilter = filterSelect.value;

                let filteredEvents = data.events.filter(function (event) {
                    return selectedFilter === "All" || event.dataFilter === selectedFilter;
                });

                calendar.setOption('events', filteredEvents);
            });
        }
    }

    /**
     * To be called when displaying the contact page
     */
    function DisplayContactPage() {
        console.log("Calling DisplayContactPage...");

        const sendButton = document.getElementById("sendButton") as HTMLButtonElement;
        const fullName = document.getElementById("fullName") as HTMLInputElement;
        const emailAddress = document.getElementById("emailAddress") as HTMLInputElement;
        const messageSubject = document.getElementById("messageSubject") as HTMLInputElement;
        const message = document.getElementById("message") as HTMLTextAreaElement;
        const submissionDetails = document.getElementById("submissionDetails") as HTMLElement;
        const thanksModalElement = document.getElementById("thanksModal") as HTMLElement;

        if (!sendButton || !fullName || !emailAddress || !messageSubject || !message || !thanksModalElement || !submissionDetails) {
            console.error("[ERROR] One or more form elements are missing");
            return;
        }

        // Get form values and show 'Thank You' message
        sendButton.addEventListener("click", function(e){
            e.preventDefault()

            const contact = new Contact(fullName.value, emailAddress.value, messageSubject.value, message.value);

            const serialized = contact.serialize();
            if (serialized) {
                let key = `contact_${Date.now()}`;
                localStorage.setItem(key, serialized);
            }

            const modalElement = document.getElementById('modal');
            if (modalElement) {
                // @ts-ignore
                const thanksModal = new window.bootstrap.Modal(modalElement)
                thanksModal.show();
            }

            // Displays submission details inside the modal
            submissionDetails.innerHTML =
                `<br />Name: ${contact.fullName}<br />
            Email: ${contact.emailAddress}<br />
            Subject: ${contact.messageSubject}<br />
            Message: ${contact.message}`;

            setTimeout(function() {
                router.navigate("/home");

            }, 5000);
        });
    }

    /**
     * To be called when displaying the about page
     */
    function DisplayAboutPage() {
        console.log("Calling DisplayAboutPage...");
    }

    /**
     * To be called when displaying the privacy policy page
     */
    function DisplayPrivacyPolicyPage() {
        console.log("Calling DisplayPrivacyPolicyPage...");
    }

    /**
     * To be called when displaying the terms of service page
     */
    function DisplayServiceTermsPage() {
        console.log("Calling DisplayServiceTermsPage...");
    }

    /**
     * To be called when displaying the login page
     */
    function DisplayLoginPage() {
        console.log("Calling DisplayLoginPage...");

        if (sessionStorage.getItem("user")) {
            console.log("[INFO] Redirecting logged in user from /login to /home");
            router.navigate("/home");
            return;
        }

        const messageArea = document.getElementById("messageArea") as HTMLElement;
        const loginButton = document.getElementById("loginButton") as HTMLButtonElement;
        const cancelButton = document.getElementById("cancelButton") as HTMLButtonElement;
        const loginForm = document.getElementById("loginForm") as HTMLFormElement;

        if (!loginButton) {
            console.error("[ERROR] loginButton not found in the DOM!");
            return;
        }

        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const username = (document.getElementById("username") as HTMLInputElement).value.trim();
            const password = (document.getElementById("password") as HTMLInputElement).value.trim();

            try {

                const response = await fetch("./data/users.json");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const jsonData = await response.json();
                console.log(`[DEBUG] Fetched JSON data ${jsonData}`);

                const users = jsonData.users;
                if (!Array.isArray(users)) {
                    throw new Error("[ERROR] JSON data does not contain a valid array!");
                }

                let success = false;
                let authenticatedUser = null;

                for (const user of users) {
                    if (user.Username === username && user.Password === password) {
                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }

                if (success) {

                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName : authenticatedUser.DisplayName,
                        EmailAddress : authenticatedUser.EmailAddress,
                        Username : authenticatedUser.Username
                    }));

                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert", "alert-danger");

                    LoadHeader().then(async () => {
                        router.navigate("/home");

                        const notifToast = new NotificationToast();
                        await notifToast.load();
                        notifToast.show(`<h4>Welcome, ${username}!</h4>`, 3600);
                    });

                } else {
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again";

                    (document.getElementById("username") as HTMLInputElement).focus();
                    (document.getElementById("username") as HTMLInputElement).select();
                }

            } catch (error) {
                console.error(`[ERROR] login failed ${error}`);
            }

        });

        if (!cancelButton) {
            console.error("[ERROR] cancelButton not found in the DOM!");
            return;
        }

        if (cancelButton && loginForm) {
            cancelButton.addEventListener("click", async (event) => {
                event.preventDefault();
                loginForm.reset();
                router.navigate("/");
            });
        } else {
            console.warn("[WARNING] Cancel Button and/or Login Form not found in DOM");
        }
    }

    /**
     * To be called when displaying the gallery page
     */
    function DisplayGalleryPage() {
        console.log("Calling DisplayGalleryPage...");
        const gallery = new Gallery();
        GetGalleryImages(gallery);

        const closeButton = document.getElementById("closeGallery");
        if (closeButton) {
            closeButton.addEventListener("click", () => gallery.closeGalleryModal());
        }
    }

    /**
     * Sets up the gallery modal with image information from gallery.json
     * @returns {Promise<void>}
     */
    async function GetGalleryImages(gallery: Gallery): Promise<void> {
        console.log("Getting gallery images...");

        try {
            const response = await fetch("data/gallery.json");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const jsonData = await response.json();
            const galleryImages = jsonData.images;

            if (!Array.isArray(galleryImages)) {
                throw new Error("[ERROR] JSON data does not contain a valid array!");
            }

            const galleryElement = document.getElementById("gallery") as HTMLElement;
            const modalContent = document.getElementById("modal-content") as HTMLElement;

            if (!galleryElement || !modalContent) {
                console.error("[ERROR] Gallery or modal element not found.");
                return;
            }

            // Clear previous content
            galleryElement.innerHTML = "";
            modalContent.innerHTML = "";

            // Create slides
            const slides = document.createElement("div");
            slides.id = "slides";
            modalContent.appendChild(slides);

            const imgs = document.getElementById("gallery");

            // Add images to gallery grid
            galleryImages.forEach((imgData, index) => {
                const img = document.createElement("img");
                img.src = `./images/${imgData.src}`;
                img.alt = imgData.alt;
                img.className = "img h-25 w-25 hover-shadow";

                img.addEventListener("click", () => {
                    gallery.openGalleryModal();
                    gallery.currentGallerySlide(index + 1);
                });

                if (imgs) {
                    imgs.appendChild(img);
                }
            });

            // Add slides to modal
            galleryImages.forEach((imgData, index) => {
                const slide = document.createElement("div");
                slide.className = "mySlides";

                slide.innerHTML = `
                <div class="numbertext">${index + 1} / ${galleryImages.length}</div>
                <img src="./images/${imgData.src}" alt="${imgData.alt}" class="img h-75 w-75">`;

                slides.appendChild(slide);
            });

            modalContent.innerHTML += `
                <a class="prev">&#10094;</a>
                <a class="next">&#10095;</a>
                
                <div class="caption-container">
                    <p id="caption"></p>
                </div>
            `;

            const prev = document.querySelector(".prev") as HTMLAnchorElement;
            const next = document.querySelector(".next") as HTMLAnchorElement;

            if (prev && next) {
                prev.addEventListener("click", () => gallery.plusGallerySlides(-1));
                next.addEventListener("click", () => gallery.plusGallerySlides(1));
            }

            const div= document.createElement('div');

            galleryImages.forEach((imgData, index) => {
                const img = document.createElement("img");
                img.className = "demo h-25 w-25";
                img.src = `./images/${galleryImages[index].src}`;
                img.alt = galleryImages[index].alt;

                img.addEventListener("click", () => gallery.currentGallerySlide(index + 1));

                div.appendChild(img);
            })

            modalContent.appendChild(div);

        } catch (error) {
            console.error(`[ERROR] Failed to get gallery images: ${error}`);
        }
    }

    /**
     * To be called when displaying the donate page
     */
    function DisplayDonatePage() {
        console.log("Calling DisplayDonatePage...");
    }

    /**
     * To be called when displaying the event edit/add page
     */
    function DisplayEventEditPage() {
        console.log("Calling DisplayEventEditPage...");

        const hashParts = location.hash.split("#");
        const page:string = hashParts.length > 2 ? hashParts[2] : "";

        const editButton = document.getElementById("editButton") as HTMLButtonElement | null;
        const pageTitle = document.querySelector("main > h1");

        if (!pageTitle) {
            console.error("[ERROR] Main Page Title element not found");
            return;
        }

        addEventListenerOnce("cancelButton", "click", handleCancelClick);

        if (page === "add") {
            document.title = "Add Event";
            pageTitle.textContent = "Add Event";

            if (editButton) {
                editButton.innerHTML = "<i class=\"fa-solid fa-plus\"></i> Add";
                editButton.classList.remove("btn-primary");
                editButton.classList.add("btn-success");

                addEventListenerOnce("editButton", "click", handleAddEventClick);
            }

        } else {
            const eventData = localStorage.getItem(page);
            if (!eventData) {
                console.error(`[ERROR] No event data found of for id`)
                return;
            }

            const event = new EventObj.Event();
            event.deserialize(eventData);

            // Pre-population the form with current values
            (document.getElementById("eventTitle") as HTMLInputElement).value = event.title;
            (document.getElementById("eventStartDate") as HTMLInputElement).value = event.start;
            (document.getElementById("eventEndDate") as HTMLInputElement).value = event.end;
            (document.getElementById("eventLocation") as HTMLInputElement).value = event.location;
            (document.getElementById("eventDesc") as HTMLInputElement).value = event.description;

            fetch("../data/events.json")
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`[ERROR] Failed to fetch event types ${response.status}`);
                    }
                    return response.json();
                })
                .then(resData => {
                    const filterSelect = document.getElementById("eventType") as HTMLSelectElement;

                    resData.types.forEach((type:{name:string, val:string}) => {
                        if (type.name !== "All Events") {
                            filterSelect.innerHTML += `<option value="${type.val}">${type.name}</option>`;
                        }
                    })
                })
                .catch(error => {
                    console.error(`[ERROR] Failed to add filter options ${error}`);
                    return;
                });

            (document.getElementById("eventType") as HTMLInputElement).value = event.dataFilter;

            if (editButton) {
                editButton.innerHTML = "<i class=\"fa-solid fa-file-pen\"> Edit";
                editButton.classList.remove("btn-success");
                editButton.classList.add("btn-primary");
            }

            addEventListenerOnce("editButton", "click", (event) => handleEditEventClick(event, event, page));
        }

    }

    /**
     * Attaches validation event listeners to form fields dynamically
     * @param elementId
     * @param event
     * @param handler
     */
    function addEventListenerOnce(elementId:string, event:string, handler:EventListener):void {

        const element = document.getElementById(elementId); // Retrieve element from DOM

        if (element) {
            // Removes any existing event listeners of the same type
            element.removeEventListener(event, handler);

            // Attach the new (latest) event for that element
            element.addEventListener(event, handler);
        } else {
            console.warn(`[WARN] Element with id '${elementId}' not found`);
        }

    }

    /**
     * Handles the process of adding a new contact
     * @param event - the event object to prevent default form submission
     */
    function handleAddEventClick(event:Event):void {
        // Prevents default form submission behaviour
        event.preventDefault();

        // Get all the event attributes
        const eventTitle:string = (document.getElementById("eventTitle") as HTMLInputElement).value;
        const eventStartDate:string = (document.getElementById("eventStartDate") as HTMLInputElement).value;
        const eventEndDate:string = (document.getElementById("eventEndDate") as HTMLInputElement).value;
        const eventLocation:string = (document.getElementById("eventLocation") as HTMLInputElement).value;
        const eventDesc:string = (document.getElementById("eventDesc") as HTMLInputElement).value;
        const eventType:string = (document.getElementById("eventType") as HTMLInputElement).value;

        let newEvent = new EventObj.Event( eventTitle, eventStartDate, eventEndDate, eventLocation,
            eventDesc, eventType);

        let eventSerialized = newEvent.serialize();

        if (eventSerialized) {
            let key = `event_${Date.now()}`;
            localStorage.setItem(key, eventSerialized);
            console.log(`[INFO] Event added: ${key}`);
        } else {
            console.error("[ERROR] Event serialization failed");
        }

        // Redirect upon success
        router.navigate("/event-plan");
    }

    /**
     * Handles the process of editing an existing contact
     * @param event - used to prevent default form submission
     * @param event - used to prevent default form submission
     * @param eventEdit - the event object to be updated
     * @param page - unique contact identifier
     */
    function handleEditEventClick(event:Event, eventEdit:any, page:string):void {
        // Prevents default form submission behaviour
        event.preventDefault();

        // Get all the event attributes
        const eventTitle:string = (document.getElementById("eventTitle") as HTMLInputElement).value;
        const eventStartDate:string = (document.getElementById("eventStartDate") as HTMLInputElement).value;
        const eventEndDate:string = (document.getElementById("eventEndDate") as HTMLInputElement).value;
        const eventLocation:string = (document.getElementById("eventLocation") as HTMLInputElement).value;
        const eventDesc:string = (document.getElementById("eventDesc") as HTMLInputElement).value;
        const eventType:string = (document.getElementById("eventType") as HTMLInputElement).value;

        const editEvent = new EventObj.Event();

        // Update event object with new values
        editEvent.title = eventTitle;
        editEvent.start = eventStartDate;
        editEvent.end = eventEndDate;
        editEvent.location = eventLocation;
        editEvent.description = eventDesc;
        editEvent.dataFilter = eventType;

        let eventSerial = editEvent.serialize();

        if (!eventSerial) {
            console.error("[ERROR] An error has occurred while serializing event for edit")
            return;
        }

        // Update the event object in the localStorage with updated csv
        localStorage.setItem(page, eventSerial);

        router.navigate("/event-plan");
    }

    /**
     * Redirects user back to the contact-list page
     */
    function handleCancelClick() {
        router.navigate("/event-plan");
    }

    /**
     * To be called when displaying the event plan page
     */
    function DisplayEventPlanPage() {
        console.log("Calling DisplayEventPlanPage...");

        const eventList: HTMLElement|null = document.getElementById("eventList");
        if (!eventList) {
            console.error("[ERROR] Unable to locate element with Id 'eventList'");
            return;
        }

        let data = "";
        let keys = Object.keys(localStorage);
        let index = 1;

        keys.forEach((key:string) => {
            if (key.startsWith("event_")) {
                const eventData: string|null = localStorage.getItem(key);
                if (!eventData) {
                    console.error(`[ERROR] No data found for key: ${key}. Skipping`);
                    return;
                }

                try {
                    let event = new EventObj.Event();
                    event.deserialize(eventData);

                    data += `<tr>
                                    <th scope="row" class="text-center">${index}</th>
                                    <td>${event.title}</td>
                                    <td>${event.start}</td>
                                    <td>${event.end}</td>
                                    <td>${event.location}</td>
                                    <td>${event.description}</td>
                                    <td>${event.dataFilter}</td>
                                    <td class="text-center">
                                        <button value="${key}" class="btn btn-warning btn-sm edit">
                                            <i class="fa-solid fa-pen"></i> Edit
                                        </button>
                                    </td>
                                    <td>
                                        <button value="${key}" class="btn btn-danger btn-sm delete">
                                            <i class="fa-solid fa-dumpster-fire"></i> Delete
                                        </button>
                                    </td>
                             </tr>`
                    index++;
                } catch (error) {
                    console.error(`[ERROR] Error deserializing event data: ${data}`);
                }
            } else {
                console.warn(`[WARNING] Skipping non-event (not 'event_') key: ${key}`);
            }
        });
        eventList.innerHTML = data;

        const addButton: HTMLElement|null = document.getElementById("addButton");
        if (addButton) {
            addButton.addEventListener("click", ()=>{
                router.navigate("/event-edit#add");
            });
        }

        const deleteButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll("button.delete");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", function() {
                const eventKey = this.value;
                console.log(`[DEBUG] Deleting event: ${eventKey}`);

                if (!eventKey.startsWith("event_")) {
                    console.error(`[ERROR] Invalid event key format`);
                    return;
                }

                if (confirm("Delete event, please confirm")) {
                    localStorage.removeItem(eventKey);
                    router.navigate("/event-plan");
                    location.reload();
                }
            });
        });

        const editButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll("button.edit");
        editButtons.forEach((button) => {
            button.addEventListener("click", function() {
                router.navigate(`/event-edit#${this.value}`);
            });
        });
    }

    /**
     * To be called when displaying the statistic page
     */
    function DisplayStatisticPage() {
        console.log("Calling DisplayStatisticPage...");

        //@ts-ignore
        let visitorsChart: window.Chart; // Move outside the function to persist
        //@ts-ignore
        let volunteerChart: window.Chart;
        const ctxVisitors = document.getElementById('visitors') as HTMLCanvasElement;
        const ctxVolunteers = document.getElementById("volunteers") as HTMLCanvasElement;
        if (!visitorsChart) {
            fetch("../data/visitors.json")
                .then(response => response.json())
                .then(visitorData => {
                    const visitorsObj = visitorData.visitors;
                    const volunteersObj = visitorData.volunteers;
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
                    const dataArrayVisitor = Object.values(visitorsObj); // or map with entries
                    const labelsArrayVisitor = Object.keys(visitorsObj);
                    const dataArrayVolunteer = Object.values(volunteersObj); // or map with entries
                    const labelsArrayVolunteer = Object.keys(volunteersObj);

                    // Now create the charts with the real data
                    //@ts-ignore
                    visitorsChart = new window.Chart(ctxVisitors, {
                        type: 'bar',
                        data: {
                            labels: labelsArrayVisitor,
                            datasets: [{
                                label: '# of Visitors',
                                data: dataArrayVisitor,
                                borderWidth: 1,
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });

                    //@ts-ignore
                    volunteerChart = new window.Chart(ctxVolunteers, {
                        type: 'bar',
                        data: {
                            labels: labelsArrayVolunteer,
                            datasets: [{
                                label: '# of Visitors',
                                data: dataArrayVolunteer,
                                borderWidth: 1,
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                });
        }
    }

    /**
     * To be called when displaying the register page
     */
    function DisplayRegisterPage() {
        console.log("Calling DisplayRegisterPage...");
    }

    // Listens for route changes, update nav links and calls the respective Display*() function
    document.addEventListener("routeLoaded", (event) => {

        if (!(event instanceof CustomEvent) || typeof event.detail !== 'string') {
            console.warn("[WARNING] Received an invalid 'routeLoaded event''");
            return;
        }
        const newPath = event.detail;
        console.log(`[INFO] New route loaded: ${newPath}`);

        LoadHeader().then(() => {
            handlePageLogin(newPath);
        });
    });

    window.addEventListener("sessionExpired", () => {
        console.warn(`[SESSION] Redirecting the user due to inactivity.`);
        router.navigate("/login");
    });

    /**
     * Sets everything up when the page is loaded
     */
    function handlePageLogin(path: string) {
        console.log("Starting App...");

        document.title = pageTitles[path] || "Untitled Page";
        const protectedRoutes = ['/event-plan', '/event-edit', "/statistic"];
        if (protectedRoutes.includes(path)) {
            AuthGuard(); // Redirected to /login if not authenticated
        }

        switch (path) {
            case "/":
            case "/home":
                DisplayHomePage();
                break;
            case "/opportunity":
                DisplayOpportunityPage();
                break;
            case "/event":
                DisplayEventPage();
                break;
            case "/contact":
                DisplayContactPage();
                break;
            case "/about":
                DisplayAboutPage();
                break;
            case "/privacyPolicy":
                DisplayPrivacyPolicyPage();
                break;
            case "/serviceTerms":
                DisplayServiceTermsPage();
                break;
            case "/login":
                DisplayLoginPage();
                break;
            case "/gallery":
                DisplayGalleryPage();
                break;
            case "/donate":
                DisplayDonatePage();
                break;
            case "/statistic":
                DisplayStatisticPage();
                break;
            case "/event-plan":
                DisplayEventPlanPage();
                break;
            case "/event-edit":
                DisplayEventEditPage();
                break;
            default:
                console.warn(`[WARNING] Incorrect path: ${path}`);
        }
    }

    async function Start() {
        console.log("App Starting...");

        // Load header first, then run CheckLogin
        await LoadHeader();
        await LoadFooter();
        await LoadBackToTop();
        AuthGuard();

        const currentPath = location.hash.slice(1) || "/";
        router.loadRoute(currentPath);

        handlePageLogin(currentPath);
    }

    // Listens for the "load" event, calls the Start function when it does
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        Start();
    });
})()
