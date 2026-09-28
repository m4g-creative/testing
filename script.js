/* =========================================================
   VOID — INTERACTIVE EXPERIENCE
   JAVASCRIPT
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

    width: window.innerWidth,
    height: window.innerHeight,

    loaded: false,

    menuOpen: false,

    isTouch:
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0

};


/* =========================================================
   INTRO
   ========================================================= */

function startIntro() {

    if (!site) {
        return;
    }

    state.loaded = true;

    site.classList.add("is-visible");

}


/* =========================================================
   CUSTOM CURSOR
   ========================================================= */

function setupCursor() {

    if (!cursor) {
        return;
    }

    if (state.isTouch) {

        cursor.style.display = "none";

        return;
    }


    const dot =
        cursor.querySelector(".cursor-dot");

    const ring =
        cursor.querySelector(".cursor-ring");


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


    function animateCursor() {

        cursorX +=
            (targetX - cursorX) * 0.18;

        cursorY +=
            (targetY - cursorY) * 0.18;


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
            animateCursor
        );

    }


    animateCursor();


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
   WEBGL
   ========================================================= */

let gl = null;


/* WebGL animation state */

const webglState = {

    initialized: false,

    time: 0,

    program: null,

    positionBuffer: null

};


/* =========================================================
   WEBGL SHADERS
   ========================================================= */

const vertexShaderSource = `

    attribute vec2 aPosition;

    void main() {

        gl_Position =
            vec4(
                aPosition,
                0.0,
                1.0
            );

    }

`;


const fragmentShaderSource = `

    precision highp float;

    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;

    void main() {

        vec2 uv =
            gl_FragCoord.xy /
            uResolution.xy;

        vec2 centered =
            uv - 0.5;

        centered.x *=
            uResolution.x /
            uResolution.y;


        float distanceFromCenter =
            length(centered);


        float mouseDistance =
            distance(
                centered,
                uMouse
            );


        float glow =
            0.035 /
            max(
                mouseDistance,
                0.02
            );


        float pulse =
            sin(
                uTime * 0.4 +
                distanceFromCenter * 4.0
            ) * 0.005;


        float vignette =
            1.0 -
            smoothstep(
                0.15,
                0.85,
                distanceFromCenter
            );


        vec3 background =
            vec3(
                0.018,
                0.018,
                0.022
            );


        vec3 light =
            vec3(
                0.10,
                0.07,
                0.15
            );


        vec3 finalColor =
            background;


        finalColor +=
            light *
            glow *
            vignette;


        finalColor +=
            pulse *
            vec3(
                0.5,
                0.3,
                0.8
            );


        gl_FragColor =
            vec4(
                finalColor,
                1.0
            );

    }

`;


/* =========================================================
   WEBGL HELPERS
   ========================================================= */

function createShader(
    context,
    type,
    source
) {

    const shader =
        context.createShader(type);

    context.shaderSource(
        shader,
        source
    );

    context.compileShader(
        shader
    );


    if (
        !context.getShaderParameter(
            shader,
            context.COMPILE_STATUS
        )
    ) {

        console.warn(
            "WebGL shader error:",
            context.getShaderInfoLog(shader)
        );

        context.deleteShader(shader);

        return null;

    }


    return shader;

}


function createProgram(
    context,
    vertexSource,
    fragmentSource
) {

    const vertexShader =
        createShader(
            context,
            context.VERTEX_SHADER,
            vertexSource
        );


    const fragmentShader =
        createShader(
            context,
            context.FRAGMENT_SHADER,
            fragmentSource
        );


    if (
        !vertexShader ||
        !fragmentShader
    ) {

        return null;

    }


    const program =
        context.createProgram();


    context.attachShader(
        program,
        vertexShader
    );

    context.attachShader(
        program,
        fragmentShader
    );

    context.linkProgram(
        program
    );


    if (
        !context.getProgramParameter(
            program,
            context.LINK_STATUS
        )
    ) {

        console.warn(
            "WebGL program error:",
            context.getProgramInfoLog(program)
        );

        return null;

    }


    return program;

}


/* =========================================================
   WEBGL SETUP
   ========================================================= */

function setupWebGL() {

    if (!canvas) {
        return;
    }


    gl =
        canvas.getContext(
            "webgl",
            {
                alpha: false,
                antialias: true,
                powerPreference: "high-performance"
            }
        );


    if (!gl) {

        console.warn(
            "WebGL is not available."
        );

        return;

    }


    const program =
        createProgram(
            gl,
            vertexShaderSource,
            fragmentShaderSource
        );


    if (!program) {
        return;
    }


    webglState.program =
        program;


    const positionBuffer =
        gl.createBuffer();


    webglState.positionBuffer =
        positionBuffer;


    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        positionBuffer
    );


    const positions =
        new Float32Array([

            -1, -1,
             1, -1,
            -1,  1,

            -1,  1,
             1, -1,
             1,  1

        ]);


    gl.bufferData(
        gl.ARRAY_BUFFER,
        positions,
        gl.STATIC_DRAW
    );


    webglState.initialized =
        true;


    resizeWebGL();

}


/* =========================================================
   WEBGL RESIZE
   ========================================================= */

function resizeWebGL() {

    if (!canvas || !gl) {
        return;
    }


    const pixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    const width =
        Math.floor(
            window.innerWidth *
            pixelRatio
        );


    const height =
        Math.floor(
            window.innerHeight *
            pixelRatio
        );


    if (
        canvas.width !== width ||
        canvas.height !== height
    ) {

        canvas.width =
            width;

        canvas.height =
            height;

    }


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


/* =========================================================
   WEBGL RENDER
   ========================================================= */

function renderWebGL() {

    if (
        !gl ||
        !webglState.initialized ||
        !webglState.program
    ) {

        return;

    }


    webglState.time +=
        0.016;


    const program =
        webglState.program;


    gl.useProgram(
        program
    );


    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        webglState.positionBuffer
    );


    const positionLocation =
        gl.getAttribLocation(
            program,
            "aPosition"
        );


    gl.enableVertexAttribArray(
        positionLocation
    );


    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );


    const timeLocation =
        gl.getUniformLocation(
            program,
            "uTime"
        );


    const resolutionLocation =
        gl.getUniformLocation(
            program,
            "uResolution"
        );


    const mouseLocation =
        gl.getUniformLocation(
            program,
            "uMouse"
        );


    gl.uniform1f(
        timeLocation,
        webglState.time
    );


    gl.uniform2f(
        resolutionLocation,
        canvas.width,
        canvas.height
    );


    const mouseX =
        state.mouseX * 0.5;

    const mouseY =
        -state.mouseY * 0.5;


    gl.uniform2f(
        mouseLocation,
        mouseX,
        mouseY
    );


    gl.drawArrays(
        gl.TRIANGLES,
        0,
        6
    );

}


/* =========================================================
   MOUSE PARALLAX
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
   WORK INTERSECTION
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

                if (state.menuOpen) {

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
                event.key === "Escape" &&
                state.menuOpen
            ) {

                closeMenu();

            }

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


    let touchStartY =
        0;


    window.addEventListener(
        "touchstart",
        function (event) {

            if (
                event.touches &&
                event.touches.length
            ) {

                touchStartY =
                    event.touches[0].clientY;

            }

        },
        {
            passive: true
        }
    );


    window.addEventListener(
        "touchmove",
        function (event) {

            if (
                !event.touches ||
                !event.touches.length
            ) {

                return;

            }


            const currentY =
                event.touches[0].clientY;


            const difference =
                currentY -
                touchStartY;


            state.targetMouseY =
                difference * 0.001;

        },
        {
            passive: true
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

            resizeWebGL();

        }
    );

}


/* =========================================================
   RESIZE
   ========================================================= */

function setupResize() {

    window.addEventListener(
        "resize",
        function () {

            state.width =
                window.innerWidth;

            state.height =
                window.innerHeight;


            resizeWebGL();

        }
    );

}


/* =========================================================
   MAIN ANIMATION LOOP
   ========================================================= */

function animate() {

    state.mouseX +=
        (
            state.targetMouseX -
            state.mouseX
        ) * 0.06;


    state.mouseY +=
        (
            state.targetMouseY -
            state.mouseY
        ) * 0.06;


    state.scrollY +=
        (
            state.targetScrollY -
            state.scrollY
        ) * 0.08;


    renderWebGL();


    requestAnimationFrame(
        animate
    );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function init() {

    setupCursor();

    setupMouse();

    setupScroll();

    setupWorkObserver();

    setupMenu();

    setupTouch();

    setupVisibility();

    setupResize();

    setupWebGL();

    animate();

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
