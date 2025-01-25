"use strict";

//IIFE - Immediately Invoke Functional Expression

(function () {

    function updateNavbar() {
        // Changes "Opportunity" link in navbar to now say "Volunteer Now"
        document.getElementById("opportunity").textContent = "Volunteer Now";

        // Adds "Donate" link to navbar, currently does nothing as no function was stated
        let navbarList = document.getElementById("navList");
        let donateLink = document.createElement("li");
        donateLink.setAttribute("class", "nav-item");
        donateLink.innerHTML = `<a id="donate" class="nav-link" href="#">Donate</a>`;
        navbarList.appendChild(donateLink);
    }

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

    function backToTopButtonSetUp() {
        // Gotten from: https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
        let backToTopButton = document.getElementById("backToTopButton");

		// When the user scrolls down 20px from the top of the document, show the button
		window.onscroll = function() {scrollFunction()};

		function scrollFunction() {
			if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
				backToTopButton.style.display = "block";
			} else {
				backToTopButton.style.display = "none";
			}
		}

		// When the user clicks on the button, scroll to the top of the document
		backToTopButton.addEventListener("click", function() {
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		});
    }

    function DisplayHomePage(){
        console.log("Calling DisplayHomePage...");
        let currentNavItem = document.getElementById("index");
        currentNavItem.className = currentNavItem.className.concat(" active");
        currentNavItem.ariaCurrent = "page";

        // Get Involved Button Configuration
        let getInvolvedButton = document.getElementById("GetInvolvedBtn");
        getInvolvedButton.addEventListener("click", function(){
            location.href = "opportunity.html";
        });

        updateNavbar()
        appendFooter()
        backToTopButtonSetUp()
    }

    function DisplayOpportunityPage() {
        console.log("Calling DisplayOpportunityPage...");
        let currentNavItem = document.getElementById("opportunity");
        currentNavItem.className = currentNavItem.className.concat(" active");
        currentNavItem.ariaCurrent = "page";

        // Getting the opportunityList and opportunityModal working
        let opportunityList = document.getElementById("opportunityList");
        let data = "";

        data += `<tr>
                    <th scope="row" class="text-center">1</th>
                    <td>TESTING TITLE</td>
                    <td>TESTING DESCRIPTION</td>
                    <td>9999-12-31 11:59</td>
                    <td>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#opportunityModal" onclick="modalSetUp('1')">MODAL TEST</button>
                    </td>
                 </tr>`;
        data += `<tr>
                    <th scope="row" class="text-center">2</th>
                    <td>TESTING TITLE 2</td>
                    <td>TESTING DESCRIPTION 2</td>
                    <td>9999-12-31 11:59</td>
                    <td>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#opportunityModal" onclick="modalSetUp('2')">MODAL TEST</button>
                    </td>
                 </tr>`;

        opportunityList.innerHTML = data;

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

        updateNavbar()
        appendFooter()
        backToTopButtonSetUp()
    }

    function DisplayEventPage() {
        console.log("Calling DisplayEventPage...");
        let currentNavItem = document.getElementById("event");
        currentNavItem.className = currentNavItem.className.concat(" active");
        currentNavItem.ariaCurrent = "page";

        updateNavbar()
        appendFooter()
        backToTopButtonSetUp()
    }

    function DisplayContactPage() {
        console.log("Calling DisplayContactPage...");
        let currentNavItem = document.getElementById("contact");
        currentNavItem.className = currentNavItem.className.concat(" active");
        currentNavItem.ariaCurrent = "page";

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

        updateNavbar()
        appendFooter()
        backToTopButtonSetUp()
    }

    function DisplayAboutPage() {
        console.log("Calling DisplayAboutPage...");
        let currentNavItem = document.getElementById("about");
        currentNavItem.className = currentNavItem.className.concat(" active");
        currentNavItem.ariaCurrent = "page";

        updateNavbar()
        appendFooter()
        backToTopButtonSetUp()
    }

    function DisplayPrivacyPolicyPage() {
        console.log("Calling DisplayPrivacyPolicyPage...");
        let currentNavItem = document.getElementById("privacyPolicy");
        currentNavItem.className = currentNavItem.className.concat(" active");
        currentNavItem.ariaCurrent = "page";

        updateNavbar()
        appendFooter()
        backToTopButtonSetUp()
    }

    function DisplayServiceTermsPage() {
        console.log("Calling DisplayServiceTermsPage...");
        let currentNavItem = document.getElementById("serviceTerms");
        currentNavItem.className = currentNavItem.className.concat(" active");
        currentNavItem.ariaCurrent = "page";

        updateNavbar()
        appendFooter()
        backToTopButtonSetUp()
    }

    function Start() {
        console.log("Starting App...");

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
        }
    }

    window.addEventListener("load", Start);
})()