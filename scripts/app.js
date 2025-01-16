"use strict";

// IIFE - Immediately Invoked Functional Expression
// AKA - Anonymous Self-Executing Function
(function(){

    function DisplayHomePage() {
        console.log("Calling DisplayHomePage...");

        let aboutUsButton = document.getElementById("AboutUsBtn");
        aboutUsButton.addEventListener("click", function(){
            location.href = "about.html";
        });

        let MainContent = document.getElementsByTagName("main")[0];
        let MainParagraph = document.createElement("p");

        // <p id="MainParagraph" class="mt-3">This is my first main paragraph!</p>
        MainParagraph.setAttribute("id", "MainParagraph");
        MainParagraph.setAttribute("class", "mt-3");
        MainParagraph.textContent = "This is my first main paragraph!";

        // Displays MainParagraph to screen
        MainContent.appendChild(MainParagraph);

        let FirstString = "This is";
        // String literal
        let SecondString = `${FirstString} my second string!`;
        MainParagraph.textContent = SecondString;
        MainContent.appendChild(MainParagraph);

        let DocumentBody = document.body;

        // <article class="container"><p id="ArticleParagraph" class="mt-3"></p></article>
        let Article = document.createElement("article");
        let ArticleParagraph = `<p id="ArticleParagraph" class="mt-3">This is my first article paragraph</p>`;
        Article.setAttribute("class", "container");
        Article.innerHTML = ArticleParagraph;
        DocumentBody.appendChild(Article);

    }

    function DisplayProductsPage() {
        console.log("Calling DisplayProductsPage...");
    }

    function DisplayServicesPage() {
        console.log("Calling DisplayServicesPage...");
    }

    function DisplayAboutPage() {
        console.log("Calling DisplayAboutPage...");
    }

    function DisplayContactsPage() {
        console.log("Calling DisplayContactsPage...");
    }

    // This function prints "App Started!" when called
    function Start()
    {
        console.log("App Started!");

        switch(document.title) {
            case "Home":
                DisplayHomePage();
                break;
            case "Products":
                DisplayProductsPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Contacts":
                DisplayContactsPage();
                break;
        }
    }
    // Listens for the "load" event, calls the Start function when it does
    window.addEventListener("load", Start);

})();