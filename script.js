/* =========================================================
   VOID — SCRIPT.JS
   PART 3 — UPDATED / FIXED
   ========================================================= */


/* =========================================================
   DOM
========================================================= */

const body = document.body;

const site = document.getElementById("site");

const loader = document.getElementById("loader");
const loaderProgress = document.getElementById("loaderProgress");
const loaderPercent = document.getElementById("loaderPercent");

const canvas = document.getElementById("webglCanvas");

const cursor = document.getElementById("cursor");

const menuButton = document.getElementById("menuButton");
const menuClose = document.getElementById("menuClose");
const menuOverlay = document.getElementById("menuOverlay");

const overlayLinks =
    document.querySelectorAll(".overlay-nav a");

const cursorElements =
    document.querySelectorAll("[data-cursor]");


/* =========================================================
   STATE
========================================================= */

const state = {

    loaded: false,

    menuOpen: false,

    mouse: {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0
    },

    cursor: {
        x: 0,
        y: 0
    },

    scroll: {
        current: 0,
        target: 0,
        velocity: 0,
        last: 0
    }

};


/* =========================================================
   DEVICE
========================================================= */

const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window;


/* =========================================================
   LOADER
========================================================= */

let loadingValue = 0;
let loaderFinished = false;

function runLoader() {

    if (!loader) {
        finishLoading();
        return;
    }

    const loaderTimer = setInterval(() => {

        loadingValue +=
            Math.floor(Math.random() * 12) + 5;


        if (loadingValue >= 100) {

            loadingValue = 100;

            clearInterval(loaderTimer);

        }


        if (loaderProgress) {

            loaderProgress.style.width =
                `${loadingValue}%`;

        }


        if (loaderPercent) {

            loaderPercent.textContent =
                `${loadingValue}%`;

        }


        if (
            loadingValue >= 100 &&
            !loaderFinished
        ) {

            loaderFinished = true;

            setTimeout(
                finishLoading,
                500
            );

        }

    }, 120);

}


function finishLoading() {

    state.loaded = true;

    if (site) {
        site.classList.add("is-visible");
    }

    if (loader) {
        loader.classList.add("hidden");
    }

    body.classList.remove("loading");

    startIntro();

}


runLoader();


/* =========================================================
   INTRO
========================================================= */

function startIntro() {

    const heroTitle =
        document.querySelector(".hero-title");

    const heroDescription =
        document.querySelector(".hero-description");

    const heroTop =
        document.querySelector(".hero-top");

    const heroBottom =
        document.querySelector(".hero-bottom");


    if (heroTitle) {

        heroTitle.animate(
            [
                {
                    opacity: 0,
                    transform:
                        "translateY(60px)"
                },

                {
                    opacity: 1,
                    transform:
                        "translateY(0)"
                }
            ],
            {
                duration: 1400,
                easing:
                    "cubic-bezier(.16,1,.3,1)",
                fill: "forwards"
            }
        );

    }


    if (heroDescription) {

        heroDescription.animate(
            [
                {
                    opacity: 0,
                    transform:
                        "translateY(30px)"
                },

                {
                    opacity: 1,
                    transform:
                        "translateY(0)"
                }
            ],
            {
                duration: 1000,
                delay: 350,
                easing:
                    "cubic-bezier(.16,1,.3,1)",
                fill: "forwards"
            }
        );

    }


    if (heroTop) {

        heroTop.animate(
            [
                {
                    opacity: 0
                },

                {
                    opacity: 1
                }
            ],
            {
                duration: 800,
                delay: 500,
                fill: "forwards"
            }
        );

    }


    if (heroBottom) {

        heroBottom.animate(
            [
                {
                    opacity: 0
                },

                {
                    opacity: 1
                }
            ],
            {
                duration: 800,
                delay: 700,
                fill: "forwards"
            }
        );

    }

}


/* =========================================================
   CUSTOM CURSOR
========================================================= */

if (!isTouchDevice && cursor) {

    window.addEventListener(
        "mousemove",
        event => {

            state.cursor.x = event.clientX;
            state.cursor.y = event.clientY;

            state.mouse.targetX =
                (event.clientX /
                    window.innerWidth) - 0.5;

            state.mouse.targetY =
                (event.clientY /
                    window.innerHeight) - 0.5;


            cursor.style.transform =
                `translate3d(
                    ${event.clientX}px,
                    ${event.clientY}px,
                    0
                )`;

        },
        {
            passive: true
        }
    );


    cursorElements.forEach(element => {

        element.addEventListener(
            "mouseenter",
            () => {

                const cursorType =
                    element.dataset.cursor;


                cursor.classList.remove(
                    "hover",
                    "view"
                );


                if (cursorType === "hover") {

                    cursor.classList.add(
                        "hover"
                    );

                }


                if (cursorType === "view") {

                    cursor.classList.add(
                        "view"
                    );

                }

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                cursor.classList.remove(
                    "hover",
                    "view"
                );

            }
        );

    });

}


/* =========================================================
   WEBGL CANVAS FOUNDATION
========================================================= */

let gl = null;


if (canvas) {

    gl = canvas.getContext(
        "webgl",
        {
            antialias: true,
            alpha: true,
            powerPreference:
                "high-performance"
        }
    );


    if (gl) {

        resizeCanvas();

        gl.clearColor(
            0,
            0,
            0,
            0
        );

    }

}


function resizeCanvas() {

    if (!canvas || !gl) {
        return;
    }


    const pixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.width =
        Math.floor(
            window.innerWidth *
            pixelRatio
        );


    canvas.height =
        Math.floor(
            window.innerHeight *
            pixelRatio
        );


    canvas.style.width =
        `${window.innerWidth}px`;


    canvas.style.height =
        `${window.innerHeight}px`;


    gl.viewport(
        0,
        0,
        canvas.width,
        canvas.height
    );

}


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================================
   WEBGL RENDER LOOP
========================================================= */

function renderCanvas() {

    if (gl) {

        gl.clear(
            gl.COLOR_BUFFER_BIT
        );

    }


    requestAnimationFrame(
        renderCanvas
    );

}


renderCanvas();


/* =========================================================
   MOUSE PARALLAX
========================================================= */

function updateMouse() {

    state.mouse.x +=
        (
            state.mouse.targetX -
            state.mouse.x
        ) * 0.055;


    state.mouse.y +=
        (
            state.mouse.targetY -
            state.mouse.y
        ) * 0.055;

}


/* =========================================================
   SCROLL TRACKING
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        state.scroll.target =
            window.scrollY;

    },
    {
        passive: true
    }
);


function updateScroll() {

    state.scroll.current +=
        (
            state.scroll.target -
            state.scroll.current
        ) * 0.08;


    state.scroll.velocity =
        state.scroll.current -
        state.scroll.last;


    state.scroll.last =
        state.scroll.current;

}


/* =========================================================
   HERO PARALLAX
========================================================= */

function updateHeroParallax() {

    const hero =
        document.querySelector(".hero");


    if (!hero) {
        return;
    }


    const heroHeight =
        window.innerHeight;


    if (heroHeight <= 0) {
        return;
    }


    const progress =
        Math.min(
            state.scroll.current /
            heroHeight,
            1
        );


    hero.style.transform =
        `translate3d(
            0,
            ${progress * -45}px,
            0
        )`;

}


/* =========================================================
   SECTION REVEALS
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".work-item, .about-content, .contact-content"
    );


let revealObserver = null;


if ("IntersectionObserver" in window) {

    revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        entry.target.animate(
                            [
                                {
                                    opacity: 0,
                                    transform:
                                        "translateY(70px)"
                                },

                                {
                                    opacity: 1,
                                    transform:
                                        "translateY(0)"
                                }
                            ],
                            {
                                duration: 1100,
                                easing:
                                    "cubic-bezier(.16,1,.3,1)",
                                fill: "forwards"
                            }
                        );


                        revealObserver.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        element => {

            revealObserver.observe(
                element
            );

        }
    );

} else {

    revealElements.forEach(
        element => {

            element.style.opacity = "1";

        }
    );

}


/* =========================================================
   MENU
========================================================= */

function openMenu() {

    if (!menuOverlay) {
        return;
    }


    state.menuOpen = true;

    menuOverlay.classList.add(
        "open"
    );

}


function closeMenu() {

    if (!menuOverlay) {
        return;
    }


    state.menuOpen = false;

    menuOverlay.classList.remove(
        "open"
    );

}


if (menuButton) {

    menuButton.addEventListener(
        "click",
        openMenu
    );

}


if (menuClose) {

    menuClose.addEventListener(
        "click",
        closeMenu
    );

}


overlayLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                closeMenu();

            }
        );

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            state.menuOpen
        ) {

            closeMenu();

        }

    }
);


/* =========================================================
   MOBILE DEVICE ORIENTATION
========================================================= */

if (isTouchDevice) {

    window.addEventListener(
        "deviceorientation",
        event => {

            if (
                event.gamma === null ||
                event.beta === null
            ) {
                return;
            }


            state.mouse.targetX =
                Math.max(
                    -1,
                    Math.min(
                        1,
                        event.gamma / 35
                    )
                );


            state.mouse.targetY =
                Math.max(
                    -1,
                    Math.min(
                        1,
                        (event.beta - 45) / 35
                    )
                );

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   MAIN ANIMATION LOOP
========================================================= */

function animationLoop() {

    updateMouse();

    updateScroll();

    updateHeroParallax();

    requestAnimationFrame(
        animationLoop
    );

}


animationLoop();


/* =========================================================
   RESIZE MENU SAFETY
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            state.menuOpen &&
            window.innerWidth > 800
        ) {

            closeMenu();

        }

    }
);


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            state.scroll.target =
                window.scrollY;

        }

    }
);
