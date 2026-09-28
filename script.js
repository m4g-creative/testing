/* =========================================================
   VOID — SCRIPT.JS
   PART 3
   INTERACTION + WEBGL FOUNDATION
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

const overlayLinks = document.querySelectorAll(".overlay-nav a");
const hoverElements = document.querySelectorAll("[data-cursor]");


/* =========================================================
   STATE
   ========================================================= */

const state = {

    mouse: {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0
    },

    scroll: {
        current: 0,
        target: 0,
        velocity: 0,
        last: 0
    },

    cursor: {
        x: 0,
        y: 0
    },

    loaded: false,

    menuOpen: false

};


/* =========================================================
   DEVICE
   ========================================================= */

const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;


/* =========================================================
   LOADER
   ========================================================= */

let loadingValue = 0;

function runLoader() {

    const interval = setInterval(() => {

        loadingValue += Math.random() * 8 + 3;

        if (loadingValue >= 100) {
            loadingValue = 100;
        }

        loaderProgress.style.width =
            `${loadingValue}%`;

        loaderPercent.textContent =
            `${Math.floor(loadingValue)}%`;


        if (loadingValue >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                finishLoading();

            }, 450);

        }

    }, 90);

}


function finishLoading() {

    state.loaded = true;

    site.classList.add("is-visible");

    loader.classList.add("hidden");

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


    if (!heroTitle) return;


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

if (!isTouchDevice) {

    window.addEventListener(
        "mousemove",
        handleMouseMove,
        { passive: true }
    );


    function handleMouseMove(event) {

        state.cursor.x = event.clientX;
        state.cursor.y = event.clientY;

        state.mouse.targetX =
            (event.clientX / window.innerWidth - 0.5);

        state.mouse.targetY =
            (event.clientY / window.innerHeight - 0.5);

    }


    function updateCursor() {

        state.cursor.x +=
            (state.mouse.clientX -
                state.cursor.x) * 0.15;


        cursor.style.transform =
            `translate3d(
                ${state.cursor.x}px,
                ${state.cursor.y}px,
                0
            )`;

        requestAnimationFrame(updateCursor);

    }


    /*
       Keep cursor position directly responsive.
    */

    window.addEventListener(
        "mousemove",
        event => {

            cursor.style.transform =
                `translate3d(
                    ${event.clientX}px,
                    ${event.clientY}px,
                    0
                )`;

        },
        { passive: true }
    );


    hoverElements.forEach(element => {

        element.addEventListener(
            "mouseenter",
            () => {

                const type =
                    element.dataset.cursor;

                cursor.classList.remove(
                    "hover",
                    "view"
                );

                if (type === "hover") {
                    cursor.classList.add("hover");
                }

                if (type === "view") {
                    cursor.classList.add("view");
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

const gl =
    canvas.getContext("webgl", {
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });


if (gl) {

    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );


    gl.clearColor(
        0,
        0,
        0,
        0
    );


    function resizeCanvas() {

        const pixelRatio =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        canvas.width =
            window.innerWidth * pixelRatio;

        canvas.height =
            window.innerHeight * pixelRatio;

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


    function renderCanvas() {

        gl.clear(
            gl.COLOR_BUFFER_BIT
        );

        requestAnimationFrame(
            renderCanvas
        );

    }


    renderCanvas();

}


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
    { passive: true }
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

    if (!hero) return;


    const progress =
        Math.min(
            state.scroll.current /
            window.innerHeight,
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


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
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

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(
    element =>
        revealObserver.observe(element)
);


/* =========================================================
   MENU
   ========================================================= */

function openMenu() {

    state.menuOpen = true;

    menuOverlay.classList.add("open");

    body.classList.add("loading");

}


function closeMenu() {

    state.menuOpen = false;

    menuOverlay.classList.remove("open");

    body.classList.remove("loading");

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


overlayLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            closeMenu();

        }
    );

});


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
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (state.menuOpen) {
            closeMenu();
        }

    }
);


/* =========================================================
   MOBILE TOUCH PARALLAX
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
   PAGE VISIBILITY
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "hidden"
        ) {
            return;
        }

    }
);
