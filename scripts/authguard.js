"use strict";

(function() {
    if (!sessionStorage.getItem("user")) {
        console.warn("[AUTHGUARD] Unauthorized access detected! Redirecting to login.");
        location.href = "login.html";
    }
})();