/* =========================================================
   RAIN FOREST — SCRIPT.JS
   PART 1
   SETUP + NAVIGATION + YEAR
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       GSAP SETUP
       ===================================================== */

    if (typeof gsap !== "undefined") {

        if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }

    }


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    const currentYear =
        document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const navButton =
        document.getElementById("navMenuButton");

    const navLinks =
        document.querySelector(".nav-links");


    if (navButton && navLinks) {

        navButton.addEventListener("click", () => {

            const isOpen =
                navButton.classList.toggle("is-open");

            navLinks.classList.toggle(
                "is-open",
                isOpen
            );

            navButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });


        /* Close navigation after selecting a link */

        navLinks
            .querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener("click", () => {

                    navButton.classList.remove(
                        "is-open"
                    );

                    navLinks.classList.remove(
                        "is-open"
                    );

                    navButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                });

            });

    }


    /* =====================================================
       SMOOTH ANCHOR SCROLL
       ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener("click", (event) => {

                const targetId =
                    link.getAttribute("href");

                if (!targetId || targetId === "#") {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


    /* =====================================================
       GSAP AVAILABLE?
       ===================================================== */

    if (typeof gsap === "undefined") {
        console.warn(
            "Rain Forest: GSAP was not loaded."
        );

        return;
    }


    /* =====================================================
       HERO INTRO
       ===================================================== */

    const heroTimeline =
        gsap.timeline({
            defaults: {
                ease: "power3.out"
            }
        });


    heroTimeline
        .to(".hero-eyebrow", {
            opacity: 1,
            y: 0,
            duration: 0.7
        })
        .to(".hero-title-line", {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.05,
            stagger: 0.13
        }, "-=0.35")
        .to(".hero-description", {
            opacity: 1,
            y: 0,
            duration: 0.8
        }, "-=0.45")
        .to(".hero-actions", {
            opacity: 1,
            y: 0,
            duration: 0.7
        }, "-=0.45")
        .to(".hero-water-orb", {
            opacity: 1,
            duration: 1.2,
            ease: "power2.out"
        }, "-=1")
        .to(".hero-droplet", {
            opacity: 1,
            duration: 0.7,
            stagger: 0.12
        }, "-=0.8");


    /* =====================================================
       PAGE READY
       ===================================================== */

    document.body.classList.add(
        "rainforest-ready"
    );

});
/* =========================================================
   RAIN FOREST — SCRIPT.JS
   PART 2
   SCROLL REVEALS + JOURNEY FLOW
   ========================================================= */


/* =========================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================= */

if (
    typeof gsap !== "undefined" &&
    typeof ScrollTrigger !== "undefined"
) {

    const revealElements =
        document.querySelectorAll(".reveal");


    revealElements.forEach((element) => {

        gsap.fromTo(
            element,

            {
                opacity: 0,
                y: 45
            },

            {
                opacity: 1,
                y: 0,

                duration: 1,

                ease: "power3.out",

                scrollTrigger: {
                    trigger: element,

                    start: "top 84%",

                    end: "top 55%",

                    toggleActions:
                        "play none none reverse"
                }
            }
        );

    });


    /* =====================================================
       SECTION HEADINGS
       ===================================================== */

    document
        .querySelectorAll(
            ".section-heading h2, .journey-intro h2"
        )
        .forEach((heading) => {

            gsap.fromTo(
                heading,

                {
                    opacity: 0,
                    y: 35
                },

                {
                    opacity: 1,
                    y: 0,

                    duration: 1,

                    ease: "power3.out",

                    scrollTrigger: {
                        trigger: heading,

                        start: "top 82%",

                        toggleActions:
                            "play none none reverse"
                    }
                }
            );

        });


    /* =====================================================
       JOURNEY PROGRESS LINE
       ===================================================== */

    const journeyProgress =
        document.querySelector(
            ".journey-progress"
        );

    const journeyTrack =
        document.querySelector(
            ".journey-track"
        );


    if (journeyProgress && journeyTrack) {

        gsap.to(
            journeyProgress,
            {
                height: "100%",

                ease: "none",

                scrollTrigger: {
                    trigger: journeyTrack,

                    start: "top 65%",

                    end: "bottom 55%",

                    scrub: 1
                }
            }
        );

    }


    /* =====================================================
       JOURNEY ITEMS
       ===================================================== */

    document
        .querySelectorAll(".journey-item")
        .forEach((item) => {

            gsap.fromTo(
                item,

                {
                    opacity: 0,
                    x: -30
                },

                {
                    opacity: 1,
                    x: 0,

                    duration: 0.8,

                    ease: "power3.out",

                    scrollTrigger: {
                        trigger: item,

                        start: "top 82%",

                        toggleActions:
                            "play none none reverse"
                    }
                }
            );

        });


    /* =====================================================
       ABOUT CARD FLOAT
       ===================================================== */

    const aboutCard =
        document.querySelector(
            ".about-card"
        );


    if (aboutCard) {

        gsap.to(
            aboutCard,
            {
                y: -12,

                rotation: -1,

                duration: 3.5,

                ease: "sine.inOut",

                repeat: -1,

                yoyo: true
            }
        );

    }


    /* =====================================================
       CONTACT WATER MOVEMENT
       ===================================================== */

    const contactWater =
        document.querySelector(
            ".contact-water"
        );


    if (contactWater) {

        gsap.to(
            contactWater,
            {
                x: -35,
                y: 25,

                scrollTrigger: {
                    trigger: ".contact",

                    start: "top bottom",

                    end: "bottom top",

                    scrub: 1.5
                }
            }
        );

    }


    /* =====================================================
       PROJECT CARD PARALLAX
       ===================================================== */

    document
        .querySelectorAll(".project-card")
        .forEach((card) => {

            const water =
                card.querySelector(
                    ".project-water"
                );

            if (!water) {
                return;
            }


            gsap.to(
                water,
                {
                    y: -35,

                    ease: "none",

                    scrollTrigger: {
                        trigger: card,

                        start: "top bottom",

                        end: "bottom top",

                        scrub: 1.2
                    }
                }
            );

        });

               }
/* =========================================================
   RAIN FOREST — SCRIPT.JS
   PART 3
   WATER CURSOR + LIQUID INTERACTIONS
   ========================================================= */


/* =========================================================
   WATER CURSOR
   ========================================================= */

const waterCursor =
    document.getElementById("waterCursor");

const canUsePointer =
    window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;


if (waterCursor && canUsePointer) {

    document.body.classList.add(
        "cursor-active"
    );


    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;

    let targetX = cursorX;
    let targetY = cursorY;


    /* Track pointer */

    window.addEventListener(
        "pointermove",
        (event) => {

            targetX = event.clientX;
            targetY = event.clientY;

        },
        {
            passive: true
        }
    );


    /* Smooth cursor movement */

    function animateCursor() {

        cursorX +=
            (targetX - cursorX) * 0.16;

        cursorY +=
            (targetY - cursorY) * 0.16;


        waterCursor.style.transform =
            `translate3d(
                ${cursorX}px,
                ${cursorY}px,
                0
            ) translate(-50%, -50%)`;


        requestAnimationFrame(
            animateCursor
        );

    }

    animateCursor();


    /* Hover detection */

    const interactiveElements =
        document.querySelectorAll(
            "a, button, input, textarea, .project-card"
        );


    interactiveElements.forEach((element) => {

        element.addEventListener(
            "pointerenter",
            () => {

                document.body.classList.add(
                    "cursor-hover"
                );

            }
        );


        element.addEventListener(
            "pointerleave",
            () => {

                document.body.classList.remove(
                    "cursor-hover"
                );

            }
        );

    });

}


/* =========================================================
   LIQUID BUTTON POINTER POSITION
   ========================================================= */

document
    .querySelectorAll(".liquid-button")
    .forEach((button) => {

        button.addEventListener(
            "pointermove",
            (event) => {

                const rect =
                    button.getBoundingClientRect();


                const x =
                    ((event.clientX - rect.left)
                    / rect.width) * 100;


                const y =
                    ((event.clientY - rect.top)
                    / rect.height) * 100;


                button.style.setProperty(
                    "--liquid-x",
                    `${x}%`
                );

                button.style.setProperty(
                    "--liquid-y",
                    `${y}%`
                );

            },
            {
                passive: true
            }
        );


        /* Small water response on touch */

        button.addEventListener(
            "pointerdown",
            () => {

                button.classList.add(
                    "liquid-pressed"
                );

            }
        );


        button.addEventListener(
            "pointerup",
            () => {

                button.classList.remove(
                    "liquid-pressed"
                );

            }
        );


        button.addEventListener(
            "pointercancel",
            () => {

                button.classList.remove(
                    "liquid-pressed"
                );

            }
        );

    });


/* =========================================================
   PROJECT CARD POINTER EFFECT
   ========================================================= */

document
    .querySelectorAll(".project-card")
    .forEach((card) => {

        card.addEventListener(
            "pointermove",
            (event) => {

                if (
                    event.pointerType === "touch"
                ) {
                    return;
                }


                const rect =
                    card.getBoundingClientRect();


                const x =
                    (event.clientX - rect.left)
                    / rect.width;


                const y =
                    (event.clientY - rect.top)
                    / rect.height;


                const rotateX =
                    (0.5 - y) * 3;


                const rotateY =
                    (x - 0.5) * 3;


                card.style.transform =
                    `translateY(-6px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)`;

            },
            {
                passive: true
            }
        );


        card.addEventListener(
            "pointerleave",
            () => {

                card.style.transform = "";

            }
        );

    });


/* =========================================================
   DROPLET CLICK / TOUCH RESPONSE
   ========================================================= */

document
    .querySelectorAll(".hero-droplet")
    .forEach((droplet) => {

        droplet.addEventListener(
            "pointerdown",
            () => {

                if (
                    typeof gsap === "undefined"
                ) {
                    return;
                }


                gsap.fromTo(
                    droplet,

                    {
                        scale: 1
                    },

                    {
                        scale: 1.35,

                        duration: 0.18,

                        yoyo: true,

                        repeat: 1,

                        ease: "power2.out"
                    }
                );

            }
        );

    });
/* =========================================================
   RAIN FOREST — SCRIPT.JS
   PART 4
   FORM + MOBILE NAV + FINAL POLISH
   ========================================================= */


/* =========================================================
   CONTACT FORM
   ========================================================= */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const name =
                document.getElementById("name");

            const email =
                document.getElementById("email");

            const message =
                document.getElementById("message");


            if (
                !name ||
                !email ||
                !message
            ) {
                return;
            }


            if (
                !name.value.trim() ||
                !email.value.trim() ||
                !message.value.trim()
            ) {
                return;
            }


            const submitButton =
                contactForm.querySelector(
                    ".submit-button"
                );


            if (submitButton) {

                const originalHTML =
                    submitButton.innerHTML;


                submitButton.innerHTML =
                    "<span>Message Ready</span>";


                submitButton.disabled = true;


                setTimeout(() => {

                    submitButton.innerHTML =
                        originalHTML;

                    submitButton.disabled =
                        false;

                    contactForm.reset();

                }, 2200);

            }

        }
    );

}


/* =========================================================
   MOBILE NAV ANIMATION
   ========================================================= */

const mobileNavButton =
    document.getElementById(
        "navMenuButton"
    );

const mobileNav =
    document.querySelector(
        ".nav-links"
    );


if (
    mobileNavButton &&
    mobileNav
) {

    const mobileQuery =
        window.matchMedia(
            "(max-width: 900px)"
        );


    function updateMobileNav() {

        if (!mobileQuery.matches) {

            mobileNav.style.removeProperty(
                "display"
            );

            mobileNav.style.removeProperty(
                "opacity"
            );

            mobileNav.style.removeProperty(
                "transform"
            );

            return;

        }


        if (
            !mobileNav.classList.contains(
                "is-open"
            )
        ) {

            mobileNav.style.display =
                "none";

            return;

        }


        mobileNav.style.display =
            "flex";

        mobileNav.style.opacity =
            "1";

        mobileNav.style.transform =
            "translateY(0)";

    }


    mobileQuery.addEventListener(
        "change",
        updateMobileNav
    );


    mobileNavButton.addEventListener(
        "click",
        () => {

            if (!mobileQuery.matches) {
                return;
            }


            const isOpen =
                mobileNav.classList.contains(
                    "is-open"
                );


            if (isOpen) {

                mobileNav.style.display =
                    "flex";

                mobileNav.style.opacity =
                    "1";

                mobileNav.style.transform =
                    "translateY(0)";

            } else {

                mobileNav.style.display =
                    "none";

            }

        }
    );


    updateMobileNav();

}


/* =========================================================
   NAVBAR SCROLL RESPONSE
   ========================================================= */

const header =
    document.querySelector(
        ".site-header"
    );


if (header) {

    let lastScroll = 0;


    window.addEventListener(
        "scroll",
        () => {

            const currentScroll =
                window.scrollY;


            if (currentScroll > 30) {

                header.classList.add(
                    "header-scrolled"
                );

            } else {

                header.classList.remove(
                    "header-scrolled"
                );

            }


            lastScroll =
                currentScroll;

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   RIPPLE EFFECT FOR TOUCH
   ========================================================= */

document
    .querySelectorAll(
        ".liquid-button, .project-card"
    )
    .forEach((element) => {

        element.addEventListener(
            "pointerdown",
            (event) => {

                if (
                    event.pointerType !== "touch"
                ) {
                    return;
                }


                const ripple =
                    document.createElement(
                        "span"
                    );


                ripple.className =
                    "touch-ripple";


                const rect =
                    element.getBoundingClientRect();


                ripple.style.left =
                    `${event.clientX - rect.left}px`;


                ripple.style.top =
                    `${event.clientY - rect.top}px`;


                element.appendChild(
                    ripple
                );


                setTimeout(() => {

                    ripple.remove();

                }, 700);

            }
        );

    });


/* =========================================================
   CLEANUP ON PAGE EXIT
   ========================================================= */

window.addEventListener(
    "pagehide",
    () => {

        document.body.classList.remove(
            "cursor-hover"
        );

        document.body.classList.remove(
            "cursor-active"
        );

    }
);


/* =========================================================
   FINAL CONSOLE MESSAGE
   ========================================================= */

console.log(
    "Rain Forest — experience initialized."
);
