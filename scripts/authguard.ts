"use strict";

let sessionTimeout:NodeJS.Timeout;

function resetSessionTimeout():void {

    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        console.warn("[WARNING] Session expired due to inactivity.");
        sessionStorage.removeItem("user");
        window.dispatchEvent(new CustomEvent("sessionExpired"));
    }, (15 * 60 * 1000)); // Session timeout of 15 minutes (15 minutes * 60 seconds per minute * 1000 milliseconds per second)

}

// Reset the session based on user activity (mouse movement, key presses)
document.addEventListener("mousemove", resetSessionTimeout);
document.addEventListener("keypress", resetSessionTimeout);

export function AuthGuard():void {

    const user = sessionStorage.getItem("user");
    const protectedRoutes = ['/event-plan', '/event-edit', "/statistic"];

    if (!user && protectedRoutes.includes(location.hash.slice(1))) {
        console.warn("[AUTHGUARD] Unauthorized access detected! Redirecting to login.");
        window.dispatchEvent(new CustomEvent("sessionExpired"));
    } else {
        resetSessionTimeout();
    }
}