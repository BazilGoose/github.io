"use strict";
export class NotificationToast {
    toastId = "notificationToast";
    async load() {
        return fetch("views/components/notificationToast.html")
            .then(response => response.text())
            .then(html => {
            const Element = document.getElementById("toastbox");
            if (Element) {
                Element.innerHTML = html;
            }
            else {
                console.warn("[WARN] element not found in DOM");
            }
        })
            .catch(error => console.log(`[ERROR] Failed to load: ${error}`));
    }
    show(html, timeout) {
        const toastElement = document.getElementById(this.toastId);
        if (toastElement) {
            const body = toastElement.querySelector(`.toast-body`);
            if (body) {
                body.innerHTML = html;
            }
            else {
                console.warn("[WARN] Toast body element not found");
            }
            // @ts-ignore
            const toast = new bootstrap.Toast(toastElement, {
                autohide: true,
                delay: timeout
            });
            toast.show();
        }
        else {
            console.warn("[WARNING] Cannot show toast");
        }
    }
}
//# sourceMappingURL=notification.js.map