"use strict";

/**
 * Loads the navbar into the current page header
 * @returns {Promise<void>}
 */
export async function LoadHeader():Promise<void> {
    console.log("[INFO] Loading Header...");

    return fetch("views/components/header.html")
        .then(response => response.text())
        .then(data => {
            const headerElement = document.querySelector("header");
            if (headerElement) {
                headerElement.innerHTML = data;
            } else {
                console.error("[ERROR] header not found in DOM")
            }
            updateNavbar();
            updateActiveNavLink();
            CheckLogin();
            LoadSearchResults();
        })
        .catch(error => console.error(`[ERROR] Unable to load header: ${error}`));
}

/**
 * Updates some names on the nav bar dynamically
 */
function updateNavbar() {
    // Changes "Opportunity" link in navbar to now say "Volunteer Now"
    const opportunityLink = document.querySelector("#opportunity");
    if (opportunityLink) {
        opportunityLink.innerHTML = `<i class=\"fa-solid fa-handshake-angle\"></i> Volunteer Now`;
    }

    const navbarList = document.getElementById("navList");
    if (!navbarList) {
        return;
    }

    // Adds "Donate" link to navbar, currently does nothing as no function was stated
    let donateLink = document.createElement("li");
    donateLink.setAttribute("class", "nav-item");
    donateLink.innerHTML = `<a id="donate" class="nav-link" href="#/donate"><i class="fa-solid fa-sack-dollar"></i> Donate</a>`;
    navbarList.appendChild(donateLink);
    let searchBar = document.createElement("li");
    searchBar.setAttribute("class", "nav-item");
    searchBar.setAttribute("autocomplete", "off");
    searchBar.innerHTML = `
            <input id="searchBar" class="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search">
            <ul id="searchResults"></ul>`;
    navbarList.appendChild(searchBar);
}

/**
 * Updates the navbar to set the active link to the current page
 */
export function updateActiveNavLink():void {
    console.log("[INFO] UpdateActiveNavLink called...");

    // Get the current path
    const currentPath = location.hash.slice(1) || "/";
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {

        const linkPath = link.getAttribute("href")?.replace("#", "");
        if (currentPath === linkPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function handleLogout(event:Event):void {
    event.preventDefault();
    sessionStorage.removeItem("user");
    console.log("[INFO] Logged user out. Update UI...");

    LoadHeader()
        .then( () => {
            location.hash = "/";
        });
}

function CheckLogin() {
    console.log("[INFO] Checking user login status");

    const loginNav = document.getElementById("login") as HTMLAnchorElement;

    if (!loginNav) {
        console.warn("[WARNING] loginNav element not found. Skipping CheckLogin().");
        return;
    }

    const userSession = sessionStorage.getItem("user");

    // Logged in
    if (userSession) {
        loginNav.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
        loginNav.href = "#";
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", handleLogout);

        const navbarList = document.getElementById("navList");
        if (!navbarList) {
            return;
        }

        let authLinkDropdown = document.createElement("li");
        authLinkDropdown.setAttribute("class", "nav-item dropdown");

        authLinkDropdown.innerHTML = ` 
                    <button class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        Secure pages
                    </button>
                    <ul id="authenticatedLinks" class="dropdown-menu">
                            <li><a id="statistic" class="nav-link" href="#/statistic"><i class="fa-solid fa-chart-simple"></i> Statistics</a></li>
                            <li><a id="event-plan" class="nav-link" href="#/event-plan"><i class="fa-solid fa-clipboard"></i> Event Planning</a></li>
                    </ul>`

        navbarList.appendChild(authLinkDropdown);
        updateActiveNavLink()

    } else {
        loginNav.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", () => location.hash = "/login");
    }
}

/**
 * Loads the search results for the search bar, filters by what you type into it
 * @returns {Promise<void>}
 */
async function LoadSearchResults() {
    console.log("Loading search results...");

    // Idea gotten from https://www.shecodes.io/athena/38555-how-to-create-a-search-bar-using-html-css-json-and-javascript
    // that and my slowly escaping sanity
    let searchBar = document.getElementById("searchBar") as HTMLInputElement;
    let searchList = document.getElementById("searchResults") as HTMLElement;

    if (!searchBar) {
        console.error("[ERROR] Search bar not found");
        return;
    }

    // Creates a list of results when you release a key
    searchBar.addEventListener("keyup", async function() {
        try {
            // Gets the possible search results from the search json file
            const response = await fetch("data/search.json");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const jsonData = await response.json();

            // Turns the json data into searchOptions json data
            const searchResults = jsonData.searchOptions;
            if (!Array.isArray(searchResults)) {
                throw new Error("[ERROR] JSON data does not contain a valid array!");
            }

            // Resets the search result list
            if (searchList) {
                searchList.innerHTML = "";
            }
            let searchTerm = searchBar.value.toLowerCase();

            // If any of the characters within the title of the search option is found in the search bar
            // input, it will add the search option to the search result list
            for (const searchResult of searchResults) {
                if (searchResult.title.toLowerCase().indexOf(searchTerm) > -1) {
                    searchList.innerHTML += `<li><a class="nav-link" href="${searchResult.link}">${searchResult.title}</a></li>`;
                }
            }

        }
        catch (error) {
            console.error(`[ERROR] Failed to load search results: ${error}`);
        }
    });

    // Removes the list of search results if you have unfocused the search bar and don't have anything inputted
    searchBar.addEventListener("focusout", () => {
        if (searchBar.value.trim() === "") {
            searchList.innerHTML = "";
        }
    });

}