/* =========================================================
   VOID — PHASE 2
   CINEMATIC SCROLL JOURNEY
   SCRIPT.JS — PART 1/4
   ========================================================= */


/* =========================================================
   DOM
   ========================================================= */

const body = document.body;

const site =
    document.getElementById("site");

const canvas =
    document.getElementById("webglCanvas");

const cursor =
    document.getElementById("cursor");

const menuButton =
    document.getElementById("menuButton");

const menuClose =
    document.getElementById("menuClose");

const menuOverlay =
    document.getElementById("menuOverlay");

const workItems =
    document.querySelectorAll(".work-item");

const overlayLinks =
    document.querySelectorAll(".overlay-nav a");


/* =========================================================
   STATE
   ========================================================= */

const state = {

    mouseX: 0,
    mouseY: 0,

    targetMouseX: 0,
    targetMouseY: 0,

    scrollY: 0,
    targetScrollY: 0,

    menuOpen: false,

    isTouch:
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0

};


/* =========================================================
   THREE
   ========================================================= */

let scene = null;
let camera = null;
let renderer = null;

let heroObject = null;
let innerObject = null;
let particles = null;
let particleMaterial = null;

let clock = null;


/* =========================================================
   WORLD
   ========================================================= */

const world = {

    cameraX: 0,
    cameraY: 0,
    cameraZ: 7,

    targetCameraX: 0,
    targetCameraY: 0,
    targetCameraZ: 7,

    heroX: 1.7,
    heroY: 0.15,
    heroZ: 0,

    targetHeroX: 1.7,
    targetHeroY: 0.15,
    targetHeroZ: 0,

    heroScale: 1,
    targetHeroScale: 1,

    rotationX: 0,
    rotationY: 0,

    targetRotationX: 0,
    targetRotationY: 0

};


/* =========================================================
   UTILITIES
   ========================================================= */

function clamp(
    value,
    min,
    max
) {

    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );

}


function lerp(
    current,
    target,
    amount
) {

    return (
        current +
        (target - current) *
        amount
    );

}


function ease(
    value
) {

    value =
        clamp(
            value,
            0,
            1
        );


    return (
        value *
        value *
        (3 - 2 * value)
    );

}


/* =========================================================
   MOUSE
   ========================================================= */

function setupMouse() {

    if (state.isTouch) {
        return;
    }


    window.addEventListener(
        "mousemove",
        function (event) {

            state.targetMouseX =
                (
                    event.clientX /
                    window.innerWidth
                ) * 2 - 1;


            state.targetMouseY =
                -(
                    (
                        event.clientY /
                        window.innerHeight
                    ) * 2 - 1
                );

        }
    );

}


/* =========================================================
   TOUCH
   ========================================================= */

function setupTouch() {

    if (!state.isTouch) {
        return;
    }


    window.addEventListener(
        "touchmove",
        function (event) {

            if (
                !event.touches ||
                !event.touches.length
            ) {
                return;
            }


            const touch =
                event.touches[0];


            state.targetMouseX =
                (
                    touch.clientX /
                    window.innerWidth
                ) * 2 - 1;


            state.targetMouseY =
                -(
                    (
                        touch.clientY /
                        window.innerHeight
                    ) * 2 - 1
                );

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   THREE INITIALIZATION
   ========================================================= */

function initThree() {

    if (!canvas) {
        return;
    }


    if (
        typeof THREE ===
        "undefined"
    ) {

        console.warn(
            "Three.js not loaded."
        );

        return;

    }


    scene =
        new THREE.Scene();


    camera =
        new THREE.PerspectiveCamera(
            42,
            window.innerWidth /
            window.innerHeight,
            0.1,
            100
        );


    camera.position.set(
        0,
        0,
        7
    );


    renderer =
        new THREE.WebGLRenderer({

            canvas: canvas,

            antialias: true,

            alpha: true,

            powerPreference:
                "high-performance"

        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.outputEncoding =
        THREE.sRGBEncoding;


    clock =
        new THREE.Clock();


    createLights();

    createHero();

    createParticles();

    resizeThree();

}


/* =========================================================
   LIGHTS
   ========================================================= */

function createLights() {

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            0.5
        );


    scene.add(
        ambient
    );


    const white =
        new THREE.PointLight(
            0xffffff,
            4,
            30
        );


    white.position.set(
        3,
        4,
        5
    );


    scene.add(
        white
    );


    const purple =
        new THREE.PointLight(
            0x8b5cf6,
            7,
            25
        );


    purple.position.set(
        -4,
        1,
        2
    );


    scene.add(
        purple
    );


    const cyan =
        new THREE.PointLight(
            0x22d3ee,
            5,
            25
        );


    cyan.position.set(
        4,
        -3,
        1
    );


    scene.add(
        cyan
    );

}


/* =========================================================
   HERO
   ========================================================= */

function createHero() {

    heroObject =
        new THREE.Group();


    const geometry =
        new THREE.IcosahedronGeometry(
            1.55,
            2
        );


    const material =
        new THREE.MeshPhysicalMaterial({

            color: 0x101018,

            roughness: 0.22,

            metalness: 0.72,

            transparent: true,

            opacity: 0.94,

            clearcoat: 1,

            clearcoatRoughness: 0.18

        });


    const main =
        new THREE.Mesh(
            geometry,
            material
        );


    heroObject.add(
        main
    );


    const innerGeometry =
        new THREE.IcosahedronGeometry(
            1.72,
            1
        );


    const innerMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x8b5cf6,

            wireframe: true,

            transparent: true,

            opacity: 0.24

        });


    innerObject =
        new THREE.Mesh(
            innerGeometry,
            innerMaterial
        );


    heroObject.add(
        innerObject
    );


    const outer =
        new THREE.Mesh(

            new THREE.IcosahedronGeometry(
                1.9,
                1
            ),

            new THREE.MeshBasicMaterial({

                color: 0x22d3ee,

                wireframe: true,

                transparent: true,

                opacity: 0.09

            })

        );


    outer.rotation.x =
        0.4;


    outer.rotation.y =
        0.7;


    heroObject.add(
        outer
    );


    heroObject.add(
        createOrbit(
            2.15,
            0.012,
            0x8b5cf6,
            0.3,
            0.3
        )
    );


    heroObject.add(
        createOrbit(
            2.45,
            0.008,
            0x22d3ee,
            -0.48,
            -0.2
        )
    );


    heroObject.add(
        createOrbit(
            2.75,
            0.005,
            0xffffff,
            0.7,
            0.4
        )
    );


    heroObject.position.set(
        1.7,
        0.15,
        0
    );


    scene.add(
        heroObject
    );

}
/* =========================================================
   VOID — PHASE 2
   SCRIPT.JS — PART 2/4
   CINEMATIC SCROLL JOURNEY
   ========================================================= */


/* =========================================================
   ORBIT RING
   ========================================================= */

function createOrbit(
    radius,
    thickness,
    color,
    rotationX,
    rotationY
) {

    const geometry =
        new THREE.TorusGeometry(
            radius,
            thickness,
            8,
            120
        );


    const material =
        new THREE.MeshBasicMaterial({

            color: color,

            transparent: true,

            opacity: 0.5

        });


    const ring =
        new THREE.Mesh(
            geometry,
            material
        );


    ring.rotation.x =
        rotationX;


    ring.rotation.y =
        rotationY;


    ring.userData.speed =
        0.0005 +
        Math.random() * 0.001;


    return ring;

}


/* =========================================================
   PARTICLES
   ========================================================= */

function createParticles() {

    const count =
        state.isTouch
            ? 650
            : 1400;


    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const radius =
            3 +
            Math.random() * 8;


        const theta =
            Math.random() *
            Math.PI * 2;


        const phi =
            Math.acos(
                2 *
                Math.random() -
                1
            );


        positions[i * 3] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);


        positions[i * 3 + 1] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);


        positions[i * 3 + 2] =
            radius *
            Math.cos(phi);

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    particleMaterial =
        new THREE.PointsMaterial({

            color: 0xffffff,

            size:
                state.isTouch
                    ? 0.035
                    : 0.025,

            transparent: true,

            opacity: 0.65,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending

        });


    particles =
        new THREE.Points(
            geometry,
            particleMaterial
        );


    scene.add(
        particles
    );

}


/* =========================================================
   RESIZE
   ========================================================= */

function resizeThree() {

    if (
        !camera ||
        !renderer
    ) {

        return;

    }


    const width =
        window.innerWidth;


    const height =
        window.innerHeight;


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        width,
        height
    );

}


window.addEventListener(
    "resize",
    resizeThree
);


/* =========================================================
   SCROLL TARGET
   ========================================================= */

function getScrollProgress() {

    const maxScroll =
        document.documentElement
            .scrollHeight -
        window.innerHeight;


    if (
        maxScroll <= 0
    ) {

        return 0;

    }


    return clamp(
        window.scrollY /
        maxScroll,
        0,
        1
    );

}


/* =========================================================
   SCROLL SETUP
   ========================================================= */

function setupScroll() {

    state.scrollY =
        window.scrollY;


    window.addEventListener(
        "scroll",
        function () {

            state.targetScrollY =
                window.scrollY;

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   SMOOTH INPUT
   ========================================================= */

function updateInput() {

    state.mouseX =
        lerp(
            state.mouseX,
            state.targetMouseX,
            0.08
        );


    state.mouseY =
        lerp(
            state.mouseY,
            state.targetMouseY,
            0.08
        );


    state.scrollY =
        lerp(
            state.scrollY,
            state.targetScrollY,
            0.08
        );

}


/* =========================================================
   CINEMATIC TIMELINE
   ========================================================= */

function updateJourney() {

    if (
        !camera ||
        !heroObject
    ) {

        return;

    }


    const progress =
        clamp(
            state.scrollY /
            Math.max(
                1,
                document.documentElement
                    .scrollHeight -
                window.innerHeight
            ),
            0,
            1
        );


    /* -----------------------------------------------------
       HERO PHASE
       ----------------------------------------------------- */

    const hero =
        ease(
            progress / 0.22
        );


    /* -----------------------------------------------------
       WORK PHASE
       ----------------------------------------------------- */

    const work =
        ease(
            (
                progress -
                0.12
            ) / 0.28
        );


    /* -----------------------------------------------------
       ABOUT PHASE
       ----------------------------------------------------- */

    const about =
        ease(
            (
                progress -
                0.38
            ) / 0.28
        );


    /* -----------------------------------------------------
       CONTACT PHASE
       ----------------------------------------------------- */

    const contact =
        ease(
            (
                progress -
                0.70
            ) / 0.30
        );


    /* -----------------------------------------------------
       CAMERA
       ----------------------------------------------------- */

    let cameraX =
        state.mouseX * 0.18;


    let cameraY =
        state.mouseY * 0.12;


    let cameraZ = 7;


    cameraX =
        lerp(
            cameraX,
            -0.8,
            work
        );


    cameraY =
        lerp(
            cameraY,
            0.3,
            work
        );


    cameraZ =
        lerp(
            cameraZ,
            5.2,
            work
        );


    cameraX =
        lerp(
            cameraX,
            0.35,
            about
        );


    cameraY =
        lerp(
            cameraY,
            -0.25,
            about
        );


    cameraZ =
        lerp(
            cameraZ,
            4.5,
            about
        );


    cameraX =
        lerp(
            cameraX,
            0.5,
            contact
        );


    cameraY =
        lerp(
            cameraY,
            0.1,
            contact
        );


    cameraZ =
        lerp(
            cameraZ,
            6,
            contact
        );


    world.targetCameraX =
        cameraX;


    world.targetCameraY =
        cameraY;


    world.targetCameraZ =
        cameraZ;


    world.cameraX =
        lerp(
            world.cameraX,
            world.targetCameraX,
            0.06
        );


    world.cameraY =
        lerp(
            world.cameraY,
            world.targetCameraY,
            0.06
        );


    world.cameraZ =
        lerp(
            world.cameraZ,
            world.targetCameraZ,
            0.06
        );


    camera.position.set(
        world.cameraX,
        world.cameraY,
        world.cameraZ
    );


    /* -----------------------------------------------------
       CAMERA LOOK TARGET
       ----------------------------------------------------- */

    camera.lookAt(
        state.mouseX * 0.15,
        state.mouseY * 0.1,
        -progress * 1.5
    );


    /* -----------------------------------------------------
       HERO POSITION
       ----------------------------------------------------- */

    world.targetHeroX =
        1.7 -
        work * 1.8;


    world.targetHeroY =
        0.15 +
        work * 0.45;


    world.targetHeroZ =
        -work * 2.8;


    world.targetHeroScale =
        1 -
        work * 0.42;


    world.targetRotationX =
        state.mouseY * 0.18 +
        progress * 1.2;


    world.targetRotationY =
        state.mouseX * 0.22 +
        progress * 2.4;


    world.heroX =
        lerp(
            world.heroX,
            world.targetHeroX,
            0.065
        );


    world.heroY =
        lerp(
            world.heroY,
            world.targetHeroY,
            0.065
        );


    world.heroZ =
        lerp(
            world.heroZ,
            world.targetHeroZ,
            0.065
        );


    world.heroScale =
        lerp(
            world.heroScale,
            world.targetHeroScale,
            0.065
        );


    world.rotationX =
        lerp(
            world.rotationX,
            world.targetRotationX,
            0.065
        );


    world.rotationY =
        lerp(
            world.rotationY,
            world.targetRotationY,
            0.065
        );


    heroObject.position.x =
        world.heroX;


    heroObject.position.y =
        world.heroY;


    heroObject.position.z =
        world.heroZ;


    heroObject.scale.setScalar(
        world.heroScale
    );


    heroObject.rotation.x =
        world.rotationX;


    heroObject.rotation.y =
        world.rotationY;


    /* -----------------------------------------------------
       PARTICLE JOURNEY
       ----------------------------------------------------- */

    if (particles) {

        particles.position.z =
            -progress * 3;


        particles.position.x =
            state.mouseX * 0.35 -
            progress * 0.8;


        particles.position.y =
            state.mouseY * 0.2 +
            progress * 0.25;


        particles.rotation.y =
            progress * 0.8;


        particles.rotation.x =
            progress * 0.15;


        if (particleMaterial) {

            particleMaterial.opacity =
                0.65 -
                progress * 0.2;

        }

    }


    /* -----------------------------------------------------
       WORLD ROTATION
       ----------------------------------------------------- */

    scene.rotation.y =
        progress * 0.06;


    scene.rotation.x =
        state.mouseY * 0.015;


    /* -----------------------------------------------------
       CSS SCROLL VARIABLE
       ----------------------------------------------------- */

    if (site) {

        site.style.setProperty(
            "--scroll-progress",
            progress
        );

    }

       }
/* =========================================================
   VOID — PHASE 2
   SCRIPT.JS — PART 3/4
   OBJECT ANIMATION + UI INTERACTION
   ========================================================= */


/* =========================================================
   HERO INTERNAL ANIMATION
   ========================================================= */

function updateHeroAnimation(
    elapsed
) {

    if (!heroObject) {
        return;
    }


    /* -----------------------------------------------------
       MAIN OBJECT
       ----------------------------------------------------- */

    heroObject.rotation.z =
        Math.sin(
            elapsed * 0.35
        ) * 0.08;


    /* -----------------------------------------------------
       INNER WIREFRAME
       ----------------------------------------------------- */

    if (innerObject) {

        innerObject.rotation.y -=
            0.0035;


        innerObject.rotation.z +=
            0.0015;


        innerObject.rotation.x +=
            Math.sin(
                elapsed * 0.5
            ) * 0.0004;

    }


    /* -----------------------------------------------------
       CHILD OBJECTS
       ----------------------------------------------------- */

    heroObject.children.forEach(
        function (
            child,
            index
        ) {

            if (
                child.userData &&
                child.userData.speed
            ) {

                child.rotation.z +=
                    child.userData.speed;

            }


            if (
                index === 2
            ) {

                child.rotation.y +=
                    0.0018;


                child.rotation.x +=
                    0.0007;

            }

        }
    );


    /* -----------------------------------------------------
       FLOATING MOVEMENT
       ----------------------------------------------------- */

    const floating =
        Math.sin(
            elapsed * 0.75
        ) * 0.045;


    heroObject.position.y +=
        floating;

}


/* =========================================================
   CURSOR
   ========================================================= */

function setupCursor() {

    if (
        !cursor ||
        state.isTouch
    ) {

        return;

    }


    const dot =
        cursor.querySelector(
            ".cursor-dot"
        );


    const ring =
        cursor.querySelector(
            ".cursor-ring"
        );


    if (
        !dot ||
        !ring
    ) {

        return;

    }


    let cursorX =
        window.innerWidth / 2;


    let cursorY =
        window.innerHeight / 2;


    let ringX =
        cursorX;


    let ringY =
        cursorY;


    window.addEventListener(
        "mousemove",
        function (event) {

            cursorX =
                event.clientX;


            cursorY =
                event.clientY;

        }
    );


    function animateCursor() {

        ringX =
            lerp(
                ringX,
                cursorX,
                0.14
            );


        ringY =
            lerp(
                ringY,
                cursorY,
                0.14
            );


        dot.style.transform =
            `translate3d(
                ${cursorX}px,
                ${cursorY}px,
                0
            ) translate(-50%, -50%)`;


        ring.style.transform =
            `translate3d(
                ${ringX}px,
                ${ringY}px,
                0
            ) translate(-50%, -50%)`;


        requestAnimationFrame(
            animateCursor
        );

    }


    animateCursor();


    const interactive =
        document.querySelectorAll(
            "a, button, .work-item"
        );


    interactive.forEach(
        function (element) {

            element.addEventListener(
                "mouseenter",
                function () {

                    cursor.classList.add(
                        "is-active"
                    );


                    if (
                        element.dataset.cursor ===
                        "view"
                    ) {

                        cursor.classList.add(
                            "is-view"
                        );

                    }

                }
            );


            element.addEventListener(
                "mouseleave",
                function () {

                    cursor.classList.remove(
                        "is-active"
                    );


                    cursor.classList.remove(
                        "is-view"
                    );

                }
            );

        }
    );

}


/* =========================================================
   WORK REVEAL
   ========================================================= */

function setupWorkObserver() {

    if (
        !workItems ||
        !workItems.length
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );


    workItems.forEach(
        function (item) {

            observer.observe(
                item
            );

        }
    );

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function openMenu() {

    if (!menuOverlay) {
        return;
    }


    state.menuOpen =
        true;


    menuOverlay.classList.add(
        "is-open"
    );


    body.classList.add(
        "menu-open"
    );

}


function closeMenu() {

    if (!menuOverlay) {
        return;
    }


    state.menuOpen =
        false;


    menuOverlay.classList.remove(
        "is-open"
    );


    body.classList.remove(
        "menu-open"
    );

}


/* =========================================================
   MENU SETUP
   ========================================================= */

function setupMenu() {

    if (menuButton) {

        menuButton.addEventListener(
            "click",
            function () {

                if (
                    state.menuOpen
                ) {

                    closeMenu();

                } else {

                    openMenu();

                }

            }
        );

    }


    if (menuClose) {

        menuClose.addEventListener(
            "click",
            closeMenu
        );

    }


    overlayLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                closeMenu
            );

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeMenu();

            }

        }
    );

}


/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

function setupVisibility() {

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.hidden
            ) {

                return;

            }


            resizeThree();

        }
    );

}


/* =========================================================
   PAGE EVENTS
   ========================================================= */

function setupPageEvents() {

    window.addEventListener(
        "pageshow",
        function () {

            resizeThree();

        }
    );


    window.addEventListener(
        "orientationchange",
        function () {

            setTimeout(
                function () {

                    resizeThree();

                },
                150
            );

        }
    );

}
/* =========================================================
   VOID — PHASE 2
   SCRIPT.JS — PART 4/4
   ANIMATION LOOP + INITIALIZATION
   ========================================================= */


/* =========================================================
   ANIMATION LOOP
   ========================================================= */

function animateThree() {

    requestAnimationFrame(
        animateThree
    );


    if (
        !renderer ||
        !scene ||
        !camera ||
        !clock
    ) {

        return;

    }


    const elapsed =
        clock.getElapsedTime();


    /* -----------------------------------------------------
       INPUT
       ----------------------------------------------------- */

    updateInput();


    /* -----------------------------------------------------
       CINEMATIC JOURNEY
       ----------------------------------------------------- */

    updateJourney();


    /* -----------------------------------------------------
       HERO ANIMATION
       ----------------------------------------------------- */

    updateHeroAnimation(
        elapsed
    );


    /* -----------------------------------------------------
       RENDER
       ----------------------------------------------------- */

    renderer.render(
        scene,
        camera
    );

}


/* =========================================================
   REDUCED MOTION
   ========================================================= */

function setupReducedMotion() {

    if (
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        return;

    }


    if (particleMaterial) {

        particleMaterial.opacity =
            0.3;

    }

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function init() {

    /* -----------------------------------------------------
       INPUT
       ----------------------------------------------------- */

    setupMouse();

    setupTouch();

    setupScroll();


    /* -----------------------------------------------------
       UI
       ----------------------------------------------------- */

    setupCursor();

    setupWorkObserver();

    setupMenu();


    /* -----------------------------------------------------
       PAGE
       ----------------------------------------------------- */

    setupVisibility();

    setupPageEvents();


    /* -----------------------------------------------------
       THREE.JS
       ----------------------------------------------------- */

    initThree();


    /* -----------------------------------------------------
       MOTION
       ----------------------------------------------------- */

    setupReducedMotion();


    /* -----------------------------------------------------
       START
       ----------------------------------------------------- */

    if (
        renderer &&
        scene &&
        camera
    ) {

        animateThree();

    }

}


/* =========================================================
   START AFTER DOM
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init,
        {
            once: true
        }
    );

} else {

    init();

}
