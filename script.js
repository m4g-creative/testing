/* =========================================================
   VOID — PHASE 2
   CINEMATIC SCROLL JOURNEY
   SCRIPT.JS — PART 1/3
   ========================================================= */


/* =========================================================
   DOM REFERENCES
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
   APPLICATION STATE
   ========================================================= */

const state = {

    mouseX: 0,
    mouseY: 0,

    targetMouseX: 0,
    targetMouseY: 0,

    scrollY: 0,
    targetScrollY: 0,

    scrollProgress: 0,
    targetScrollProgress: 0,

    menuOpen: false,

    isTouch:
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0

};


/* =========================================================
   THREE.JS VARIABLES
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
   WORLD SETTINGS
   ========================================================= */

const world = {

    /* Camera */

    cameraX: 0,
    cameraY: 0,
    cameraZ: 7,

    targetCameraX: 0,
    targetCameraY: 0,
    targetCameraZ: 7,


    /* Hero */

    heroX: 1.7,
    heroY: 0.15,
    heroZ: 0,

    targetHeroX: 1.7,
    targetHeroY: 0.15,
    targetHeroZ: 0,


    heroScale: 1,
    targetHeroScale: 1,


    heroRotationX: 0,
    heroRotationY: 0,

    targetHeroRotationX: 0,
    targetHeroRotationY: 0

};


/* =========================================================
   UTILITY
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
        (
            target -
            current
        ) *
        amount
    );

}


function easeInOutCubic(
    value
) {

    value =
        clamp(
            value,
            0,
            1
        );


    if (value < 0.5) {

        return (
            4 *
            value *
            value *
            value
        );

    }


    return (
        1 -
        Math.pow(
            -2 * value + 2,
            3
        ) /
        2
    );

}


/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

function calculateScrollProgress() {

    const documentHeight =
        document.documentElement
            .scrollHeight;

    const viewportHeight =
        window.innerHeight;


    const maximumScroll =
        documentHeight -
        viewportHeight;


    if (
        maximumScroll <= 0
    ) {

        return 0;

    }


    return clamp(
        window.scrollY /
        maximumScroll,
        0,
        1
    );

}


/* =========================================================
   SCROLL EVENT
   ========================================================= */

function setupScroll() {

    state.scrollY =
        window.scrollY;


    state.targetScrollY =
        window.scrollY;


    state.scrollProgress =
        calculateScrollProgress();


    state.targetScrollProgress =
        state.scrollProgress;


    window.addEventListener(
        "scroll",
        function () {

            state.targetScrollY =
                window.scrollY;


            state.targetScrollProgress =
                calculateScrollProgress();

        },
        {
            passive: true
        }
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
                ) *
                2 -
                1;


            state.targetMouseY =
                -(
                    (
                        event.clientY /
                        window.innerHeight
                    ) *
                    2 -
                    1
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
                ) *
                2 -
                1;


            state.targetMouseY =
                -(
                    (
                        touch.clientY /
                        window.innerHeight
                    ) *
                    2 -
                    1
                );

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   THREE.JS INITIALIZATION
   ========================================================= */

function initThree() {

    if (!canvas) {

        console.warn(
            "webglCanvas was not found."
        );

        return;

    }


    if (
        typeof THREE ===
        "undefined"
    ) {

        console.warn(
            "Three.js was not loaded."
        );

        return;

    }


    /* -----------------------------------------------------
       SCENE
       ----------------------------------------------------- */

    scene =
        new THREE.Scene();


    /* -----------------------------------------------------
       CAMERA
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       RENDERER
       ----------------------------------------------------- */

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


    if (
        "outputColorSpace" in renderer &&
        THREE.SRGBColorSpace
    ) {

        renderer.outputColorSpace =
            THREE.SRGBColorSpace;

    } else {

        renderer.outputEncoding =
            THREE.sRGBEncoding;

    }


    /* -----------------------------------------------------
       CLOCK
       ----------------------------------------------------- */

    clock =
        new THREE.Clock();


    /* -----------------------------------------------------
       WORLD
       ----------------------------------------------------- */

    createLights();

    createHeroObject();

    createParticles();


    /* -----------------------------------------------------
       RESIZE
       ----------------------------------------------------- */

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


    const whiteLight =
        new THREE.PointLight(
            0xffffff,
            4,
            30
        );


    whiteLight.position.set(
        3,
        4,
        5
    );


    scene.add(
        whiteLight
    );


    const purpleLight =
        new THREE.PointLight(
            0x8b5cf6,
            7,
            25
        );


    purpleLight.position.set(
        -4,
        1,
        2
    );


    scene.add(
        purpleLight
    );


    const cyanLight =
        new THREE.PointLight(
            0x22d3ee,
            5,
            25
        );


    cyanLight.position.set(
        4,
        -3,
        1
    );


    scene.add(
        cyanLight
    );

}


/* =========================================================
   HERO 3D OBJECT
   ========================================================= */

function createHeroObject() {

    heroObject =
        new THREE.Group();


    /* -----------------------------------------------------
       MAIN GEOMETRY
       ----------------------------------------------------- */

    const mainGeometry =
        new THREE.IcosahedronGeometry(
            1.55,
            2
        );


    const mainMaterial =
        new THREE.MeshPhysicalMaterial({

            color: 0x101018,

            roughness: 0.22,

            metalness: 0.72,

            transparent: true,

            opacity: 0.94,

            clearcoat: 1,

            clearcoatRoughness: 0.18

        });


    const mainMesh =
        new THREE.Mesh(
            mainGeometry,
            mainMaterial
        );


    heroObject.add(
        mainMesh
    );


    /* -----------------------------------------------------
       INNER WIREFRAME
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       OUTER WIREFRAME
       ----------------------------------------------------- */

    const outerGeometry =
        new THREE.IcosahedronGeometry(
            1.9,
            1
        );


    const outerMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x22d3ee,

            wireframe: true,

            transparent: true,

            opacity: 0.09

        });


    const outerObject =
        new THREE.Mesh(
            outerGeometry,
            outerMaterial
        );


    outerObject.rotation.x =
        0.4;


    outerObject.rotation.y =
        0.7;


    heroObject.add(
        outerObject
    );


    /* -----------------------------------------------------
       ORBIT RINGS
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       START POSITION
       ----------------------------------------------------- */

    heroObject.position.set(
        1.7,
        0.15,
        0
    );


    heroObject.scale.setScalar(
        1
    );


    scene.add(
        heroObject
    );

}


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


    ring.userData.rotationSpeed =
        0.0005 +
        Math.random() *
        0.001;


    return ring;

}


/* =========================================================
   PARTICLES
   ========================================================= */

function createParticles() {

    const particleCount =
        state.isTouch
            ? 700
            : 1500;


    const positions =
        new Float32Array(
            particleCount * 3
        );


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const radius =
            3 +
            Math.random() * 7;


        const theta =
            Math.random() *
            Math.PI *
            2;


        const phi =
            Math.acos(
                2 *
                Math.random() -
                1
            );


        positions[
            i * 3
        ] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);


        positions[
            i * 3 + 1
        ] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);


        positions[
            i * 3 + 2
        ] =
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

            size: 0.025,

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
   PHASE 2 — PART 2/3
   CINEMATIC WORLD + SCROLL JOURNEY
   ========================================================= */


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
            0.085
        );


    state.scrollProgress =
        lerp(
            state.scrollProgress,
            state.targetScrollProgress,
            0.075
        );

}


/* =========================================================
   CINEMATIC CAMERA
   ========================================================= */

function updateCameraJourney() {

    if (!camera) {
        return;
    }


    const progress =
        state.scrollProgress;


    /* -----------------------------------------------------
       HERO
       ----------------------------------------------------- */

    const heroProgress =
        easeInOutCubic(
            clamp(
                progress / 0.32,
                0,
                1
            )
        );


    /* -----------------------------------------------------
       HERO → WORK
       ----------------------------------------------------- */

    const workProgress =
        easeInOutCubic(
            clamp(
                (
                    progress -
                    0.12
                ) /
                0.34,
                0,
                1
            )
        );


    /* -----------------------------------------------------
       WORK → ABOUT
       ----------------------------------------------------- */

    const aboutProgress =
        easeInOutCubic(
            clamp(
                (
                    progress -
                    0.38
                ) /
                0.30,
                0,
                1
            )
        );


    /* -----------------------------------------------------
       ABOUT → CONTACT
       ----------------------------------------------------- */

    const contactProgress =
        easeInOutCubic(
            clamp(
                (
                    progress -
                    0.68
                ) /
                0.32,
                0,
                1
            )
        );


    /* -----------------------------------------------------
       CAMERA TARGET
       ----------------------------------------------------- */

    let cameraX = 0;
    let cameraY = 0;
    let cameraZ = 7;


    /*
       Hero begins with subtle mouse-driven
       camera movement.
    */

    cameraX +=
        state.mouseX *
        0.22;


    cameraY +=
        state.mouseY *
        0.16;


    /*
       Work transition moves the camera
       slightly forward and left.
    */

    cameraZ =
        lerp(
            cameraZ,
            5.4,
            workProgress
        );


    cameraX =
        lerp(
            cameraX,
            -0.65,
            workProgress
        );


    cameraY =
        lerp(
            cameraY,
            0.25,
            workProgress
        );


    /*
       About pushes the camera deeper.
    */

    cameraZ =
        lerp(
            cameraZ,
            4.7,
            aboutProgress
        );


    cameraX =
        lerp(
            cameraX,
            0.25,
            aboutProgress
        );


    cameraY =
        lerp(
            cameraY,
            -0.25,
            aboutProgress
        );


    /*
       Contact slightly pulls the camera
       back for the final composition.
    */

    cameraZ =
        lerp(
            cameraZ,
            5.8,
            contactProgress
        );


    cameraX =
        lerp(
            cameraX,
            0.45,
            contactProgress
        );


    cameraY =
        lerp(
            cameraY,
            0.1,
            contactProgress
        );


    /* -----------------------------------------------------
       SMOOTH CAMERA
       ----------------------------------------------------- */

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
            0.055
        );


    world.cameraY =
        lerp(
            world.cameraY,
            world.targetCameraY,
            0.055
        );


    world.cameraZ =
        lerp(
            world.cameraZ,
            world.targetCameraZ,
            0.055
        );


    camera.position.x =
        world.cameraX;


    camera.position.y =
        world.cameraY;


    camera.position.z =
        world.cameraZ;


    /*
       Camera continuously looks toward
       the center of the world.
    */

    camera.lookAt(
        state.mouseX * 0.18,
        state.mouseY * 0.12,
        0
    );

}


/* =========================================================
   HERO JOURNEY
   ========================================================= */

function updateHeroJourney(
    elapsed
) {

    if (!heroObject) {
        return;
    }


    const progress =
        state.scrollProgress;


    /* -----------------------------------------------------
       HERO EXIT
       ----------------------------------------------------- */

    const exitProgress =
        easeInOutCubic(
            clamp(
                progress / 0.42,
                0,
                1
            )
        );


    /*
       Starting position:
       x = 1.7
       y = 0.15
       z = 0

       During scroll:
       object moves deeper and left.
    */

    world.targetHeroX =
        1.7 -
        exitProgress *
        1.55;


    world.targetHeroY =
        0.15 +
        exitProgress *
        0.45;


    world.targetHeroZ =
        -exitProgress *
        2.2;


    /* -----------------------------------------------------
       SCALE
       ----------------------------------------------------- */

    const scaleUp =
        clamp(
            progress / 0.12,
            0,
            1
        );


    const scaleDown =
        clamp(
            (
                progress -
                0.12
            ) /
            0.40,
            0,
            1
        );


    world.targetHeroScale =
        1 +
        scaleUp * 0.12 -
        scaleDown * 0.42;


    /* -----------------------------------------------------
       ROTATION
       ----------------------------------------------------- */

    world.targetHeroRotationX =
        state.mouseY *
        0.15 +
        progress *
        0.9;


    world.targetHeroRotationY =
        state.mouseX *
        0.18 +
        progress *
        1.8;


    /* -----------------------------------------------------
       SMOOTH TRANSFORM
       ----------------------------------------------------- */

    world.heroX =
        lerp(
            world.heroX,
            world.targetHeroX,
            0.055
        );


    world.heroY =
        lerp(
            world.heroY,
            world.targetHeroY,
            0.055
        );


    world.heroZ =
        lerp(
            world.heroZ,
            world.targetHeroZ,
            0.055
        );


    world.heroScale =
        lerp(
            world.heroScale,
            world.targetHeroScale,
            0.055
        );


    world.heroRotationX =
        lerp(
            world.heroRotationX,
            world.targetHeroRotationX,
            0.055
        );


    world.heroRotationY =
        lerp(
            world.heroRotationY,
            world.targetHeroRotationY,
            0.055
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
        world.heroRotationX;


    heroObject.rotation.y =
        world.heroRotationY;


    /*
       Small floating movement keeps
       the object alive between scrolls.
    */

    heroObject.position.y +=
        Math.sin(
            elapsed * 0.7
        ) *
        0.035;

}


/* =========================================================
   HERO INTERNAL ANIMATION
   ========================================================= */

function updateHeroDetails(
    elapsed
) {

    if (!heroObject) {
        return;
    }


    const progress =
        state.scrollProgress;


    heroObject.children.forEach(
        function (
            child,
            index
        ) {

            /* ------------------------------------------------
               INNER WIREFRAME
               ------------------------------------------------ */

            if (
                child ===
                innerObject
            ) {

                child.rotation.y -=
                    0.0035;


                child.rotation.z +=
                    0.0014;


                child.rotation.x +=
                    Math.sin(
                        elapsed * 0.4
                    ) *
                    0.0005;

            }


            /* ------------------------------------------------
               OUTER WIREFRAME
               ------------------------------------------------ */

            if (
                index === 2
            ) {

                child.rotation.y +=
                    0.0018;


                child.rotation.x +=
                    0.0007;

            }


            /* ------------------------------------------------
               ORBIT RINGS
               ------------------------------------------------ */

            if (
                child.userData &&
                child.userData.rotationSpeed
            ) {

                child.rotation.z +=
                    child.userData
                        .rotationSpeed *
                    (
                        1 +
                        progress * 2
                    );

            }

        }
    );

}


/* =========================================================
   PARTICLE JOURNEY
   ========================================================= */

function updateParticles(
    elapsed
) {

    if (!particles) {
        return;
    }


    const progress =
        state.scrollProgress;


    /*
       Base rotation.
    */

    particles.rotation.y =
        elapsed * 0.018;


    particles.rotation.x =
        Math.sin(
            elapsed * 0.1
        ) *
        0.05;


    /*
       Scroll transforms the entire
       particle field.
    */

    particles.position.z =
        -progress * 2.4;


    particles.position.x =
        state.mouseX * 0.25 -
        progress * 0.35;


    particles.position.y =
        state.mouseY * 0.16 +
        progress * 0.15;


    /*
       Slightly reduce particles
       during deep sections.
    */

    if (particleMaterial) {

        particleMaterial.opacity =
            0.65 -
            progress * 0.18;

    }

}


/* =========================================================
   3D WORLD DEPTH
   ========================================================= */

function updateWorldDepth() {

    if (!scene) {
        return;
    }


    const progress =
        state.scrollProgress;


    /*
       Very subtle world rotation.
       This makes the whole environment
       feel connected instead of static.
    */

    scene.rotation.y =
        progress *
        0.035;


    scene.rotation.x =
        state.mouseY *
        0.012;


    /*
       Keep movement subtle so the camera
       remains the main cinematic motion.
    */

}


/* =========================================================
   SECTION PROGRESS CLASSES
   ========================================================= */

function updateSectionClasses() {

    const progress =
        state.scrollProgress;


    if (site) {

        site.style.setProperty(
            "--scroll-progress",
            progress
        );

    }


    /*
       Hero state.
    */

    if (progress > 0.08) {

        body.classList.add(
            "journey-started"
        );

    } else {

        body.classList.remove(
            "journey-started"
        );

    }


    /*
       Work state.
    */

    if (progress > 0.18) {

        body.classList.add(
            "work-journey"
        );

    } else {

        body.classList.remove(
            "work-journey"
        );

    }


    /*
       Deep journey.
    */

    if (progress > 0.62) {

        body.classList.add(
            "deep-journey"
        );

    } else {

        body.classList.remove(
            "deep-journey"
        );

    }

}
/* =========================================================
   PHASE 2 — PART 3/3
   INTERACTION + ANIMATION + INITIALIZATION
   ========================================================= */


/* =========================================================
   CUSTOM CURSOR
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


    function cursorLoop() {

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
            cursorLoop
        );

    }


    cursorLoop();


    const interactiveElements =
        document.querySelectorAll(
            "a, button, .work-item"
        );


    interactiveElements.forEach(
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
   WORK OBSERVER
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
   VISIBILITY
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
   REDUCED MOTION
   ========================================================= */

function prefersReducedMotion() {

    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

}


/* =========================================================
   THREE ANIMATION LOOP
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
       CAMERA
       ----------------------------------------------------- */

    updateCameraJourney();


    /* -----------------------------------------------------
       HERO
       ----------------------------------------------------- */

    updateHeroJourney(
        elapsed
    );


    updateHeroDetails(
        elapsed
    );


    /* -----------------------------------------------------
       PARTICLES
       ----------------------------------------------------- */

    updateParticles(
        elapsed
    );


    /* -----------------------------------------------------
       WORLD
       ----------------------------------------------------- */

    updateWorldDepth();


    /* -----------------------------------------------------
       PAGE STATE
       ----------------------------------------------------- */

    updateSectionClasses();


    /* -----------------------------------------------------
       RENDER
       ----------------------------------------------------- */

    renderer.render(
        scene,
        camera
    );

}


/* =========================================================
   REDUCED MOTION HANDLING
   ========================================================= */

function setupReducedMotion() {

    if (
        !prefersReducedMotion()
    ) {
        return;
    }


    /*
       Keep the 3D world visible,
       but remove aggressive movement.
    */

    if (particleMaterial) {

        particleMaterial.opacity =
            0.35;

    }

}


/* =========================================================
   PAGE LOAD SAFETY
   ========================================================= */

function setupPageSafety() {

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
   MAIN INITIALIZATION
   ========================================================= */

function init() {

    /*
       Input
    */

    setupMouse();

    setupTouch();

    setupScroll();


    /*
       UI
    */

    setupCursor();

    setupWorkObserver();

    setupMenu();


    /*
       Browser lifecycle
    */

    setupVisibility();

    setupPageSafety();


    /*
       Three.js
    */

    initThree();


    /*
       Motion
    */

    setupReducedMotion();


    /*
       Start renderer
    */

    if (
        renderer
    ) {

        animateThree();

    }

}


/* =========================================================
   START
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
