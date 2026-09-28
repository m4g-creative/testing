/* =========================================================
   VOID — CINEMATIC SCROLL JOURNEY
   PHASE 2
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

const hero =
    document.getElementById("hero");

const work =
    document.getElementById("work");

const about =
    document.getElementById("about");

const contact =
    document.getElementById("contact");


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

    scrollProgress: 0,
    targetScrollProgress: 0,

    menuOpen: false,

    isTouch:
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0

};


/* =========================================================
   THREE VARIABLES
   ========================================================= */

let scene;
let camera;
let renderer;

let heroObject;
let innerObject;

let particles;
let particleMaterial;
let particleGeometry;

let clock;

let animationFrame;


/* =========================================================
   CINEMATIC WORLD STATE
   ========================================================= */

const world = {

    targetCameraZ: 7,
    currentCameraZ: 7,

    targetCameraX: 0,
    currentCameraX: 0,

    targetCameraY: 0,
    currentCameraY: 0,

    targetHeroX: 1.7,
    currentHeroX: 1.7,

    targetHeroY: 0.15,
    currentHeroY: 0.15,

    targetHeroZ: 0,
    currentHeroZ: 0,

    targetHeroScale: 1,
    currentHeroScale: 1,

    targetHeroRotationX: 0,
    targetHeroRotationY: 0,

    currentHeroRotationX: 0,
    currentHeroRotationY: 0,

    workProgress: 0,

    aboutProgress: 0,

    contactProgress: 0

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
        Math.min(max, value)
    );

}


function lerp(
    current,
    target,
    amount
) {

    return current +
        (
            target -
            current
        ) *
        amount;

}


/* =========================================================
   SECTION PROGRESS
   ========================================================= */

function getSectionProgress(
    element,
    startOffset = 0,
    endOffset = 0
) {

    if (!element) {
        return 0;
    }

    const rect =
        element.getBoundingClientRect();

    const viewportHeight =
        window.innerHeight;

    const start =
        viewportHeight -
        startOffset;

    const end =
        -rect.height +
        endOffset;

    const distance =
        start - end;

    if (distance === 0) {
        return 0;
    }

    return clamp(
        (start - rect.top) / distance,
        0,
        1
    );

}


/* =========================================================
   GLOBAL SCROLL PROGRESS
   ========================================================= */

function calculateScrollProgress() {

    const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

    if (maxScroll <= 0) {
        return 0;
    }

    return clamp(
        state.scrollY / maxScroll,
        0,
        1
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
            "Three.js was not loaded."
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

    createHeroObject();

    createParticles();

    resizeThree();

}


/* =========================================================
   LIGHTING
   ========================================================= */

function createLights() {

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            0.45
        );

    scene.add(ambient);


    const keyLight =
        new THREE.PointLight(
            0xffffff,
            4,
            30
        );

    keyLight.position.set(
        3,
        4,
        5
    );

    scene.add(keyLight);


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

    scene.add(purpleLight);


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

    scene.add(cyanLight);

}


/* =========================================================
   HERO OBJECT
   ========================================================= */

function createHeroObject() {

    heroObject =
        new THREE.Group();


    /* -----------------------------------------------------
       MAIN BODY
       ----------------------------------------------------- */

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

            opacity: 0.92,

            clearcoat: 1,

            clearcoatRoughness: 0.18

        });


    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    heroObject.add(mesh);


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

            opacity: 0.22

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
       OUTER DETAIL
       ----------------------------------------------------- */

    const detailGeometry =
        new THREE.IcosahedronGeometry(
            1.9,
            1
        );


    const detailMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x22d3ee,

            wireframe: true,

            transparent: true,

            opacity: 0.08

        });


    const detail =
        new THREE.Mesh(
            detailGeometry,
            detailMaterial
        );


    detail.rotation.x =
        0.4;

    detail.rotation.y =
        0.7;


    heroObject.add(
        detail
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


    heroObject.position.set(
        1.7,
        0.15,
        0
    );


    heroObject.scale.set(
        1,
        1,
        1
    );


    scene.add(
        heroObject
    );

}


/* =========================================================
   ORBIT
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

            color,

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
        Math.random() *
            0.0015 +
        0.0005;


    return ring;

}


/* =========================================================
   PARTICLES
   ========================================================= */

function createParticles() {

    const count =
        state.isTouch
            ? 700
            : 1500;


    const positions =
        new Float32Array(
            count * 3
        );


    const sizes =
        new Float32Array(
            count
        );


    for (
        let i = 0;
        i < count;
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


        sizes[i] =
            0.5 +
            Math.random() *
            1.5;

    }


    particleGeometry =
        new THREE.BufferGeometry();


    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    particleGeometry.setAttribute(
        "size",
        new THREE.BufferAttribute(
            sizes,
            1
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
            particleGeometry,
            particleMaterial
        );


    scene.add(
        particles
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
   SCROLL TRACKING
   ========================================================= */

function setupScroll() {

    let ticking =
        false;


    window.addEventListener(
        "scroll",
        function () {

            state.targetScrollY =
                window.scrollY;


            if (!ticking) {

                window.requestAnimationFrame(
                    function () {

                        state.targetScrollProgress =
                            calculateScrollProgress();

                        updateScrollState();

                        ticking =
                            false;

                    }
                );


                ticking =
                    true;

            }

        },
        {
            passive: true
        }
    );


    state.targetScrollY =
        window.scrollY;


    state.targetScrollProgress =
        calculateScrollProgress();

}


/* =========================================================
   UPDATE SCROLL STATE
   ========================================================= */

function updateScrollState() {

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
            0.08
        );

}
/* =========================================================
   CINEMATIC CAMERA JOURNEY
   ========================================================= */

function updateCinematicCamera() {

    if (!camera) {
        return;
    }

    const progress =
        state.scrollProgress;


    /* -----------------------------------------------------
       HERO → WORK
       ----------------------------------------------------- */

    const heroProgress =
        clamp(
            progress / 0.38,
            0,
            1
        );


    const easedHero =
        easeInOutCubic(
            heroProgress
        );


    /*
       Camera gradually moves toward
       the 3D world as the user scrolls.
    */

    world.targetCameraZ =
        7 -
        easedHero * 2.35;


    world.targetCameraX =
        easedHero * -0.65;


    world.targetCameraY =
        easedHero * 0.25;


    /* -----------------------------------------------------
       WORK → ABOUT
       ----------------------------------------------------- */

    const aboutStart =
        0.38;

    const aboutEnd =
        0.72;


    const aboutProgress =
        clamp(
            (
                progress -
                aboutStart
            ) /
            (
                aboutEnd -
                aboutStart
            ),
            0,
            1
        );


    world.aboutProgress =
        easeInOutCubic(
            aboutProgress
        );


    /*
       Camera starts moving deeper
       into the scene.
    */

    world.targetCameraZ =
        lerp(
            world.targetCameraZ,
            7 -
            world.aboutProgress *
            1.25,
            0.35
        );


    world.targetCameraX =
        lerp(
            world.targetCameraX,
            -0.65 +
            world.aboutProgress *
            0.85,
            0.35
        );


    world.targetCameraY =
        lerp(
            world.targetCameraY,
            0.25 -
            world.aboutProgress *
            0.5,
            0.35
        );


    /* -----------------------------------------------------
       ABOUT → CONTACT
       ----------------------------------------------------- */

    const contactStart =
        0.72;


    const contactProgress =
        clamp(
            (
                progress -
                contactStart
            ) /
            0.28,
            0,
            1
        );


    world.contactProgress =
        easeInOutCubic(
            contactProgress
        );


    if (
        world.contactProgress > 0
    ) {

        world.targetCameraZ =
            lerp(
                world.targetCameraZ,
                5.5,
                world.contactProgress
            );


        world.targetCameraX =
            lerp(
                world.targetCameraX,
                0.45,
                world.contactProgress
            );


        world.targetCameraY =
            lerp(
                world.targetCameraY,
                0.15,
                world.contactProgress
            );

    }


    /* -----------------------------------------------------
       SMOOTH CAMERA
       ----------------------------------------------------- */

    world.currentCameraZ =
        lerp(
            world.currentCameraZ,
            world.targetCameraZ,
            0.055
        );


    world.currentCameraX =
        lerp(
            world.currentCameraX,
            world.targetCameraX,
            0.055
        );


    world.currentCameraY =
        lerp(
            world.currentCameraY,
            world.targetCameraY,
            0.055
        );


    camera.position.z =
        world.currentCameraZ;


    camera.position.x =
        world.currentCameraX;


    camera.position.y =
        world.currentCameraY;

}


/* =========================================================
   HERO CINEMATIC TRANSFORMATION
   ========================================================= */

function updateHeroJourney() {

    if (!heroObject) {
        return;
    }


    const progress =
        state.scrollProgress;


    /* -----------------------------------------------------
       HERO EXIT
       ----------------------------------------------------- */

    const heroExit =
        easeInOutCubic(
            clamp(
                progress / 0.42,
                0,
                1
            )
        );


    /*
       Object moves deeper and slightly
       toward the left side.
    */

    world.targetHeroX =
        1.7 -
        heroExit * 1.45;


    world.targetHeroY =
        0.15 +
        heroExit * 0.65;


    world.targetHeroZ =
        -heroExit * 1.8;


    /*
       Object becomes larger first,
       then slowly pulls away.
    */

    const scaleIn =
        clamp(
            progress / 0.16,
            0,
            1
        );


    const scaleOut =
        clamp(
            (
                progress -
                0.16
            ) /
            0.42,
            0,
            1
        );


    world.targetHeroScale =
        1 +
        scaleIn * 0.12 -
        scaleOut * 0.32;


    /* -----------------------------------------------------
       CINEMATIC ROTATION
       ----------------------------------------------------- */

    world.targetHeroRotationX =
        progress * 0.75 +
        state.mouseY * 0.12;


    world.targetHeroRotationY =
        progress * 1.5 +
        state.mouseX * 0.18;


    /* -----------------------------------------------------
       SMOOTH HERO TRANSFORM
       ----------------------------------------------------- */

    world.currentHeroX =
        lerp(
            world.currentHeroX,
            world.targetHeroX,
            0.055
        );


    world.currentHeroY =
        lerp(
            world.currentHeroY,
            world.targetHeroY,
            0.055
        );


    world.currentHeroZ =
        lerp(
            world.currentHeroZ,
            world.targetHeroZ,
            0.055
        );


    world.currentHeroScale =
        lerp(
            world.currentHeroScale,
            world.targetHeroScale,
            0.055
        );


    world.currentHeroRotationX =
        lerp(
            world.currentHeroRotationX,
            world.targetHeroRotationX,
            0.055
        );


    world.currentHeroRotationY =
        lerp(
            world.currentHeroRotationY,
            world.targetHeroRotationY,
            0.055
        );


    heroObject.position.x =
        world.currentHeroX;


    heroObject.position.y =
        world.currentHeroY;


    heroObject.position.z =
        world.currentHeroZ;


    heroObject.scale.setScalar(
        world.currentHeroScale
    );


    heroObject.rotation.x =
        world.currentHeroRotationX;


    heroObject.rotation.y =
        world.currentHeroRotationY;

}


/* =========================================================
   PARTICLE JOURNEY
   ========================================================= */

function updateParticleJourney(
    elapsed
) {

    if (!particles) {
        return;
    }


    const progress =
        state.scrollProgress;


    /*
       The particle field moves
       independently from the camera.
    */

    particles.rotation.y =
        elapsed * 0.018 +
        progress * 0.65;


    particles.rotation.x =
        Math.sin(
            elapsed * 0.1
        ) *
        0.05 +
        progress * 0.18;


    /*
       Scroll creates depth drift.
    */

    particles.position.z =
        -progress * 1.8;


    particles.position.x =
        state.mouseX * 0.18 -
        progress * 0.35;


    particles.position.y =
        state.mouseY * 0.12 +
        progress * 0.15;


    /*
       Subtle density/brightness
       change during the journey.
    */

    if (particleMaterial) {

        particleMaterial.opacity =
            0.65 -
            progress * 0.16;

    }

}


/* =========================================================
   HERO DETAIL MOTION
   ========================================================= */

function updateHeroDetails(
    elapsed
) {

    if (!heroObject) {
        return;
    }


    const progress =
        state.scrollProgress;


    heroObject.children
        .forEach(
            function (
                child,
                index
            ) {

                /*
                 Inner wireframe
                */

                if (
                    child ===
                    innerObject
                ) {

                    child.rotation.y -=
                        0.0035;


                    child.rotation.z +=
                        0.0012;


                    child.rotation.x +=
                        Math.sin(
                            elapsed * 0.4
                        ) *
                        0.0008;

                }


                /*
                 Orbit rings
                */

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


                /*
                 Outer detail
                */

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

}


/* =========================================================
   MOUSE PARALLAX
   ========================================================= */

function updateMouseParallax() {

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


    /*
       Mouse influence becomes slightly
       weaker during deep scroll.
    */

    const strength =
        1 -
        state.scrollProgress *
        0.45;


    if (heroObject) {

        heroObject.rotation.z =
            state.mouseX *
            0.08 *
            strength;

    }


    if (camera) {

        camera.rotation.z =
            state.mouseX *
            0.012 *
            strength;

    }

}


/* =========================================================
   SECTION VISUAL STATE
   ========================================================= */

function updateSectionState() {

    const progress =
        state.scrollProgress;


    /*
       Work section
       */

    if (work) {

        const workProgress =
            clamp(
                (
                    progress -
                    0.16
                ) /
                0.30,
                0,
                1
            );


        world.workProgress =
            easeInOutCubic(
                workProgress
            );

    }


    /*
       About section
       */

    if (about) {

        about.style.setProperty(
            "--journey-progress",
            world.aboutProgress
        );

    }


    /*
       Contact section
       */

    if (contact) {

        contact.style.setProperty(
            "--journey-progress",
            world.contactProgress
        );

    }

}


/* =========================================================
   CINEMATIC LOOK AT
   ========================================================= */

function updateCameraLook() {

    if (!camera) {
        return;
    }


    const progress =
        state.scrollProgress;


    const lookX =
        state.mouseX *
        0.25 +
        progress *
        0.15;


    const lookY =
        state.mouseY *
        0.18 -
        progress *
        0.08;


    camera.lookAt(
        lookX,
        lookY,
        0
    );

}


/* =========================================================
   EASING
   ========================================================= */

function easeInOutCubic(
    value
) {

    value =
        clamp(
            value,
            0,
            1
        );


    return value < 0.5

        ? 4 *
          value *
          value *
          value

        : 1 -
          Math.pow(
              -2 *
              value +
              2,
              3
          ) /
          2;

}


/* =========================================================
   THREE RESIZE
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


    if (!dot || !ring) {
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


function applyMotionPreference() {

    if (
        prefersReducedMotion() &&
        renderer
    ) {

        renderer.setAnimationLoop(
            null
        );

    }

}


/* =========================================================
   MAIN THREE ANIMATION
   ========================================================= */

function animateThree() {

    animationFrame =
        requestAnimationFrame(
            animateThree
        );


    if (
        !renderer ||
        !scene ||
        !camera
    ) {
        return;
    }


    const elapsed =
        clock.getElapsedTime();


    /* -----------------------------------------------------
       SMOOTH INPUT
       ----------------------------------------------------- */

    updateMouseParallax();


    /* -----------------------------------------------------
       SCROLL
       ----------------------------------------------------- */

    updateScrollState();


    /* -----------------------------------------------------
       CAMERA JOURNEY
       ----------------------------------------------------- */

    updateCinematicCamera();


    /* -----------------------------------------------------
       HERO JOURNEY
       ----------------------------------------------------- */

    updateHeroJourney();


    /* -----------------------------------------------------
       PARTICLE JOURNEY
       ----------------------------------------------------- */

    updateParticleJourney(
        elapsed
    );


    /* -----------------------------------------------------
       HERO DETAILS
       ----------------------------------------------------- */

    updateHeroDetails(
        elapsed
    );


    /* -----------------------------------------------------
       SECTION STATE
       ----------------------------------------------------- */

    updateSectionState();


    /* -----------------------------------------------------
       CAMERA LOOK
       ----------------------------------------------------- */

    updateCameraLook();


    /* -----------------------------------------------------
       BASE WORLD ROTATION
       ----------------------------------------------------- */

    if (heroObject) {

        /*
           Constant slow movement keeps
           the hero alive even without scroll.
        */

        heroObject.rotation.y +=
            0.0022;


        heroObject.rotation.x +=
            Math.sin(
                elapsed * 0.45
            ) *
            0.00045;

    }


    /* -----------------------------------------------------
       RENDER
       ----------------------------------------------------- */

    renderer.render(
        scene,
        camera
    );

}


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    function () {

        resizeThree();

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

function init() {

    setupCursor();

    setupMouse();

    setupTouch();

    setupScroll();

    setupWorkObserver();

    setupMenu();

    setupVisibility();

    initThree();

    animateThree();

    applyMotionPreference();

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
