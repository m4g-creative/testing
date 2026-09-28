/* =========================================================
   VOID — IMMERSIVE EXPERIENCE
   SCRIPT.JS
   ========================================================= */


/* =========================================================
   DOM
   ========================================================= */

const body = document.body;

const loader = document.getElementById("loader");
const loaderProgress = document.getElementById("loaderProgress");
const loaderPercent = document.getElementById("loaderPercent");

const site = document.getElementById("site");
const canvas = document.getElementById("webglCanvas");

const cursor = document.getElementById("cursor");

const menuButton = document.getElementById("menuButton");
const menuClose = document.getElementById("menuClose");
const menuOverlay = document.getElementById("menuOverlay");

const overlayLinks =
    document.querySelectorAll(".overlay-nav a");

const workItems =
    document.querySelectorAll(".work-item");


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
        y: 0,
        targetX: 0,
        targetY: 0
    },

    scroll: 0,
    targetScroll: 0
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

let loaderValue = 0;
let loaderTimer = null;
let loaderFinished = false;

function updateLoader(value) {

    const safeValue =
        Math.min(100, Math.max(0, value));

    if (loaderProgress) {
        loaderProgress.style.width =
            safeValue + "%";
    }

    if (loaderPercent) {
        loaderPercent.textContent =
            Math.round(safeValue);
    }
}


function finishLoader() {

    if (loaderFinished) {
        return;
    }

    loaderFinished = true;

    if (loaderTimer) {
        clearInterval(loaderTimer);
        loaderTimer = null;
    }

    updateLoader(100);

    setTimeout(() => {

        if (loader) {
            loader.classList.add("hidden");
        }

        if (site) {
            site.classList.add("is-visible");
        }

        body.classList.remove("loading");

        state.loaded = true;

        startIntro();

    }, 350);
}


function startLoader() {

    /*
       Loader is completely independent
       from WebGL and other effects.
    */

    updateLoader(0);

    loaderTimer = setInterval(() => {

        const remaining =
            100 - loaderValue;

        const increment =
            Math.min(
                remaining,
                Math.floor(Math.random() * 10) + 5
            );

        loaderValue += increment;

        updateLoader(loaderValue);

        if (loaderValue >= 100) {
            finishLoader();
        }

    }, 90);
}


/* =========================================================
   START LOADER AFTER DOM
   ========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        startLoader,
        { once: true }
    );

} else {

    startLoader();

}


/* =========================================================
   INTRO
   ========================================================= */

function startIntro() {

    document.body.classList.add("intro-complete");

    requestAnimationFrame(() => {

        document.querySelectorAll(
            ".hero-top, .hero-bottom"
        ).forEach((element, index) => {

            element.animate(
                [
                    {
                        opacity: 0,
                        transform: "translateY(20px)"
                    },
                    {
                        opacity: 1,
                        transform: "translateY(0)"
                    }
                ],
                {
                    duration: 900,
                    delay: 250 + index * 100,
                    easing: "cubic-bezier(.22,1,.36,1)",
                    fill: "forwards"
                }
            );

        });

    });
}


/* =========================================================
   CURSOR
   ========================================================= */

if (!isTouchDevice && cursor) {

    window.addEventListener(
        "pointermove",
        (event) => {

            state.cursor.targetX =
                event.clientX;

            state.cursor.targetY =
                event.clientY;

            state.mouse.targetX =
                (event.clientX / window.innerWidth) * 2 - 1;

            state.mouse.targetY =
                -(event.clientY / window.innerHeight) * 2 + 1;

        },
        { passive: true }
    );


    function animateCursor() {

        state.cursor.x +=
            (state.cursor.targetX - state.cursor.x) *
            0.18;

        state.cursor.y +=
            (state.cursor.targetY - state.cursor.y) *
            0.18;

        cursor.style.transform =
            `translate3d(${state.cursor.x}px, ${state.cursor.y}px, 0)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();


    workItems.forEach((item) => {

        item.addEventListener("mouseenter", () => {
            cursor.classList.add("view");
        });

        item.addEventListener("mouseleave", () => {
            cursor.classList.remove("view");
        });

    });

}


/* =========================================================
   WEBGL
   ========================================================= */

let gl = null;
let webglSupported = false;

function setupWebGL() {

    if (!canvas) {
        return;
    }

    try {

        gl =
            canvas.getContext("webgl", {
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
            }) ||
            canvas.getContext("experimental-webgl");

        if (!gl) {
            return;
        }

        webglSupported = true;

        resizeCanvas();

    } catch (error) {

        /*
           WebGL failure must never stop
           the rest of the website.
        */

        webglSupported = false;

    }

}


function resizeCanvas() {

    if (!canvas || !gl) {
        return;
    }

    const pixelRatio =
        Math.min(window.devicePixelRatio || 1, 2);

    canvas.width =
        Math.floor(
            window.innerWidth * pixelRatio
        );

    canvas.height =
        Math.floor(
            window.innerHeight * pixelRatio
        );

    canvas.style.width =
        window.innerWidth + "px";

    canvas.style.height =
        window.innerHeight + "px";

    gl.viewport(
        0,
        0,
        canvas.width,
        canvas.height
    );
}


setupWebGL();


/* =========================================================
   SIMPLE WEBGL BACKGROUND
   ========================================================= */

function renderWebGL() {

    if (!webglSupported || !gl) {
        return;
    }

    const time =
        performance.now() * 0.00015;

    const mouseX =
        state.mouse.x * 0.02;

    const mouseY =
        state.mouse.y * 0.02;

    const red =
        0.012 +
        Math.sin(time) * 0.004 +
        mouseX;

    const green =
        0.012 +
        Math.cos(time * 1.3) * 0.004 +
        mouseY;

    const blue =
        0.018 +
        Math.sin(time * 0.7) * 0.005;

    gl.clearColor(
        Math.max(0, red),
        Math.max(0, green),
        Math.max(0, blue),
        1
    );

    gl.clear(
        gl.COLOR_BUFFER_BIT
    );

}


/* =========================================================
   MOUSE PARALLAX
   ========================================================= */

function updateMouse() {

    state.mouse.x +=
        (state.mouse.targetX - state.mouse.x) *
        0.035;

    state.mouse.y +=
        (state.mouse.targetY - state.mouse.y) *
        0.035;

}


/* =========================================================
   SCROLL
   ========================================================= */

window.addEventListener(
    "scroll",
    () => {

        state.targetScroll =
            window.scrollY || window.pageYOffset;

    },
    { passive: true }
);


function updateScroll() {

    state.scroll +=
        (state.targetScroll - state.scroll) *
        0.08;

    const hero =
        document.getElementById("hero");

    if (hero && state.loaded) {

        const offset =
            Math.min(state.scroll * 0.16, 180);

        hero.style.transform =
            `translate3d(0, ${offset}px, 0)`;

    }

}


/* =========================================================
   INTERSECTION OBSERVER
   ========================================================= */

const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -8% 0px"
        }
    );


workItems.forEach((item) => {

    revealObserver.observe(item);

});


/* =========================================================
   MENU
   ========================================================= */

function openMenu() {

    if (!menuOverlay) {
        return;
    }

    state.menuOpen = true;

    menuOverlay.classList.add("open");

    menuOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    if (menuButton) {

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

    }

    body.style.overflow = "hidden";

}


function closeMenu() {

    if (!menuOverlay) {
        return;
    }

    state.menuOpen = false;

    menuOverlay.classList.remove("open");

    menuOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    if (menuButton) {

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }

    if (!body.classList.contains("loading")) {
        body.style.overflow = "";
    }

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


overlayLinks.forEach((link) => {

    link.addEventListener(
        "click",
        closeMenu
    );

});


/* =========================================================
   ESCAPE
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            state.menuOpen
        ) {

            closeMenu();

        }

    }
);


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        resizeCanvas();

    },
    { passive: true }
);


/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {
            return;
        }

        resizeCanvas();

    }
);


/* =========================================================
   MAIN ANIMATION LOOP
   ========================================================= */

function animationLoop() {

    updateMouse();

    updateScroll();

    renderWebGL();

    requestAnimationFrame(
        animationLoop
    );

}


animationLoop();


/* =========================================================
   TOUCH SUPPORT
   ========================================================= */

if (isTouchDevice) {

    document.documentElement.classList.add(
        "touch-device"
    );

}


/* =========================================================
   SAFETY FALLBACK
   ========================================================= */

/*
   If something unexpected prevents the normal loader
   from completing, never leave the user stuck at 0%.
*/

setTimeout(() => {

    if (!loaderFinished) {
        finishLoader();
    }

}, 5000);
