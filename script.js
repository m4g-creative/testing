/* =========================================================
   VOID — IMMERSIVE 3D EXPERIENCE
   THREE.JS HERO WORLD
   ========================================================= */


/* =========================================================
   DOM
   ========================================================= */

const body =
    document.body;

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
   THREE.JS VARIABLES
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
   THREE.JS INITIALIZATION
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
            "Three.js failed to load."
        );

        return;

    }


    /*
     * Scene
     */

    scene =
        new THREE.Scene();


    /*
     * Camera
     */

    camera =
        new THREE.PerspectiveCamera(
            42,
            window.innerWidth /
            window.innerHeight,
            0.1,
            100
        );


    camera.position.z =
        7;


    /*
     * Renderer
     */

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
            window.devicePixelRatio || 1,
            2
        )
    );


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.outputEncoding =
        THREE.sRGBEncoding;


    /*
     * Clock
     */

    clock =
        new THREE.Clock();


    /*
     * Lights
     */

    createLights();


    /*
     * Main 3D object
     */

    createHeroObject();


    /*
     * Particles
     */

    createParticles();


    /*
     * Resize
     */

    resizeThree();

}


/* =========================================================
   LIGHTING
   ========================================================= */

function createLights() {

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            0.45
        );


    scene.add(
        ambientLight
    );


    const keyLight =
        new THREE.PointLight(
            0xffffff,
            4,
            20
        );


    keyLight.position.set(
        3,
        4,
        5
    );


    scene.add(
        keyLight
    );


    const purpleLight =
        new THREE.PointLight(
            0x8b5cf6,
            7,
            15
        );


    purpleLight.position.set(
        -4,
        1,
        2
    );


    scene.add(
        purpleLight
    );


    const blueLight =
        new THREE.PointLight(
            0x22d3ee,
            5,
            15
        );


    blueLight.position.set(
        4,
        -3,
        1
    );


    scene.add(
        blueLight
    );

}


/* =========================================================
   HERO 3D OBJECT
   ========================================================= */

function createHeroObject() {

    heroObject =
        new THREE.Group();


    /*
     * Outer geometry
     */

    const outerGeometry =
        new THREE.IcosahedronGeometry(
            1.55,
            2
        );


    const outerMaterial =
        new THREE.MeshPhysicalMaterial({

            color:
                0x101018,

            roughness:
                0.22,

            metalness:
                0.72,

            transparent:
                true,

            opacity:
                0.92,

            clearcoat:
                1,

            clearcoatRoughness:
                0.18

        });


    const outerMesh =
        new THREE.Mesh(
            outerGeometry,
            outerMaterial
        );


    heroObject.add(
        outerMesh
    );


    /*
     * Inner wireframe
     */

    const innerGeometry =
        new THREE.IcosahedronGeometry(
            1.72,
            1
        );


    const innerMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0x8b5cf6,

            wireframe:
                true,

            transparent:
                true,

            opacity:
                0.22

        });


    innerObject =
        new THREE.Mesh(
            innerGeometry,
            innerMaterial
        );


    heroObject.add(
        innerObject
    );


    /*
     * Second wire layer
     */

    const detailGeometry =
        new THREE.IcosahedronGeometry(
            1.9,
            1
        );


    const detailMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0x22d3ee,

            wireframe:
                true,

            transparent:
                true,

            opacity:
                0.08

        });


    const detailMesh =
        new THREE.Mesh(
            detailGeometry,
            detailMaterial
        );


    detailMesh.rotation.x =
        0.4;


    detailMesh.rotation.y =
        0.7;


    heroObject.add(
        detailMesh
    );


    /*
     * Small orbital rings
     */

    createOrbit(
        2.15,
        0.012,
        0x8b5cf6,
        0.32,
        0.3
    );


    createOrbit(
        2.45,
        0.008,
        0x22d3ee,
        -0.48,
        -0.2
    );


    createOrbit(
        2.75,
        0.005,
        0xffffff,
        0.7,
        0.4
    );


    /*
     * Position
     */

    heroObject.position.set(
        1.7,
        0.15,
        0
    );


    /*
     * Scale
     */

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
   ORBIT RINGS
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

            color:
                color,

            transparent:
                true,

            opacity:
                0.5

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
        (
            Math.random() *
            0.0015
        ) +
        0.0005;


    heroObject.add(
        ring
    );

}


/* =========================================================
   PARTICLES
   ========================================================= */

function createParticles() {

    const particleCount =
        state.isTouch
            ? 700
            : 1500;


    particleGeometry =
        new THREE.BufferGeometry();


    const positions =
        new Float32Array(
            particleCount * 3
        );


    const sizes =
        new Float32Array(
            particleCount
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
                (
                    Math.random() *
                    2
                ) - 1
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
            Math.random() * 2 + 0.4;

    }


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

            color:
                0xffffff,

            size:
                0.025,

            transparent:
                true,

            opacity:
                0.65,

            depthWrite:
                false,

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
   MOUSE INPUT
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
                ) - 0.5;


            state.targetMouseY =
                (
                    event.clientY /
                    window.innerHeight
                ) - 0.5;

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   TOUCH INPUT
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
                ) - 0.5;


            state.targetMouseY =
                (
                    touch.clientY /
                    window.innerHeight
                ) - 0.5;

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   THREE.JS ANIMATION
   ========================================================= */

function animateThree() {

    animationFrame =
        requestAnimationFrame(
            animateThree
        );


    if (!scene || !camera || !renderer) {
        return;
    }


    const elapsed =
        clock.getElapsedTime();


    /*
     * Smooth mouse
     */

    state.mouseX +=
        (
            state.targetMouseX -
            state.mouseX
        ) * 0.045;


    state.mouseY +=
        (
            state.targetMouseY -
            state.mouseY
        ) * 0.045;


    /*
     * Hero object rotation
     */

    if (heroObject) {

        heroObject.rotation.y +=
            0.0022;


        heroObject.rotation.x =
            Math.sin(
                elapsed * 0.45
            ) * 0.08;


        heroObject.position.x =
            1.7 +
            state.mouseX * 0.55;


        heroObject.position.y =
            0.15 -
            state.mouseY * 0.4;


        heroObject.rotation.y +=
            state.mouseX * 0.001;


        heroObject.rotation.x +=
            state.mouseY * 0.001;

    }


    /*
     * Inner wireframe
     */

    if (innerObject) {

        innerObject.rotation.y -=
            0.0035;

        innerObject.rotation.z +=
            0.0015;

    }


    /*
     * Orbit rings
     */

    if (heroObject) {

        heroObject.children.forEach(
            function (child) {

                if (
                    child.userData &&
                    child.userData.rotationSpeed
                ) {

                    child.rotation.z +=
                        child.userData.rotationSpeed;

                }

            }
        );

    }


    /*
     * Particles
     */

    if (particles) {

        particles.rotation.y =
            elapsed * 0.018;

        particles.rotation.x =
            Math.sin(
                elapsed * 0.1
            ) * 0.05;


        particles.position.x =
            state.mouseX * 0.25;


        particles.position.y =
            -state.mouseY * 0.2;

    }


    /*
     * Camera parallax
     */

    camera.position.x +=
        (
            state.mouseX * 0.55 -
            camera.position.x
        ) * 0.025;


    camera.position.y +=
        (
            -state.mouseY * 0.35 -
            camera.position.y
        ) * 0.025;


    camera.lookAt(
        0,
        0,
        0
    );


    renderer.render(
        scene,
        camera
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
            window.devicePixelRatio || 1,
            2
        )
    );


    renderer.setSize(
        width,
        height,
        false
    );

}


/* =========================================================
   CUSTOM CURSOR
   ========================================================= */

function setupCursor() {

    if (!cursor) {
        return;
    }


    if (state.isTouch) {

        cursor.style.display =
            "none";

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


    let cursorX =
        window.innerWidth / 2;

    let cursorY =
        window.innerHeight / 2;


    let targetX =
        cursorX;

    let targetY =
        cursorY;


    window.addEventListener(
        "mousemove",
        function (event) {

            targetX =
                event.clientX;

            targetY =
                event.clientY;

        },
        {
            passive: true
        }
    );


    function updateCursor() {

        cursorX +=
            (
                targetX -
                cursorX
            ) * 0.18;


        cursorY +=
            (
                targetY -
                cursorY
            ) * 0.18;


        if (dot) {

            dot.style.transform =
                `translate3d(
                    ${targetX}px,
                    ${targetY}px,
                    0
                )`;

        }


        if (ring) {

            ring.style.transform =
                `translate3d(
                    ${cursorX}px,
                    ${cursorY}px,
                    0
                )`;

        }


        requestAnimationFrame(
            updateCursor
        );

    }


    updateCursor();


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
                        "cursor-active"
                    );

                }
            );


            element.addEventListener(
                "mouseleave",
                function () {

                    cursor.classList.remove(
                        "cursor-active"
                    );

                }
            );

        }
    );


    workItems.forEach(
        function (item) {

            item.addEventListener(
                "mouseenter",
                function () {

                    cursor.classList.add(
                        "cursor-view"
                    );

                }
            );


            item.addEventListener(
                "mouseleave",
                function () {

                    cursor.classList.remove(
                        "cursor-view"
                    );

                }
            );

        }
    );

}


/* =========================================================
   SCROLL
   ========================================================= */

function setupScroll() {

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
   WORK OBSERVER
   ========================================================= */

function setupWorkObserver() {

    if (!workItems.length) {
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
   MENU
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


    if (menuButton) {

        menuButton.classList.add(
            "is-active"
        );

    }

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


    if (menuButton) {

        menuButton.classList.remove(
            "is-active"
        );

    }

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
    }

}


/* =========================================================
   VISIBILITY
   ========================================================= */

function setupVisibility() {

    document.addEventListener(
        "visibilitychange",
        function () {

            if (document.hidden) {
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
   REDUCED MOTION ADJUSTMENT
   ========================================================= */

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
   RESIZE EVENT
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
