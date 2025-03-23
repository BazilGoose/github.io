"use strict";
export async function LoadBackToTop() {
    return fetch("views/components/back-to-top-button.html")
        .then(response => response.text())
        .then(html => {
        const backToTopElement = document.getElementById("backToTop");
        if (backToTopElement) {
            backToTopElement.innerHTML = html;
        }
        else {
            console.warn("[WARNING] No <div> with 'backToTop' id found in DOM'");
        }
        backToTopButtonSetUp();
    })
        .catch(error => { console.log(`[ERROR] Failed to load backToTopButton: ${error}`); });
}
/**
 * Sets up the "back to top button"
 */
function backToTopButtonSetUp() {
    // Gotten from: https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
    let backToTopButton = document.getElementById("backToTopButton");
    window.onscroll = function () { scrollFunction(); };
    // Hides backToTopButton if at top of page
    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.style.display = "block";
        }
        else {
            backToTopButton.style.display = "none";
        }
    }
}
//# sourceMappingURL=backToTop.js.map