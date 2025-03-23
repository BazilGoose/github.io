"use strict";

export class Gallery {
    // Gotten from https://www.w3schools.com/howto/howto_js_lightbox.asp and edited to suit its purpose

// Initially sets the gallery slide index for the modal
    private GallerySlideIndex = 1;

    /**
     * Opens the gallery modal
     */
    openGalleryModal() {
        const modal = (document.getElementById("galleryModal")) as HTMLElement;
        if (modal) {
            modal.style.display = "block";
        }
    }

    /**
     * Closes the gallery modal
     */
    closeGalleryModal() {
        const modal = (document.getElementById("galleryModal")) as HTMLElement;
        if (modal) {
            modal.style.display = "none";
        }
    }

    /**
     * Moves between the slides of the gallery modal
     * @param n
     */
    plusGallerySlides(n: number) {
        this.showGallerySlide(this.GallerySlideIndex += n);
    }

    /**
     * Sets the gallery modal's slide
     * @param n The slide number that the gallery modal will be set to
     */
    currentGallerySlide(n: number) {
        this.showGallerySlide(this.GallerySlideIndex = n);
    }

    /**
     * Shows the current gallery modal's slide information
     * @param n The gallery modal's slide number
     */
    showGallerySlide(n: number) {
        let i;
        let slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
        let dots = document.getElementsByClassName("demo") as HTMLCollectionOf<HTMLElement>;
        let captionText = document.getElementById("caption");

        if (slides.length === 0 || dots.length === 0 || !captionText) return;

        if (n > slides.length) {
            this.GallerySlideIndex = 1
        }
        if (n < 1) {
            this.GallerySlideIndex = slides.length
        }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[this.GallerySlideIndex - 1].style.display = "block";
        dots[this.GallerySlideIndex - 1].className += " active";
        captionText.innerHTML = dots[this.GallerySlideIndex - 1].getAttribute("alt") || ""; // if alt doesnt exist set to empty string

    }
}
