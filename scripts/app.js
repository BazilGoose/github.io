"use strict";

// Names: Cole de Ruiter, Noah Barraclough
// Student IDS: 100906323, 100923580
// Date: February 23rd, 2025

//IIFE - Immediately Invoke Functional Expression

(function () {

    let GallerySlideIndex = 1;

    /**
     * Checks the login status of the user, changes the login button in the navbar to logout
     */
    function CheckLogin() {
        console.log("[INFO] Checking user login status");

        const loginNav = document.getElementById("login");

        if (!loginNav) {
            console.warn("[WARNING] loginNav element not found. Skipping CheckLogin().");
            return;
        }

        const userSession = sessionStorage.getItem("user");

        if (userSession) {
            loginNav.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
            loginNav.href = "#";
            loginNav.addEventListener("click", (event) => {
                event.preventDefault();
                sessionStorage.removeItem("user");
                location.href = "login.html";
            });
        }

    }

    /**
     * Updates some names on the nav bar dynamically
     */
    function updateNavbar() {
        // Changes "Opportunity" link in navbar to now say "Volunteer Now"
        document.querySelector("#opportunity").textContent = "Volunteer Now";

        // Adds "Donate" link to navbar, currently does nothing as no function was stated
        let navbarList = document.getElementById("navList");
        let donateLink = document.createElement("li");
        donateLink.setAttribute("class", "nav-item");
        donateLink.innerHTML = `<a id="donate" class="nav-link" href="donate.html">Donate</a>`;
        navbarList.appendChild(donateLink);
        let searchBar = document.createElement("li");
        searchBar.setAttribute("class", "nav-item");
        searchBar.setAttribute("autocomplete", "off");
        searchBar.innerHTML = `
            <input id="searchBar" class="form-control mr-sm-2" type="search" placeholder="Search Events..." aria-label="Search">
            <ul id="searchResults"></ul>`;
        navbarList.appendChild(searchBar);
    }

    /**
     * Dynamically add a footer to the page with links to privacy policy and the terms of service
     */
    function appendFooter() {
        // - - - - - Create elements - - - - -
        let footer = document.createElement("footer");
        footer.className = "mt-auto py-lg-5"

        let nav = document.createElement("nav");
        nav.className = "navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom";

        let divContainer = document.createElement("div");
        divContainer.className = "container-fluid";

        let list = document.createElement("ul");
        list.className = "navbar-nav me-auto mb-2 mb-lg-0";

        let listItem1 = document.createElement("li");
        listItem1.className = "nav-item";
        let anchor1 = document.createElement("a");
        anchor1.className = "nav-link";
        anchor1.href = "privacyPolicy.html";
        anchor1.textContent = "Privacy Policy";
        listItem1.appendChild(anchor1);

        let listItem2 = document.createElement("li");
        listItem2.className = "nav-item";
        let anchor2 = document.createElement("a");
        anchor2.className = "nav-link";
        anchor2.href = "serviceTerms.html";
        anchor2.textContent = "Terms of Service";
        listItem2.appendChild(anchor2);

        // - - - - - - Append Elements - - - - -
        // Add nav to footer
        footer.appendChild(nav);

        // add the bootstrap container to the nav
        nav.appendChild(divContainer);

        // add the list to the container
        divContainer.appendChild(list);

        // Add the list items into the list
        list.appendChild(listItem1);
        list.appendChild(listItem2);

        // Adding the footer to the bottom of the body
        document.body.appendChild(footer);
    }

    /**
     * Sets up the "back to top button"
     */
    function backToTopButtonSetUp() {
        // Gotten from: https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
        let backToTopButton = document.getElementById("backToTopButton");

        window.onscroll = function() {scrollFunction()};

        // Hides backToTopButton if at top of page
        function scrollFunction() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                backToTopButton.style.display = "block";
            } else {
                backToTopButton.style.display = "none";
            }
        }
    }

    /**
     * Called when displaying the homepage
     */
    function DisplayHomePage(){
        console.log("Calling DisplayHomePage...");

        // Get Involved Button Configuration
        let getInvolvedButton = document.getElementById("GetInvolvedBtn");
        getInvolvedButton.addEventListener("click", function(){
            location.href = "opportunity.html";
        });

        displayPlaces();
    }

    /**
     * Displays the new foursquare places and attractions in the home page
     */
    async function displayPlaces() {

        // https://foursquare.com/developers/home
        const apiKey = "fsq3NDg1qRl7Cpike3JK4CbR6BSimnxk0WKduffUuJhEg8g=";
        const resultLimit = 5;

        const apiMessage = document.getElementById("apiMessage");

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
            if (!responseData.results.length > 0) {
                apiMessage.textContent = "No places found.";
            }

            // Adds each of the foursquare places information to the home page
            responseData.results.forEach((place) => {

                // I figured out how to use the icon url from this
                // https://stackoverflow.com/questions/24377797/get-the-icon-of-a-foursquare-category-from-its-id
                const category = place.categories[0];
                const iconUrl = category.icon.prefix + "32" + category.icon.suffix;

                const placeName = place.name;
                const placeAddress = place.location.formatted_address;

                data += `
                    <div class="card mb-3">
                        <div class="card-body">
                            <img src="${iconUrl}" alt="Catagory icon" class="card-img-top">
                            <h5 class="card-title">${placeName}</h5>
                            <p class="card-text">${placeAddress}</p>
                        </div>
                    </div>
                     `;
            })
            placesList.innerHTML += data;

        } catch (error) {
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
        let opportunityList = document.getElementById("opportunityList");
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

                let i = 1;

                for (let opportunity of opportunitiesGet) {
                    data += `<tr>
                                <th scope="row" class="text-center">${i}</th>
                                <td>${opportunity.title}</td>
                                <td>${opportunity.description}</td>
                                <td>${opportunity.dateTime}</td>
                                <td>
                                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#opportunityModal" onclick="modalSetUp('${i}')">Sign Up</button>
                                </td>
                             </tr>`;
                    i += 1;
                }
            }
            catch (error) {
                console.error(`[ERROR] Opportunity get failed: ${error}`);
            }
        }

        GetOpportunities()
            .then(() => {opportunityList.innerHTML = data;});

        // Getting the opportunityModal working
        let sendButton = document.getElementById("sendButton");
        sendButton.addEventListener("click", function(e){
            e.preventDefault();

            console.log(`ID: ${opportunityId.textContent}, Full Name: ${fullName.value}, Email: ${emailAddress.value}, Role: ${preferredRole.value}`);
            let volunteer = new Volunteer(opportunityId.textContent, fullName.value, emailAddress.value, preferredRole.value);
            if (volunteer.serialize()) {
                let key = `volunteer_${Date.now()}`;
                localStorage.setItem(key, volunteer.serialize());
            }
            let thanksMessage = document.getElementById("thanksMessage");
            thanksMessage.textContent = "Thank you for volunteering!";
        });
    }

    /**
     * Called when displaying the event page
     */
    async function DisplayEventPage() {
        console.log("Calling DisplayEventPage...");

        try {
            const response = await fetch("data/events.json");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const jsonData = await response.json()
                .then(jsonData => {
                    const events = jsonData.events;
                    if (!Array.isArray(events)) {
                        throw new Error("[ERROR] JSON data does not contain a valid array!");
                    }

                    let calendarEl = document.getElementById('calendar');
                    let calendar = new FullCalendar.Calendar(calendarEl, {
                        initialView: 'dayGridMonth',
                        events: events
                    });

                    calendar.render();

                    let filterSelect = document.getElementById('filterSelect');
                    filterSelect.addEventListener('change', function () {
                        let selectedFilter = filterSelect.value;

                        let filteredEvents = events.filter(function (event) {
                            return selectedFilter === "All" || event.dataFilter === selectedFilter;
                        });

                        calendar.setOption('events', filteredEvents);
                    });
                });
        }
        catch (error) {
            console.error(`[ERROR] Event get failed ${error}`);
        }
    }

    /**
     * To be called when displaying the contact page
     */
    function DisplayContactPage() {
        console.log("Calling DisplayContactPage...");

        // Get form values and show 'Thank You' message
        let sendButton = document.getElementById("sendButton");

        sendButton.addEventListener("click", function(e){
            e.preventDefault()

            console.log(`Full Name: ${fullName.value}, Email ${emailAddress.value}, Subject: ${messageSubject.value}, Message: ${message.value}`);
            let contact = new Contact(fullName.value, emailAddress.value, messageSubject.value, message.value);
            if (contact.serialize()) {
                let key = `contact_${Date.now()}`;
                localStorage.setItem(key, contact.serialize());
            }

            let thanksModal = new bootstrap.Modal(document.getElementById("thanksModal"));
            thanksModal.show();

            setTimeout(function() {
                window.location.href = "index.html";

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

        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");

        // Hides message area initially
        messageArea.style.display = "none";

        if (!loginButton) {
            console.error("[ERROR] loginButton not found in the DOM!");
            return;
        }

        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {

                const response = await fetch("data/users.json");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const jsonData = await response.json();
                //console.log(`[DEBUG] Fetched JSON data ${jsonData}`);

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
                    location.href = "index.html";

                } else {
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again";

                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }

            } catch (error) {
                console.error(`[ERROR] login failed ${error}`);
            }

        });

        if (!cancelButton) {
            console.error("[ERROR] cancelButton not found in the DOM!");
            return;
        }

        cancelButton.addEventListener("click", async (event) => {
            event.preventDefault();
            document.getElementById("LoginForm").reset();
            location.href = "index.html";
        });
    }

    /**
     * To be called when displaying the gallery page
     */
    function DisplayGalleryPage() {
        console.log("Calling DisplayGalleryPage...");

        GetGalleryImages();
    }

    /**
     * Sets up the gallery modal with image information from gallery.json
     * @returns {Promise<void>}
     */
    async function GetGalleryImages() {
        console.log("Getting gallery images...");

        // Much of the function was gotten from: https://www.w3schools.com/howto/howto_js_lightbox.asp
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

            const gallery = document.getElementById("gallery");
            const modalContent = document.getElementById("modal-content");
            let i = 1;
            let j = 0;

            for (const galleryImage of galleryImages) {
                gallery.innerHTML += `<img src="./images/${galleryImage.src}" alt="${galleryImage.alt}" class="img h-25 w-25 hover-shadow" onclick="openGalleryModal();currentGallerySlide(${i});">`;
                i += 1;
                j += 1;
            }

            i = 1;

            for (const galleryImage of galleryImages) {
                modalContent.innerHTML += `
                <div class="mySlides">
                    <div class="numbertext">${i} / ${j}</div>
                    <img src="images/${galleryImage.src}" alt="${galleryImage.alt}" class="img h-75 w-75">
                </div>`;
                i += 1;
            }

            modalContent.innerHTML += `
            <a class="prev" onclick="plusGallerySlides(-1)">&#10094;</a>
            <a class="next" onclick="plusGallerySlides(1)">&#10095;</a>

            <div class="caption-container">
                <p id="caption"></p>
            </div>`;

            i = 1;

            for (const galleryImage of galleryImages) {
                modalContent.innerHTML += `
                <div class="column">
                    <img class="demo h-25 w-25" src="./images/${galleryImage.src}" alt="${galleryImage.alt}" onclick="currentGallerySlide(${i})">
                </div>`;
                i += 1;
            }

            GallerySlideIndex = 1;
            showGallerySlide(GallerySlideIndex);

        }
        catch (error) {
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
     * Updates the navbar to set the active link to the current page
     */
    function UpdateActiveNavLink() {
        console.log("UpdateActiveNavLink called...");

        const currentPage = document.title.trim();
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach(link => {
            if (link.textContent.trim() === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Loads the navbar into the current page header
     * @returns {Promise<void>}
     */
    async function LoadHeader() {
        console.log("Loading Header...");

        return fetch("header.html")
            .then(response => response.text())
            .then(data => {
                document.querySelector('header').innerHTML = data;
            })
            .catch(error => console.error(`Unable to load header: ${error}`));
    }

    async function LoadSearchResults() {
        console.log("Loading search results...");

        // Idea gotten from https://www.shecodes.io/athena/38555-how-to-create-a-search-bar-using-html-css-json-and-javascript
        // that and my slowly escaping sanity
        let searchBar = document.getElementById("searchBar");
        let searchList = document.getElementById("searchResults");

        searchBar.addEventListener("keyup", async function() {
            try {
                const response = await fetch("data/search.json");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const jsonData = await response.json();

                const searchResults = jsonData.searchOptions;
                if (!Array.isArray(searchResults)) {
                    throw new Error("[ERROR] JSON data does not contain a valid array!");
                }

                searchList.innerHTML = "";
                let searchTerm = searchBar.value.toLowerCase();

                for (const searchResult of searchResults) {
                    if (searchResult.title.toLowerCase().indexOf(searchTerm) > -1) {
                        searchList.innerHTML += `<li><a class="nav-link" href="./${searchResult.link}">${searchResult.title}</a></li>`;
                    }
                }

            }
            catch (error) {
                console.error(`[ERROR] Failed to load search results: ${error}`);
            }
        });

        searchBar.addEventListener("focusout", () => {
            if (searchBar.value.trim() === "") {
                searchList.innerHTML = "";
            }
        });

    }

    function Start() {
        console.log("Starting App...");

        // Load header then do something after it is finished
        LoadHeader()
            .then( () => {updateNavbar();})
            .then( () => {UpdateActiveNavLink();})
            .then( () => {LoadSearchResults();})
            .then( () => {CheckLogin();});

        appendFooter();
        backToTopButtonSetUp();

        switch (document.title) {
            case "Home":
                DisplayHomePage();
                break;
            case "Opportunities":
                DisplayOpportunityPage();
                break;
            case "Events":
                DisplayEventPage();
                break;
            case "Contacts":
                DisplayContactPage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Privacy Policy":
                DisplayPrivacyPolicyPage();
                break;
            case "Terms of Service":
                DisplayServiceTermsPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Gallery":
                DisplayGalleryPage();
                break;
            case "Donate":
                DisplayDonatePage();
                break;
        }
    }

    window.addEventListener("load", Start);
})()
