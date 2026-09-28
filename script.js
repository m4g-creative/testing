/* =========================================================
   VOID — PHASE 2
   CINEMATIC WORLD JOURNEY
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

    scrollVelocity: 0,

    menuOpen: false,

    isTouch:
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0

};


/* =========================================================
   THREE.JS
   ========================================================= */

let scene = null;
let camera = null;
let renderer = null;
let clock = null;


/* =========================================================
   WORLD GROUPS
   ========================================================= */

let worldGroup = null;
let environmentGroup = null;
let particleGroup = null;

let heroObject = null;
let innerObject = null;

let depthParticles = [];
let environmentObjects = [];

let particleMaterial = null;


/* =========================================================
   WORLD STATE
   ========================================================= */

const world = {

    /* Camera */
    cameraX: 0,
    cameraY: 0,
    cameraZ: 8,

    targetCameraX: 0,
    targetCameraY: 0,
    targetCameraZ: 8,

    lookX: 0,
    lookY: 0,
    lookZ: -1,

    targetLookX: 0,
    targetLookY: 0,
    targetLookZ: -1,


    /* Hero */
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
    rotationZ: 0,

    targetRotationX: 0,
    targetRotationY: 0,
    targetRotationZ: 0,


    /* Environment */
    environmentX: 0,
    environmentY: 0,

    targetEnvironmentX: 0,
    targetEnvironmentY: 0

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


function smoothStep(
    start,
    end,
    value
) {

    return ease(
        (
            value -
            start
        ) /
        (
            end -
            start
        )
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
            43,
            window.innerWidth /
            window.innerHeight,
            0.1,
            120
        );


    camera.position.set(
        0,
        0,
        8
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
            state.isTouch ? 1.5 : 2
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


    /* -----------------------------------------------------
       WORLD CONTAINERS
       ----------------------------------------------------- */

    worldGroup =
        new THREE.Group();


    environmentGroup =
        new THREE.Group();


    particleGroup =
        new THREE.Group();


    worldGroup.add(
        environmentGroup
    );


    worldGroup.add(
        particleGroup
    );


    scene.add(
        worldGroup
    );


    /* -----------------------------------------------------
       BUILD WORLD
       ----------------------------------------------------- */

    createLights();

    createHero();

    createParticles();

    createEnvironment();

    resizeThree();

}


/* =========================================================
   LIGHTING
   ========================================================= */

function createLights() {

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            0.42
        );


    scene.add(
        ambient
    );


    const white =
        new THREE.PointLight(
            0xffffff,
            4.5,
            35
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
            6,
            30
        );


    purple.position.set(
        -5,
        2,
        -4
    );


    scene.add(
        purple
    );


    const cyan =
        new THREE.PointLight(
            0x22d3ee,
            5,
            30
        );


    cyan.position.set(
        5,
        -3,
        -8
    );


    scene.add(
        cyan
    );

}


/* =========================================================
   HERO OBJECT
   ========================================================= */

function createHero() {

    heroObject =
        new THREE.Group();


    /* -----------------------------------------------------
       MAIN FORM
       ----------------------------------------------------- */

    const geometry =
        new THREE.IcosahedronGeometry(
            1.55,
            2
        );


    const material =
        new THREE.MeshPhysicalMaterial({

            color: 0x101018,

            roughness: 0.2,

            metalness: 0.72,

            transparent: true,

            opacity: 0.95,

            clearcoat: 1,

            clearcoatRoughness: 0.16

        });


    const main =
        new THREE.Mesh(
            geometry,
            material
        );


    heroObject.add(
        main
    );


    /* -----------------------------------------------------
       INNER STRUCTURE
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

            opacity: 0.25

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
       OUTER STRUCTURE
       ----------------------------------------------------- */

    const outer =
        new THREE.Mesh(

            new THREE.IcosahedronGeometry(
                1.92,
                1
            ),

            new THREE.MeshBasicMaterial({

                color: 0x22d3ee,

                wireframe: true,

                transparent: true,

                opacity: 0.08

            })

        );


    outer.rotation.x =
        0.4;


    outer.rotation.y =
        0.7;


    heroObject.add(
        outer
    );


    /* -----------------------------------------------------
       ORBIT SYSTEM
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
       INITIAL POSITION
       ----------------------------------------------------- */

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
        Math.random() *
        0.001;


    return ring;

}
/* =========================================================
   VOID — PHASE 2
   SCRIPT.JS — PART 2/4
   DEPTH FIELD + CINEMATIC SCROLL
   ========================================================= */


/* =========================================================
   PARTICLES
   ========================================================= */

function createParticles() {

    const count =
        state.isTouch
            ? 520
            : 1100;


    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const depth =
            Math.random() * 34 - 17;


        const spread =
            5.5 +
            Math.random() * 8;


        positions[i * 3] =
            (
                Math.random() -
                0.5
            ) * spread;


        positions[i * 3 + 1] =
            (
                Math.random() -
                0.5
            ) * spread;


        positions[i * 3 + 2] =
            depth;

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
                    ? 0.032
                    : 0.022,

            transparent: true,

            opacity: 0.58,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending

        });


    particles =
        new THREE.Points(
            geometry,
            particleMaterial
        );


    particleGroup.add(
        particles
    );


    depthParticles.push(
        particles
    );


    /*
       Second depth layer.
       Smaller + farther away.
    */

    createDepthLayer(
        state.isTouch
            ? 180
            : 420,

        0.014,

        0.24,

        0.45
    );


    /*
       Third layer.
       Larger foreground particles.
    */

    createDepthLayer(
        state.isTouch
            ? 80
            : 180,

        0.045,

        0.34,

        1.7
    );

}


/* =========================================================
   DEPTH PARTICLE LAYER
   ========================================================= */

function createDepthLayer(
    count,
    size,
    opacity,
    depthRange
) {

    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        positions[i * 3] =
            (
                Math.random() -
                0.5
            ) * 15;


        positions[i * 3 + 1] =
            (
                Math.random() -
                0.5
            ) * 11;


        positions[i * 3 + 2] =
            (
                Math.random() -
                0.5
            ) * 20;

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


    const material =
        new THREE.PointsMaterial({

            color: 0xffffff,

            size: size,

            transparent: true,

            opacity: opacity,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending

        });


    const layer =
        new THREE.Points(
            geometry,
            material
        );


    layer.userData.depthRange =
        depthRange;


    layer.userData.baseX =
        (
            Math.random() -
            0.5
        ) * 2;


    layer.userData.baseY =
        (
            Math.random() -
            0.5
        ) * 2;


    particleGroup.add(
        layer
    );


    depthParticles.push(
        layer
    );

}


/* =========================================================
   ENVIRONMENT
   ========================================================= */

function createEnvironment() {

    /*
       These are intentionally subtle.
       They create depth without changing
       the existing VOID visual language.
    */

    const geometry =
        new THREE.BufferGeometry();


    const vertices = [];


    const width =
        18;


    const height =
        12;


    const depth =
        32;


    const horizontalLines =
        7;


    const verticalLines =
        9;


    for (
        let i = 0;
        i < horizontalLines;
        i++
    ) {

        const y =
            -height / 2 +
            (
                i /
                (horizontalLines - 1)
            ) *
            height;


        vertices.push(
            -width / 2,
            y,
            -depth
        );


        vertices.push(
            width / 2,
            y,
            -depth
        );

    }


    for (
        let i = 0;
        i < verticalLines;
        i++
    ) {

        const x =
            -width / 2 +
            (
                i /
                (verticalLines - 1)
            ) *
            width;


        vertices.push(
            x,
            -height / 2,
            -depth
        );


        vertices.push(
            x,
            height / 2,
            -depth
        );

    }


    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            vertices,
            3
        )
    );


    const material =
        new THREE.LineBasicMaterial({

            color: 0xffffff,

            transparent: true,

            opacity: 0.025

        });


    const grid =
        new THREE.LineSegments(
            geometry,
            material
        );


    grid.position.z =
        -7;


    environmentGroup.add(
        grid
    );


    environmentObjects.push(
        grid
    );


    /*
       Floating depth frames
    */

    createDepthFrame(
        -4,
        1.5,
        -5,
        4.5,
        3
    );


    createDepthFrame(
        4,
        -1,
        -11,
        3.2,
        2.4
    );


    createDepthFrame(
        -3.5,
        -2,
        -17,
        5.5,
        3.5
    );

}


/* =========================================================
   DEPTH FRAME
   ========================================================= */

function createDepthFrame(
    x,
    y,
    z,
    width,
    height
) {

    const points = [

        new THREE.Vector3(
            -width / 2,
            -height / 2,
            0
        ),

        new THREE.Vector3(
            width / 2,
            -height / 2,
            0
        ),

        new THREE.Vector3(
            width / 2,
            height / 2,
            0
        ),

        new THREE.Vector3(
            -width / 2,
            height / 2,
            0
        ),

        new THREE.Vector3(
            -width / 2,
            -height / 2,
            0
        )

    ];


    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points
            );


    const material =
        new THREE.LineBasicMaterial({

            color: 0xffffff,

            transparent: true,

            opacity: 0.035

        });


    const frame =
        new THREE.Line(
            geometry,
            material
        );


    frame.position.set(
        x,
        y,
        z
    );


    frame.rotation.z =
        (
            Math.random() -
            0.5
        ) * 0.5;


    environmentGroup.add(
        frame
    );


    environmentObjects.push(
        frame
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
            state.isTouch
                ? 1.5
                : 2
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
   SCROLL
   ========================================================= */

function getScrollProgress() {

    const maxScroll =
        Math.max(
            1,
            document.documentElement
                .scrollHeight -
            window.innerHeight
        );


    return clamp(
        window.scrollY /
        maxScroll,
        0,
        1
    );

}


function setupScroll() {

    state.scrollY =
        window.scrollY;


    state.targetScrollY =
        window.scrollY;


    window.addEventListener(
        "scroll",
        function () {

            const previous =
                state.targetScrollY;


            state.targetScrollY =
                window.scrollY;


            state.scrollVelocity =
                lerp(
                    state.scrollVelocity,
                    state.targetScrollY -
                    previous,
                    0.35
                );

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   INPUT SMOOTHING
   ========================================================= */

function updateInput() {

    state.mouseX =
        lerp(
            state.mouseX,
            state.targetMouseX,
            0.075
        );


    state.mouseY =
        lerp(
            state.mouseY,
            state.targetMouseY,
            0.075
        );


    const previousScroll =
        state.scrollY;


    state.scrollY =
        lerp(
            state.scrollY,
            state.targetScrollY,
            0.075
        );


    const frameVelocity =
        state.scrollY -
        previousScroll;


    state.scrollVelocity =
        lerp(
            state.scrollVelocity,
            frameVelocity,
            0.18
        );

}


/* =========================================================
   CINEMATIC CAMERA JOURNEY
   ========================================================= */

function updateJourney() {

    if (
        !camera ||
        !heroObject ||
        !worldGroup
    ) {

        return;

    }


    const progress =
        getScrollProgress();


    /*
       ------------------------------------------------------
       TIMELINE

       0.00 — HERO
       0.20 — ENTER WORLD
       0.42 — WORK
       0.62 — ABOUT
       0.82 — CONTACT
       1.00 — END
       ------------------------------------------------------
    */


    const heroExit =
        smoothStep(
            0.00,
            0.22,
            progress
        );


    const workTravel =
        smoothStep(
            0.16,
            0.48,
            progress
        );


    const aboutTravel =
        smoothStep(
            0.40,
            0.70,
            progress
        );


    const contactTravel =
        smoothStep(
            0.68,
            1.00,
            progress
        );


    /* =====================================================
       CAMERA PATH
       ===================================================== */

    let cameraX =
        state.mouseX * 0.18;


    let cameraY =
        state.mouseY * 0.12;


    let cameraZ =
        8;


    /*
       Hero → world entry
    */

    cameraX =
        lerp(
            cameraX,
            -0.35,
            heroExit
        );


    cameraY =
        lerp(
            cameraY,
            0.18,
            heroExit
        );


    cameraZ =
        lerp(
            cameraZ,
            6.4,
            heroExit
        );


    /*
       Work journey
    */

    cameraX =
        lerp(
            cameraX,
            0.9,
            workTravel
        );


    cameraY =
        lerp(
            cameraY,
            -0.45,
            workTravel
        );


    cameraZ =
        lerp(
            cameraZ,
            4.7,
            workTravel
        );


    /*
       About journey
    */

    cameraX =
        lerp(
            cameraX,
            -0.65,
            aboutTravel
        );


    cameraY =
        lerp(
            cameraY,
            0.5,
            aboutTravel
        );


    cameraZ =
        lerp(
            cameraZ,
            5.4,
            aboutTravel
        );


    /*
       Contact journey
    */

    cameraX =
        lerp(
            cameraX,
            0.45,
            contactTravel
        );


    cameraY =
        lerp(
            cameraY,
            -0.15,
            contactTravel
        );


    cameraZ =
        lerp(
            cameraZ,
            7.2,
            contactTravel
        );


    /* =====================================================
       CAMERA MOMENTUM
       ===================================================== */

    const momentum =
        clamp(
            state.scrollVelocity *
            0.018,
            -0.35,
            0.35
        );


    cameraY +=
        momentum;


    cameraX +=
        state.mouseX *
        0.12;


    cameraY +=
        state.mouseY *
        0.08;


    /* =====================================================
       SMOOTH CAMERA
       ===================================================== */

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


    camera.position.set(
        world.cameraX,
        world.cameraY,
        world.cameraZ
    );


    /* =====================================================
       CAMERA LOOK TARGET
       ===================================================== */

    const lookTravel =
        progress *
        2.8;


    world.targetLookX =
        state.mouseX * 0.18;


    world.targetLookY =
        state.mouseY * 0.12;


    world.targetLookZ =
        -1.2 -
        lookTravel;


    world.lookX =
        lerp(
            world.lookX,
            world.targetLookX,
            0.06
        );


    world.lookY =
        lerp(
            world.lookY,
            world.targetLookY,
            0.06
        );


    world.lookZ =
        lerp(
            world.lookZ,
            world.targetLookZ,
            0.06
        );


    camera.lookAt(
        world.lookX,
        world.lookY,
        world.lookZ
    );


    /* =====================================================
       HERO DEPTH JOURNEY
       ===================================================== */

    const heroDepth =
        smoothStep(
            0.02,
            0.48,
            progress
        );


    const heroReturn =
        smoothStep(
            0.48,
            0.82,
            progress
        );


    world.targetHeroX =
        1.7;


    world.targetHeroY =
        0.15;


    world.targetHeroZ =
        0;


    world.targetHeroScale =
        1;


    /*
       Hero leaves foreground
       and travels deep into world.
    */

    world.targetHeroX =
        lerp(
            world.targetHeroX,
            -1.15,
            heroDepth
        );


    world.targetHeroY =
        lerp(
            world.targetHeroY,
            0.75,
            heroDepth
        );


    world.targetHeroZ =
        lerp(
            world.targetHeroZ,
            -5.8,
            heroDepth
        );


    world.targetHeroScale =
        lerp(
            world.targetHeroScale,
            0.48,
            heroDepth
        );


    /*
       Later it drifts back into
       the distant environment.
    */

    world.targetHeroX =
        lerp(
            world.targetHeroX,
            0.65,
            heroReturn
        );


    world.targetHeroY =
        lerp(
            world.targetHeroY,
            -0.5,
            heroReturn
        );


    world.targetHeroZ =
        lerp(
            world.targetHeroZ,
            -8.5,
            heroReturn
        );


    world.targetHeroScale =
        lerp(
            world.targetHeroScale,
            0.32,
            heroReturn
        );


    /* =====================================================
       HERO ROTATION
       ===================================================== */

    world.targetRotationX =
        state.mouseY * 0.2 +
        progress * 2.2;


    world.targetRotationY =
        state.mouseX * 0.28 +
        progress * 4.5;


    world.targetRotationZ =
        progress * 1.35;


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


    world.rotationX =
        lerp(
            world.rotationX,
            world.targetRotationX,
            0.055
        );


    world.rotationY =
        lerp(
            world.rotationY,
            world.targetRotationY,
            0.055
        );


    world.rotationZ =
        lerp(
            world.rotationZ,
            world.targetRotationZ,
            0.055
        );


    heroObject.position.set(
        world.heroX,
        world.heroY,
        world.heroZ
    );


    heroObject.scale.setScalar(
        world.heroScale
    );


    heroObject.rotation.x =
        world.rotationX;


    heroObject.rotation.y =
        world.rotationY;


    heroObject.rotation.z =
        world.rotationZ;


    /* =====================================================
       WORLD PARALLAX
       ===================================================== */

    world.targetEnvironmentX =
        state.mouseX * 0.18;


    world.targetEnvironmentY =
        state.mouseY * 0.12;


    world.environmentX =
        lerp(
            world.environmentX,
            world.targetEnvironmentX,
            0.04
        );


    world.environmentY =
        lerp(
            world.environmentY,
            world.targetEnvironmentY,
            0.04
        );


    environmentGroup.position.x =
        world.environmentX;


    environmentGroup.position.y =
        world.environmentY;


    environmentGroup.rotation.y =
        progress * 0.12;


    environmentGroup.rotation.x =
        state.mouseY * 0.018;


    /* =====================================================
       PARTICLE DEPTH MOVEMENT
       ===================================================== */

    particleGroup.position.x =
        state.mouseX * 0.25;


    particleGroup.position.y =
        state.mouseY * 0.16;


    particleGroup.rotation.y =
        progress * 0.32;


    particleGroup.rotation.x =
        progress * 0.08;


    depthParticles.forEach(
        function (
            layer,
            index
        ) {

            const depth =
                layer.userData.depthRange ||
                1;


            layer.position.z =
                -progress *
                depth *
                4;


            layer.position.x =
                state.mouseX *
                depth *
                0.22;


            layer.position.y =
                state.mouseY *
                depth *
                0.14;


            layer.rotation.z =
                progress *
                0.05 *
                            (index + 1);


        layer.position.z +=
            state.scrollVelocity *
            depth *
            0.45;


        layer.position.x +=
            layer.userData.baseX *
            0.01;


        layer.position.y +=
            layer.userData.baseY *
            0.01;

    }
);


/* =====================================================
   WORLD GROUP MOTION
   ===================================================== */

worldGroup.position.x =
    state.mouseX * 0.08;


worldGroup.position.y =
    state.mouseY * 0.05;


worldGroup.rotation.y =
    progress * 0.035;


worldGroup.rotation.x =
    state.mouseY * 0.01;


/* =====================================================
   SCROLL-BASED WORLD TRAVEL
   ===================================================== */

worldGroup.position.z =
    -progress * 2.2;


/* =====================================================
   ENVIRONMENT DEPTH TRAVEL
   ===================================================== */

environmentObjects.forEach(
    function (
        object,
        index
    ) {

        const depthOffset =
            index * 1.8;


        object.position.z +=
            -progress *
            depthOffset *
            0.12;


        object.rotation.y =
            progress *
            0.018 *
            (index + 1);

    }
);


/* =====================================================
   SCROLL SPEED RESPONSE
   ===================================================== */

const scrollPulse =
    clamp(
        Math.abs(
            state.scrollVelocity
        ) * 0.35,
        0,
        0.12
    );


if (particleMaterial) {

    particleMaterial.opacity =
        0.58 +
        scrollPulse;

}


/* =====================================================
   CSS JOURNEY VARIABLE
   ===================================================== */

if (site) {

    site.style.setProperty(
        "--scroll-progress",
        progress
    );

}

}


/* =========================================================
   END PART 2
   ========================================================= */
/* =========================================================
   VOID — PHASE 2
   SCRIPT.JS — PART 3/4
   ANIMATION + CURSOR + INTERACTION
   ========================================================= */


/* =========================================================
   HERO ANIMATION
   ========================================================= */

function updateHeroAnimation() {

    if (!heroObject) {
        return;
    }


    const time =
        performance.now() * 0.001;


    /*
       Continuous rotation keeps the
       object alive even when scrolling
       stops.
    */

    heroObject.rotation.x +=
        0.0018;

    heroObject.rotation.y +=
        0.0024;


    /*
       Very subtle floating motion.
    */

    const float =
        Math.sin(time * 0.75) *
        0.035;


    heroObject.position.y +=
        float * 0.025;


    /*
       Inner object reacts slightly
       faster than the main object.
    */

    if (innerObject) {

        innerObject.rotation.x +=
            0.003;

        innerObject.rotation.y +=
            0.004;

        innerObject.rotation.z +=
            0.0015;

    }

}


/* =========================================================
   PARTICLE ANIMATION
   ========================================================= */

function updateParticles() {

    if (!particles) {
        return;
    }


    const time =
        performance.now() * 0.001;


    particles.rotation.y +=
        0.00018;


    particles.rotation.x =
        Math.sin(time * 0.18) *
        0.012;


    depthParticles.forEach(
        function (
            layer,
            index
        ) {

            const speed =
                0.00012 *
                (index + 1);


            layer.rotation.y +=
                speed;


            layer.rotation.x =
                Math.sin(
                    time * 0.12 +
                    index
                ) * 0.008;

        }
    );

}


/* =========================================================
   ENVIRONMENT ANIMATION
   ========================================================= */

function updateEnvironment() {

    if (!environmentObjects.length) {
        return;
    }


    const time =
        performance.now() * 0.001;


    environmentObjects.forEach(
        function (
            object,
            index
        ) {

            const amount =
                0.003 +
                index * 0.0007;


            object.rotation.z +=
                amount;


            object.position.y +=
                Math.sin(
                    time * 0.22 +
                    index * 1.7
                ) * 0.0008;

        }
    );

}


/* =========================================================
   CURSOR
   ========================================================= */

function updateCursor() {

    if (!cursor) {
        return;
    }


    /*
       Desktop cursor only.
    */

    if (state.isTouch) {
        return;
    }


    cursor.style.transform =
        "translate3d(" +
        state.mouseX *
        window.innerWidth *
        0.5 +
        "px," +
        state.mouseY *
        window.innerHeight *
        0.5 +
        "px,0)";

}


/* =========================================================
   CURSOR POSITION
   ========================================================= */

function setupCursor() {

    if (!cursor) {
        return;
    }


    window.addEventListener(
        "mousemove",
        function (event) {

            const x =
                event.clientX /
                window.innerWidth;


            const y =
                event.clientY /
                window.innerHeight;


            state.targetMouseX =
                (x - 0.5) * 2;


            state.targetMouseY =
                (y - 0.5) * 2;


            cursor.style.left =
                event.clientX +
                "px";


            cursor.style.top =
                event.clientY +
                "px";

        },
        {
            passive: true
        }
    );


    /*
       VIEW cursor for project items.
    */

    const viewItems =
        document.querySelectorAll(
            "[data-cursor='view']"
        );


    viewItems.forEach(
        function (item) {

            item.addEventListener(
                "mouseenter",
                function () {

                    cursor.classList.add(
                        "is-view"
                    );

                }
            );


            item.addEventListener(
                "mouseleave",
                function () {

                    cursor.classList.remove(
                        "is-view"
                    );

                }
            );

        }
    );


    /*
       Hide custom cursor when
       leaving the document.
    */

    document.addEventListener(
        "mouseleave",
        function () {

            cursor.style.opacity =
                "0";

        }
    );


    document.addEventListener(
        "mouseenter",
        function () {

            cursor.style.opacity =
                "1";

        }
    );

}


/* =========================================================
   WORK REVEAL
   ========================================================= */

function setupWorkObserver() {

    const items =
        document.querySelectorAll(
            ".work-item"
        );


    if (!items.length) {
        return;
    }


    /*
       IntersectionObserver gives the
       existing work section its
       cinematic entrance.
    */

    const observer =
        new IntersectionObserver(
            function (
                entries
            ) {

                entries.forEach(
                    function (
                        entry
                    ) {

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
                threshold: 0.12,
                rootMargin:
                    "0px 0px -8% 0px"
            }
        );


    items.forEach(
        function (item) {

            observer.observe(
                item
            );

        }
    );

}


/* =========================================================
   WORK HOVER DEPTH
   ========================================================= */

function setupWorkInteraction() {

    const items =
        document.querySelectorAll(
            ".work-item"
        );


    items.forEach(
        function (item) {

            item.addEventListener(
                "mousemove",
                function (event) {

                    if (
                        state.isTouch
                    ) {
                        return;
                    }


                    const rect =
                        item.getBoundingClientRect();


                    const x =
                        (
                            event.clientX -
                            rect.left
                        ) /
                        rect.width -
                        0.5;


                    const y =
                        (
                            event.clientY -
                            rect.top
                        ) /
                        rect.height -
                        0.5;


                    const visual =
                        item.querySelector(
                            ".work-visual"
                        );


                    if (!visual) {
                        return;
                    }


                    visual.style.transform =
                        "perspective(1000px) " +
                        "rotateX(" +
                        (-y * 2.5) +
                        "deg) " +
                        "rotateY(" +
                        (x * 3) +
                        "deg) " +
                        "translateZ(0)";

                }
            );


            item.addEventListener(
                "mouseleave",
                function () {

                    const visual =
                        item.querySelector(
                            ".work-visual"
                        );


                    if (!visual) {
                        return;
                    }


                    visual.style.transform =
                        "";

                }
            );

        }
    );

}


/* =========================================================
   MENU
   ========================================================= */

function setupMenu() {

    if (
        !menuButton ||
        !menuOverlay
    ) {
        return;
    }


    function openMenu() {

        state.menuOpen =
            true;


        menuOverlay.classList.add(
            "is-open"
        );


        menuOverlay.classList.add(
            "open"
        );


        menuButton.setAttribute(
            "aria-label",
            "Close menu"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeMenu() {

        state.menuOpen =
            false;


        menuOverlay.classList.remove(
            "is-open"
        );


        menuOverlay.classList.remove(
            "open"
        );


        menuButton.setAttribute(
            "aria-label",
            "Open menu"
        );


        if (
            !document.body.classList.contains(
                "loading"
            )
        ) {

            document.body.style.overflow =
                "";

        }

    }


    menuButton.addEventListener(
        "click",
        function () {

            if (state.menuOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        }
    );


    if (menuClose) {

        menuClose.addEventListener(
            "click",
            closeMenu
        );

    }


    const links =
        menuOverlay.querySelectorAll(
            "a"
        );


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    closeMenu();

                }
            );

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape" &&
                state.menuOpen
            ) {

                closeMenu();

            }

        }
    );

}


/* =========================================================
   NAVIGATION LINKS
   ========================================================= */

function setupNavigation() {

    const links =
        document.querySelectorAll(
            "a[href^='#']"
        );


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetID =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetID ||
                        targetID === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetID
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior:
                            "smooth",
                        block:
                            "start"
                    });

                }
            );

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

                state.scrollVelocity =
                    0;

            }

        }
    );

}


/* =========================================================
   TOUCH INTERACTION
   ========================================================= */

function setupTouchInteraction() {

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
                    window.innerWidth -
                    0.5
                ) * 2;


            state.targetMouseY =
                (
                    touch.clientY /
                    window.innerHeight -
                    0.5
                ) * 2;

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   REDUCED MOTION
   ========================================================= */

function applyReducedMotion() {

    if (
        !window.matchMedia
    ) {
        return;
    }


    const media =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (
        !media.matches
    ) {
        return;
    }


    state.reducedMotion =
        true;


    state.scrollVelocity =
        0;

}


/* =========================================================
   RENDER
   ========================================================= */

function renderThree() {

    if (
        !renderer ||
        !scene ||
        !camera
    ) {
        return;
    }


    renderer.render(
        scene,
        camera
    );

}
/* =========================================================
VOID — PHASE 2
SCRIPT.JS — PART 4/4
ANIMATION LOOP + INIT
========================================================= */

/* =========================================================
ANIMATION LOOP
========================================================= */

let animationFrame = null;

function animate() {
    animationFrame =
        requestAnimationFrame(animate);

    updateInput();
    updateJourney();
    updateHeroAnimation();
    updateParticles();
    updateEnvironment();
    updateCursor();

    renderThree();
}


/* =========================================================
INITIALIZE
========================================================= */

function init() {
    try {
        applyReducedMotion();

        setupMouse();
        setupTouch();
        setupCursor();
        setupScroll();

        setupWorkObserver();
        setupWorkInteraction();

        setupMenu();
        setupNavigation();
        setupVisibility();
        setupTouchInteraction();

        initThree();
        resizeThree();

        animate();

    } catch (error) {
        console.error(
            "VOID initialization error:",
            error
        );
    }
}


/* =========================================================
PAGE LOAD
========================================================= */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        init
    );
} else {
    init();
}


/* =========================================================
PAGE LIFECYCLE
========================================================= */

window.addEventListener(
    "pageshow",
    function () {
        if (!animationFrame) {
            animate();
        }
    }
);

window.addEventListener(
    "pagehide",
    function () {
        if (animationFrame) {
            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = null;
        }
    }
);


/* =========================================================
FINAL RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function () {
        resizeThree();
    },
    { passive: true }
);


/* =========================================================
FINAL TOUCH RESET
========================================================= */

window.addEventListener(
    "touchend",
    function () {
        state.targetMouseX *= 0.85;
        state.targetMouseY *= 0.85;
    },
    { passive: true }
);
