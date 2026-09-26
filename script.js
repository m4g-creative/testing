/* =====================================================
   CODEXA — SCRIPT.JS PART 1/4
   CONFIG + SPLASH + AUTH + NAVIGATION
   ===================================================== */


/* =====================================================
   SUPABASE CONFIG
   ===================================================== */

const SUPABASE_URL =
    "https://idfqgujrsrurlajyultw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_tACoZGEalQ9xoMoGGcyUFA_hOshBQxA";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =====================================================
   STARTER CODE
   ===================================================== */

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
    <title>Codexa Project</title>
</head>
<body>

    <h1>Hello, Codexa!</h1>
    <p>Start building your website here.</p>

</body>
</html>`;


const DEFAULT_CSS = `body {
    margin: 0;
    padding: 40px;
    font-family: Arial, sans-serif;
    background: #111827;
    color: white;
}

h1 {
    color: #8b5cf6;
}`;


const DEFAULT_JS = `console.log("Codexa is running!");`;


/* =====================================================
   APPLICATION STATE
   ===================================================== */

let currentUser = null;

let activeProjectId = null;

let confirmCallback = null;

let clearSnapshot = null;

let splashFinished = false;


/* =====================================================
   ERROR CONSOLE STATE
   ===================================================== */

let consoleErrors = [];

let consoleWarnings = [];

let activeErrorTab = "errors";


/* =====================================================
   DOM ELEMENTS
   ===================================================== */


/* ---------- Splash ---------- */

const splashScreen =
    document.getElementById("splashScreen");

const splashBrandText =
    document.getElementById("splashBrandText");


/* ---------- Auth ---------- */

const authPage =
    document.getElementById("authPage");

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const signupEmail =
    document.getElementById("signupEmail");

const signupPassword =
    document.getElementById("signupPassword");

const signupPasswordConfirm =
    document.getElementById("signupPasswordConfirm");

const loginBtn =
    document.getElementById("loginBtn");

const signupBtn =
    document.getElementById("signupBtn");

const showSignupBtn =
    document.getElementById("showSignupBtn");

const showLoginBtn =
    document.getElementById("showLoginBtn");

const loginMessage =
    document.getElementById("loginMessage");

const signupMessage =
    document.getElementById("signupMessage");


/* ---------- App ---------- */

const appShell =
    document.getElementById("appShell");

const compilerPage =
    document.getElementById("compilerPage");

const savedProjectsPage =
    document.getElementById("savedProjectsPage");


/* ---------- Navbar ---------- */

const savedProjectsBtn =
    document.getElementById("savedProjectsBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const mobileSavedProjectsBtn =
    document.getElementById(
        "mobileSavedProjectsBtn"
    );

const mobileLogoutBtn =
    document.getElementById(
        "mobileLogoutBtn"
    );

const menuToggleBtn =
    document.getElementById("menuToggleBtn");

const mobileNav =
    document.getElementById("mobileNav");


/* ---------- Compiler ---------- */

const projectNameInput =
    document.getElementById("projectNameInput");

const runBtn =
    document.getElementById("runBtn");

const clearBtn =
    document.getElementById("clearBtn");

const undoBtn =
    document.getElementById("undoBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const saveBtn =
    document.getElementById("saveBtn");


/* ---------- Editors ---------- */

const htmlCode =
    document.getElementById("htmlCode");

const cssCode =
    document.getElementById("cssCode");

const jsCode =
    document.getElementById("jsCode");


/* ---------- Preview ---------- */

const preview =
    document.getElementById("preview");

const previewCard =
    document.getElementById("previewCard");

const previewContent =
    document.getElementById("previewContent");

const previewToggleBtn =
    document.getElementById("previewToggleBtn");

const previewArrow =
    document.getElementById("previewArrow");

const fullscreenBtn =
    document.getElementById("fullscreenBtn");


/* ---------- Opened Project ---------- */

const openedProjectBar =
    document.getElementById("openedProjectBar");

const openedProjectText =
    document.getElementById("openedProjectText");

const backToSavedProjectsFromCompiler =
    document.getElementById(
        "backToSavedProjectsFromCompiler"
    );


/* ---------- Saved Projects ---------- */

const backToCompilerBtn =
    document.getElementById(
        "backToCompilerBtn"
    );

const projectsGrid =
    document.getElementById("projectsGrid");


/* ---------- Error Console ---------- */

const errorConsoleCard =
    document.getElementById(
        "errorConsoleCard"
    );

const errorCount =
    document.getElementById(
        "errorCount"
    );

const clearErrorsBtn =
    document.getElementById(
        "clearErrorsBtn"
    );

const errorsTabBtn =
    document.getElementById(
        "errorsTabBtn"
    );

const warningsTabBtn =
    document.getElementById(
        "warningsTabBtn"
    );

const errorList =
    document.getElementById(
        "errorList"
    );

const noErrorsMessage =
    document.getElementById(
        "noErrorsMessage"
    );


/* ---------- Toast ---------- */

const toastContainer =
    document.getElementById(
        "toastContainer"
    );


/* ---------- Confirm ---------- */

const confirmOverlay =
    document.getElementById(
        "confirmOverlay"
    );

const confirmTitle =
    document.getElementById(
        "confirmTitle"
    );

const confirmMessage =
    document.getElementById(
        "confirmMessage"
    );

const confirmCancel =
    document.getElementById(
        "confirmCancel"
    );

const confirmAction =
    document.getElementById(
        "confirmAction"
    );


/* =====================================================
   SPLASH TYPING ANIMATION
   ===================================================== */

function startSplash() {

    const text = "Codexa";

    let index = 0;

    splashBrandText.textContent = "";


    const typingSpeed = 105;


    function typeNextCharacter() {

        if (index < text.length) {

            splashBrandText.textContent +=
                text.charAt(index);

            index++;

            setTimeout(
                typeNextCharacter,
                typingSpeed
            );

            return;

        }


        setTimeout(
            finishSplash,
            350
        );

    }


    typeNextCharacter();

}


/* =====================================================
   FINISH SPLASH
   ===================================================== */

function finishSplash() {

    if (splashFinished) {
        return;
    }

    splashFinished = true;


    if (splashScreen) {

        splashScreen.classList.add(
            "hide"
        );

    }


    document.body.classList.remove(
        "splash-active"
    );

}


/* =====================================================
   AUTH PAGE DISPLAY
   ===================================================== */

function showAuthPage() {

    if (!authPage || !appShell) {
        return;
    }


    authPage.style.display = "flex";

    appShell.style.display = "none";


    compilerPage.style.display = "block";

    savedProjectsPage.classList.remove(
        "active"
    );

}


/* =====================================================
   APP DISPLAY
   ===================================================== */

function showApp() {

    if (!authPage || !appShell) {
        return;
    }


    authPage.style.display = "none";

    appShell.style.display = "flex";


    showCompiler();

}


/* =====================================================
   SHOW LOGIN FORM
   ===================================================== */

function showLoginForm() {

    loginForm.classList.remove(
        "hidden-auth"
    );

    signupForm.classList.add(
        "hidden-auth"
    );


    loginMessage.textContent = "";

    signupMessage.textContent = "";

}


/* =====================================================
   SHOW SIGNUP FORM
   ===================================================== */

function showSignupForm() {

    signupForm.classList.remove(
        "hidden-auth"
    );

    loginForm.classList.add(
        "hidden-auth"
    );


    loginMessage.textContent = "";

    signupMessage.textContent = "";

}


/* =====================================================
   AUTH MESSAGE
   ===================================================== */

function setAuthMessage(
    element,
    message,
    type = ""
) {

    element.textContent = message;

    element.className =
        "auth-message";


    if (type) {

        element.classList.add(type);

    }

}


/* =====================================================
   LOGIN
   ===================================================== */

async function loginUser() {

    const email =
        loginEmail.value.trim();

    const password =
        loginPassword.value;


    if (!email || !password) {

        setAuthMessage(
            loginMessage,
            "Please enter email and password.",
            "error"
        );

        return;

    }


    loginBtn.disabled = true;

    loginBtn.textContent =
        "Logging in...";


    setAuthMessage(
        loginMessage,
        ""
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {
            throw error;
        }


        currentUser =
            data.user;


        loginEmail.value = "";

        loginPassword.value = "";


        showApp();


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        setAuthMessage(
            loginMessage,
            error.message ||
            "Login failed.",
            "error"
        );

    } finally {

        loginBtn.disabled = false;

        loginBtn.textContent =
            "Login";

    }

}


/* =====================================================
   SIGNUP
   ===================================================== */

async function signupUser() {

    const email =
        signupEmail.value.trim();

    const password =
        signupPassword.value;

    const confirmPassword =
        signupPasswordConfirm.value;


    if (
        !email ||
        !password ||
        !confirmPassword
    ) {

        setAuthMessage(
            signupMessage,
            "Please fill in all fields.",
            "error"
        );

        return;

    }


    if (password !== confirmPassword) {

        setAuthMessage(
            signupMessage,
            "Passwords do not match.",
            "error"
        );

        return;

    }


    if (password.length < 6) {

        setAuthMessage(
            signupMessage,
            "Password must be at least 6 characters.",
            "error"
        );

        return;

    }


    signupBtn.disabled = true;

    signupBtn.textContent =
        "Creating...";


    setAuthMessage(
        signupMessage,
        ""
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password

            });


        if (error) {
            throw error;
        }


        signupEmail.value = "";

        signupPassword.value = "";

        signupPasswordConfirm.value = "";


        if (data.session) {

            currentUser =
                data.user;

            showApp();

            return;

        }


        setAuthMessage(
            signupMessage,
            "Account created. Check your email to confirm your account.",
            "success"
        );


    } catch (error) {

        console.error(
            "Signup error:",
            error
        );


        setAuthMessage(
            signupMessage,
            error.message ||
            "Signup failed.",
            "error"
        );

    } finally {

        signupBtn.disabled = false;

        signupBtn.textContent =
            "Create Account";

    }

}


/* =====================================================
   LOGOUT
   ===================================================== */

async function logoutUser() {

    try {

        const {
            error
        } =
            await supabaseClient.auth.signOut();


        if (error) {
            throw error;
        }


        currentUser = null;

        activeProjectId = null;

        clearSnapshot = null;


        resetEditorState();


        closeMobileMenu();


        showAuthPage();


        showLoginForm();


        showToast(
            "Logged out successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );


        showToast(
            "Logout failed.",
            "error"
        );

    }

}


/* =====================================================
   RESET EDITOR STATE
   ===================================================== */

function resetEditorState() {

    activeProjectId = null;

    clearSnapshot = null;


    projectNameInput.value = "";

    htmlCode.value = DEFAULT_HTML;

    cssCode.value = DEFAULT_CSS;

    jsCode.value = DEFAULT_JS;


    undoBtn.disabled = true;


    hideOpenedProjectBar();


    clearPreview();

    clearErrorConsole();

}


/* =====================================================
   SHOW COMPILER
   ===================================================== */

function showCompiler() {

    compilerPage.style.display =
        "block";

    savedProjectsPage.classList.remove(
        "active"
    );


    closeMobileMenu();

}


/* =====================================================
   SHOW SAVED PROJECTS
   ===================================================== */

function showSavedProjects() {

    compilerPage.style.display =
        "none";

    savedProjectsPage.classList.add(
        "active"
    );


    closeMobileMenu();


    loadSavedProjects();

}


/* =====================================================
   MOBILE MENU
   ===================================================== */

function toggleMobileMenu() {

    const isOpen =
        mobileNav.classList.toggle("open");


    menuToggleBtn.classList.toggle(
        "active",
        isOpen
    );


    menuToggleBtn.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

}


function closeMobileMenu() {

    if (!mobileNav) {
        return;
    }


    mobileNav.classList.remove(
        "open"
    );


    menuToggleBtn.classList.remove(
        "active"
    );


    menuToggleBtn.setAttribute(
        "aria-expanded",
        "false"
    );

}


/* =====================================================
   EVENT LISTENERS — AUTH
   ===================================================== */

loginBtn.addEventListener(
    "click",
    loginUser
);


signupBtn.addEventListener(
    "click",
    signupUser
);


showSignupBtn.addEventListener(
    "click",
    showSignupForm
);


showLoginBtn.addEventListener(
    "click",
    showLoginForm
);


/* =====================================================
   ENTER KEY AUTH
   ===================================================== */

loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        loginUser();

    }
);


signupForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        signupUser();

    }
);


/* =====================================================
   EVENT LISTENERS — NAVIGATION
   ===================================================== */

savedProjectsBtn.addEventListener(
    "click",
    showSavedProjects
);


logoutBtn.addEventListener(
    "click",
    logoutUser
);


mobileSavedProjectsBtn.addEventListener(
    "click",
    showSavedProjects
);


mobileLogoutBtn.addEventListener(
    "click",
    logoutUser
);


menuToggleBtn.addEventListener(
    "click",
    toggleMobileMenu
);


/* =====================================================
   EVENT LISTENERS — COMPILER NAVIGATION
   ===================================================== */

backToCompilerBtn.addEventListener(
    "click",
    backToCompiler
);


backToSavedProjectsFromCompiler.addEventListener(
    "click",
    showSavedProjects
);


/* =====================================================
   START SPLASH
   ===================================================== */

startSplash();
/* =====================================================
   CODEXA — SCRIPT.JS PART 2A/2B
   COMPILER + ERROR CONSOLE
   ===================================================== */


/* =====================================================
   SHOW / HIDE OPENED PROJECT BAR
   ===================================================== */

function showOpenedProjectBar(projectName) {

    openedProjectText.textContent =
        `Opened project: ${projectName}`;

    openedProjectBar.classList.add(
        "visible"
    );

}


function hideOpenedProjectBar() {

    openedProjectBar.classList.remove(
        "visible"
    );

    openedProjectText.textContent =
        "Saved project is currently open.";

}


/* =====================================================
   CLEAR PREVIEW
   ===================================================== */

function clearPreview() {

    if (!preview) {
        return;
    }


    preview.srcdoc = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Codexa Preview</title>

</head>

<body>

</body>

</html>
`;

}


/* =====================================================
   ERROR CONSOLE HELPERS
   ===================================================== */

function clearErrorArrays() {

    consoleErrors = [];

    consoleWarnings = [];

}


function clearErrorConsole() {

    clearErrorArrays();

    activeErrorTab = "errors";

    renderErrorConsole();

}


/* =====================================================
   ADD ERROR
   ===================================================== */

function addConsoleError(
    message,
    line = null,
    source = "JavaScript",
    details = ""
) {

    consoleErrors.push({

        message:
            String(
                message ||
                "Unknown error."
            ),

        line:
            normalizeLineNumber(
                line,
                source
            ),

        source:
            source,

        details:
            details

    });

}


/* =====================================================
   ADD WARNING
   ===================================================== */

function addConsoleWarning(
    message,
    line = null,
    source = "JavaScript",
    details = ""
) {

    consoleWarnings.push({

        message:
            String(
                message ||
                "Unknown warning."
            ),

        line:
            normalizeLineNumber(
                line,
                source
            ),

        source:
            source,

        details:
            details

    });

}


/* =====================================================
   NORMALIZE LINE NUMBER
   ===================================================== */

function normalizeLineNumber(
    line,
    source = "JavaScript"
) {

    const number =
        Number(line);


    if (
        !Number.isFinite(number) ||
        number < 1
    ) {

        return null;

    }


    return Math.floor(number);

}


/* =====================================================
   CONVERT GENERATED LINE
   ===================================================== */

function convertGeneratedLineToUserLine(
    line
) {

    const number =
        Number(line);


    if (
        !Number.isFinite(number) ||
        number < 1
    ) {

        return null;

    }


    return Math.floor(number);

}


/* =====================================================
   ERROR MESSAGE CLEANUP
   ===================================================== */

function cleanErrorMessage(
    message
) {

    if (!message) {

        return "Unknown error.";

    }


    return String(message)
        .replace(
            /^Uncaught\s+/i,
            ""
        )
        .trim();

}


/* =====================================================
   STACK LINE EXTRACTION
   ===================================================== */

function extractSourceLine(
    stack
) {

    if (!stack) {
        return null;
    }


    const sourceUrlMatch =
        String(stack).match(
            /codexa-user\.js:(\d+):(\d+)/i
        );


    if (
        sourceUrlMatch &&
        sourceUrlMatch[1]
    ) {

        return convertGeneratedLineToUserLine(
            sourceUrlMatch[1]
        );

    }


    return null;

}


/* =====================================================
   PROCESS PREVIEW ERROR
   ===================================================== */

function processPreviewError(
    payload
) {

    if (!payload) {
        return;
    }


    const type =
        payload.type ||
        "error";


    const message =
        cleanErrorMessage(
            payload.message
        );


    let line = null;


    if (payload.stack) {

        line =
            extractSourceLine(
                payload.stack
            );

    }


    if (!line) {

        line =
            normalizeLineNumber(
                payload.line,
                payload.source ||
                "JavaScript"
            );

    }


    const source =
        payload.source ||
        "JavaScript";


    if (type === "warning") {

        addConsoleWarning(
            message,
            line,
            source,
            payload.stack || ""
        );

    } else {

        addConsoleError(
            message,
            line,
            source,
            payload.stack || ""
        );

    }


    renderErrorConsole();

}


/* =====================================================
   ERROR CONSOLE RENDER
   ===================================================== */

function renderErrorConsole() {

    if (!errorList) {
        return;
    }


    const totalErrors =
        consoleErrors.length;


    const totalWarnings =
        consoleWarnings.length;


    if (errorCount) {

        if (totalErrors === 1) {

            errorCount.textContent =
                "1 Error";

        } else {

            errorCount.textContent =
                `${totalErrors} Errors`;

        }


        errorCount.classList.toggle(
            "has-errors",
            totalErrors > 0
        );

    }


    if (errorsTabBtn) {

        errorsTabBtn.classList.toggle(
            "active",
            activeErrorTab === "errors"
        );

    }


    if (warningsTabBtn) {

        warningsTabBtn.classList.toggle(
            "active",
            activeErrorTab === "warnings"
        );

    }


    const items =
        activeErrorTab === "errors"
            ? consoleErrors
            : consoleWarnings;


    errorList.innerHTML = "";


    if (!items.length) {

        const empty =
            document.createElement("div");


        empty.className =
            "no-errors";


        const icon =
            document.createElement("div");


        icon.className =
            "no-errors-icon";


        icon.textContent =
            "✓";


        const strong =
            document.createElement("strong");


        strong.textContent =
            activeErrorTab === "errors"
                ? "No errors detected"
                : "No warnings detected";


        const span =
            document.createElement("span");


        span.textContent =
            activeErrorTab === "errors"
                ? "Run your code to check for errors."
                : "No warnings detected in the latest run.";


        empty.appendChild(
            icon
        );

        empty.appendChild(
            strong
        );

        empty.appendChild(
            span
        );


        errorList.appendChild(
            empty
        );


        return;

    }


    items.forEach(
        function(item) {

            const errorItem =
                document.createElement("div");


            errorItem.className =
                activeErrorTab === "warnings"
                    ? "error-item warning"
                    : "error-item";


            const icon =
                document.createElement("div");


            icon.className =
                "error-item-icon";


            icon.textContent =
                "!";


            const content =
                document.createElement("div");


            content.className =
                "error-item-content";


            const message =
                document.createElement("div");


            message.className =
                "error-item-message";


            message.textContent =
                item.message;


            const meta =
                document.createElement("div");


            meta.className =
                "error-item-meta";


            const type =
                document.createElement("span");


            type.className =
                "error-item-type";


            type.textContent =
                activeErrorTab === "warnings"
                    ? "Warning"
                    : "Error";


            const line =
                document.createElement("span");


            line.className =
                "error-item-line";


            line.textContent =
                item.line
                    ? `Line ${item.line}`
                    : "Line unavailable";


            const source =
                document.createElement("span");


            source.className =
                "error-item-source";


            source.textContent =
                item.source ||
                "JavaScript";


            const badge =
                document.createElement("span");


            badge.className =
                "error-item-badge";


            badge.textContent =
                activeErrorTab === "warnings"
                    ? "WARNING"
                    : "ERROR";


            meta.appendChild(
                type
            );

            meta.appendChild(
                line
            );

            meta.appendChild(
                source
            );


            content.appendChild(
                message
            );

            content.appendChild(
                meta
            );


            errorItem.appendChild(
                icon
            );

            errorItem.appendChild(
                content
            );

            errorItem.appendChild(
                badge
            );


            errorList.appendChild(
                errorItem
            );

        }
    );

}


/* =====================================================
   BASIC SOURCE WARNINGS
   ===================================================== */

function runBasicSourceChecks() {

    if (!htmlCode.value.trim()) {

        addConsoleWarning(
            "HTML editor is empty.",
            null,
            "HTML"
        );

    }


    if (!cssCode.value.trim()) {

        addConsoleWarning(
            "CSS editor is empty.",
            null,
            "CSS"
        );

    }


    if (!jsCode.value.trim()) {

        addConsoleWarning(
            "JavaScript editor is empty.",
            null,
            "JavaScript"
        );

    }


    const css =
        cssCode.value;


    const openBraces =
        (css.match(/\{/g) || []).length;


    const closeBraces =
        (css.match(/\}/g) || []).length;


    if (
        openBraces !==
        closeBraces
    ) {

        addConsoleWarning(
            "CSS braces appear to be unbalanced.",
            null,
            "CSS"
        );

    }

}
/* =====================================================
   CODEXA — SCRIPT.JS PART 2B/2B
   PREVIEW + RUN + CLEAR/UNDO
   ===================================================== */


/* =====================================================
   BUILD PREVIEW DOCUMENT
   ===================================================== */

function buildPreviewDocument() {

    const html =
        htmlCode.value;

    const css =
        cssCode.value;

    const js =
        jsCode.value;


    return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<style>

${css}

</style>

</head>

<body>

${html}


<script>

(function() {

    function sendMessage(
        type,
        message,
        line,
        source,
        stack
    ) {

        try {

            window.parent.postMessage(
                {
                    source:
                        "codexa-preview",

                    type:
                        type,

                    message:
                        message,

                    line:
                        line || null,

                    sourceFile:
                        source ||
                        "JavaScript",

                    stack:
                        stack ||
                        ""
                },
                "*"
            );

        } catch (error) {

        }

    }


    window.addEventListener(
        "error",
        function(event) {

            sendMessage(
                "error",
                event.message ||
                "JavaScript error.",
                event.lineno ||
                null,
                "JavaScript",
                event.error &&
                event.error.stack
                    ? event.error.stack
                    : ""
            );

        }
    );


    window.addEventListener(
        "unhandledrejection",
        function(event) {

            const reason =
                event.reason;


            let message =
                "Unhandled Promise rejection.";


            let stack =
                "";


            if (reason) {

                if (reason.message) {

                    message =
                        reason.message;

                } else {

                    message =
                        String(reason);

                }


                if (reason.stack) {

                    stack =
                        reason.stack;

                }

            }


            sendMessage(
                "error",
                message,
                null,
                "JavaScript",
                stack
            );

        }
    );


    const originalError =
        console.error;


    console.error =
        function() {

            const args =
                Array.from(
                    arguments
                );


            const message =
                args
                    .map(
                        function(item) {

                            if (
                                typeof item ===
                                "string"
                            ) {

                                return item;

                            }


                            try {

                                return JSON.stringify(
                                    item
                                );

                            } catch (error) {

                                return String(
                                    item
                                );

                            }

                        }
                    )
                    .join(" ");


            sendMessage(
                "error",
                message ||
                "Console error.",
                null,
                "Console",
                ""
            );


            originalError.apply(
                console,
                arguments
            );

        };


    const originalWarn =
        console.warn;


    console.warn =
        function() {

            const args =
                Array.from(
                    arguments
                );


            const message =
                args
                    .map(
                        function(item) {

                            if (
                                typeof item ===
                                "string"
                            ) {

                                return item;

                            }


                            try {

                                return JSON.stringify(
                                    item
                                );

                            } catch (error) {

                                return String(
                                    item
                                );

                            }

                        }
                    )
                    .join(" ");


            sendMessage(
                "warning",
                message ||
                "Console warning.",
                null,
                "Console",
                ""
            );


            originalWarn.apply(
                console,
                arguments
            );

        };

})();

</script>


<script>

// Codexa user JavaScript

try {

${js}

} catch (error) {

    window.parent.postMessage(
        {
            source:
                "codexa-preview",

            type:
                "error",

            message:
                error && error.message
                    ? error.message
                    : String(error),

            line:
                null,

            sourceFile:
                "JavaScript",

            stack:
                error && error.stack
                    ? error.stack
                    : ""
        },
        "*"
    );

}

//# sourceURL=codexa-user.js

<\/script>

</body>

</html>
`;

}


/* =====================================================
   RECEIVE PREVIEW ERRORS
   ===================================================== */

window.addEventListener(
    "message",
    function(event) {

        if (!event.data) {
            return;
        }


        if (
            event.data.source !==
            "codexa-preview"
        ) {

            return;

        }


        processPreviewError({

            type:
                event.data.type,

            message:
                event.data.message,

            line:
                event.data.line,

            source:
                event.data.sourceFile,

            stack:
                event.data.stack

        });

    }
);


/* =====================================================
   RUN CODE
   ===================================================== */

function runCode() {

    clearErrorConsole();


    runBasicSourceChecks();


    preview.srcdoc =
        buildPreviewDocument();


    renderErrorConsole();


    showToast(
        "Code executed successfully.",
        "success"
    );

}


/* =====================================================
   ERROR CONSOLE TABS
   ===================================================== */

errorsTabBtn.addEventListener(
    "click",
    function() {

        activeErrorTab =
            "errors";

        renderErrorConsole();

    }
);


warningsTabBtn.addEventListener(
    "click",
    function() {

        activeErrorTab =
            "warnings";

        renderErrorConsole();

    }
);


/* =====================================================
   CLEAR ERRORS EVENT
   ===================================================== */

clearErrorsBtn.addEventListener(
    "click",
    function() {

        clearErrorConsole();

        showToast(
            "Error console cleared.",
            "info"
        );

    }
);


/* =====================================================
   SAVE CLEAR SNAPSHOT
   ===================================================== */

function createClearSnapshot() {

    clearSnapshot = {

        html:
            htmlCode.value,

        css:
            cssCode.value,

        js:
            jsCode.value

    };


    undoBtn.disabled =
        false;

}


/* =====================================================
   CLEAR EDITORS
   ===================================================== */

function clearEditor() {

    createClearSnapshot();


    htmlCode.value =
        "";

    cssCode.value =
        "";

    jsCode.value =
        "";


    showToast(
        "Editors cleared. Press Undo to restore.",
        "info"
    );

}


/* =====================================================
   UNDO CLEAR
   ===================================================== */

function undoClear() {

    if (!clearSnapshot) {

        return;

    }


    htmlCode.value =
        clearSnapshot.html;

    cssCode.value =
        clearSnapshot.css;

    jsCode.value =
        clearSnapshot.js;


    clearSnapshot =
        null;


    undoBtn.disabled =
        true;


    showToast(
        "Previous code restored.",
        "success"
    );

}


/* =====================================================
   CLEAR / UNDO EVENTS
   ===================================================== */

clearBtn.addEventListener(
    "click",
    clearEditor
);


undoBtn.addEventListener(
    "click",
    undoClear
);


/* =====================================================
   RUN EVENT
   ===================================================== */

runBtn.addEventListener(
    "click",
    runCode
);
/* =====================================================
   CODEXA — SCRIPT.JS PART 3/4
   SAVE + DOWNLOAD + PREVIEW + NAVIGATION
   ===================================================== */


/* =====================================================
   SAVE PROJECT
   ===================================================== */

async function saveProject() {

    if (!currentUser) {

        showToast(
            "Please login first.",
            "error"
        );

        return;

    }


    let projectName =
        projectNameInput.value.trim();


    if (!projectName) {

        projectName =
            "Untitled Project";

        projectNameInput.value =
            projectName;

    }


    saveBtn.disabled = true;

    saveBtn.textContent =
        activeProjectId
            ? "Updating..."
            : "Saving...";


    try {

        if (activeProjectId) {

            const {
                error
            } =
                await supabaseClient
                    .from("projects")
                    .update({

                        project_name:
                            projectName,

                        html_code:
                            htmlCode.value,

                        css_code:
                            cssCode.value,

                        js_code:
                            jsCode.value,

                        updated_at:
                            new Date().toISOString()

                    })
                    .eq(
                        "id",
                        activeProjectId
                    )
                    .eq(
                        "user_id",
                        currentUser.id
                    );


            if (error) {
                throw error;
            }


            showToast(
                "Project updated successfully.",
                "success"
            );


        } else {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("projects")
                    .insert({

                        user_id:
                            currentUser.id,

                        project_name:
                            projectName,

                        html_code:
                            htmlCode.value,

                        css_code:
                            cssCode.value,

                        js_code:
                            jsCode.value

                    })
                    .select()
                    .single();


            if (error) {
                throw error;
            }


            if (data) {

                activeProjectId =
                    data.id;

            }


            showOpenedProjectBar(
                projectName
            );


            showToast(
                "Project saved successfully.",
                "success"
            );

        }


    } catch (error) {

        console.error(
            "Save project error:",
            error
        );


        showToast(
            error.message ||
            "Unable to save project.",
            "error"
        );


    } finally {

        saveBtn.disabled = false;

        saveBtn.textContent =
            activeProjectId
                ? "Update Project"
                : "Save Project";

    }

}


/* =====================================================
   SAVE EVENT
   ===================================================== */

saveBtn.addEventListener(
    "click",
    saveProject
);


/* =====================================================
   DOWNLOAD ZIP
   ===================================================== */

async function downloadProjectZip() {

    if (
        typeof JSZip ===
        "undefined"
    ) {

        showToast(
            "ZIP library is unavailable.",
            "error"
        );

        return;

    }


    const projectName =
        projectNameInput.value.trim() ||
        "Codexa Project";


    try {

        const zip =
            new JSZip();


        zip.file(
            "index.html",
            htmlCode.value
        );


        zip.file(
            "style.css",
            cssCode.value
        );


        zip.file(
            "script.js",
            jsCode.value
        );


        const blob =
            await zip.generateAsync({
                type: "blob"
            });


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;


        link.download =
            `${sanitizeFilename(
                projectName
            )}.zip`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(url);


        showToast(
            "ZIP downloaded successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "ZIP error:",
            error
        );


        showToast(
            "Unable to create ZIP file.",
            "error"
        );

    }

}


/* =====================================================
   DOWNLOAD EVENT
   ===================================================== */

downloadBtn.addEventListener(
    "click",
    function() {

        const projectName =
            projectNameInput.value.trim();


        if (!projectName) {

            showToast(
                "Please enter a project name first.",
                "error"
            );


            projectNameInput.focus();


            return;

        }


        downloadProjectZip();

    }
);


/* =====================================================
   SANITIZE FILE NAME
   ===================================================== */

function sanitizeFilename(name) {

    return name
        .replace(
            /[<>:"/\\|?*]/g,
            "_"
        )
        .replace(
            /\s+/g,
            "_"
        )
        .substring(
            0,
            100
        );

}


/* =====================================================
   PREVIEW TOGGLE
   ===================================================== */

function togglePreview() {

    const collapsed =
        previewCard.classList.toggle(
            "collapsed"
        );


    previewToggleBtn.setAttribute(
        "aria-expanded",
        String(!collapsed)
    );

}


/* =====================================================
   PREVIEW TOGGLE EVENT
   ===================================================== */

previewToggleBtn.addEventListener(
    "click",
    togglePreview
);


/* =====================================================
   FULLSCREEN PREVIEW
   ===================================================== */

function fullscreenPreview() {

    if (!preview) {
        return;
    }


    if (
        document.fullscreenElement
    ) {

        document.exitFullscreen();

        return;

    }


    if (
        preview.requestFullscreen
    ) {

        preview.requestFullscreen();

        return;

    }


    if (
        previewCard.requestFullscreen
    ) {

        previewCard.requestFullscreen();

    }

}


/* =====================================================
   FULLSCREEN EVENT
   ===================================================== */

fullscreenBtn.addEventListener(
    "click",
    fullscreenPreview
);


/* =====================================================
   BACK TO COMPILER
   ===================================================== */

function backToCompiler() {

    activeProjectId = null;

    clearSnapshot = null;


    projectNameInput.value = "";


    htmlCode.value =
        DEFAULT_HTML;

    cssCode.value =
        DEFAULT_CSS;

    jsCode.value =
        DEFAULT_JS;


    undoBtn.disabled = true;


    hideOpenedProjectBar();


    clearPreview();

    clearErrorConsole();


    showCompiler();


    showToast(
        "Back to compiler.",
        "info"
    );

}


/* =====================================================
   OPEN SAVED PROJECT
   ===================================================== */

async function openProject(project) {

    if (!project) {
        return;
    }


    activeProjectId =
        project.id;


    projectNameInput.value =
        project.project_name || "";


    htmlCode.value =
        project.html_code || "";


    cssCode.value =
        project.css_code || "";


    jsCode.value =
        project.js_code || "";


    clearSnapshot = null;

    undoBtn.disabled = true;


    showOpenedProjectBar(
        project.project_name ||
        "Saved Project"
    );


    clearPreview();

    clearErrorConsole();


    showCompiler();


    saveBtn.textContent =
        "Update Project";


    showToast(
        "Project opened.",
        "success"
    );

}


/* =====================================================
   BACK TO SAVED PROJECTS
   ===================================================== */

backToSavedProjectsFromCompiler.addEventListener(
    "click",
    function() {

        showSavedProjects();

    }
);


/* =====================================================
   PROJECT NAME CHANGE
   ===================================================== */

projectNameInput.addEventListener(
    "input",
    function() {

        /*
           Changing the name does not save
           anything automatically.
        */

    }
);
/* =====================================================
   CODEXA — SCRIPT.JS PART 4/4
   SAVED PROJECTS + DELETE + COPY + TOAST
   + CONFIRM + INITIALIZATION
   ===================================================== */


/* =====================================================
   LOAD SAVED PROJECTS
   ===================================================== */

async function loadSavedProjects() {

    if (!currentUser) {

        projectsGrid.innerHTML = `
            <div class="empty-projects">

                <h3>
                    Login Required
                </h3>

                <p>
                    Please login to view your saved projects.
                </p>

            </div>
        `;

        return;

    }


    projectsGrid.innerHTML = `
        <div class="empty-projects">

            <h3>
                Loading Projects...
            </h3>

            <p>
                Please wait.
            </p>

        </div>
    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("projects")
                .select("*")
                .eq(
                    "user_id",
                    currentUser.id
                )
                .order(
                    "updated_at",
                    {
                        ascending: false
                    }
                );


        if (error) {
            throw error;
        }


        renderSavedProjects(
            data || []
        );


    } catch (error) {

        console.error(
            "Load projects error:",
            error
        );


        projectsGrid.innerHTML = `
            <div class="empty-projects">

                <h3>
                    Unable to Load Projects
                </h3>

                <p>
                    ${escapeHtml(
                        error.message ||
                        "Something went wrong."
                    )}
                </p>

            </div>
        `;

    }

}


/* =====================================================
   RENDER SAVED PROJECTS
   ===================================================== */

function renderSavedProjects(
    projects
) {

    projectsGrid.innerHTML = "";


    if (!projects.length) {

        projectsGrid.innerHTML = `
            <div class="empty-projects">

                <h3>
                    No Saved Projects
                </h3>

                <p>
                    Create and save your first project
                    from the compiler.
                </p>

            </div>
        `;

        return;

    }


    projects.forEach(
        function(project) {

            const card =
                document.createElement("article");


            card.className =
                "project-card";


            const projectName =
                project.project_name ||
                "Untitled Project";


            const updated =
                formatProjectDate(
                    project.updated_at ||
                    project.created_at
                );


            card.innerHTML = `

                <h3>
                    ${escapeHtml(projectName)}
                </h3>

                <p>
                    Last updated: ${escapeHtml(updated)}
                </p>

                <div class="project-card-actions">

                    <button
                        type="button"
                        class="open-project-btn"
                    >
                        Open
                    </button>

                    <button
                        type="button"
                        class="copy-project-btn"
                    >
                        Copy
                    </button>

                    <button
                        type="button"
                        class="download-project-btn"
                    >
                        Download
                    </button>

                    <button
                        type="button"
                        class="delete-project-btn"
                    >
                        Delete
                    </button>

                </div>

            `;


            const openBtn =
                card.querySelector(
                    ".open-project-btn"
                );


            openBtn.addEventListener(
                "click",
                function() {

                    openProject(project);

                }
            );


            const copyBtn =
                card.querySelector(
                    ".copy-project-btn"
                );


            copyBtn.addEventListener(
                "click",
                function() {

                    copySavedProject(
                        project
                    );

                }
            );


            const downloadBtnProject =
                card.querySelector(
                    ".download-project-btn"
                );


            downloadBtnProject.addEventListener(
                "click",
                function() {

                    downloadSavedProject(
                        project
                    );

                }
            );


            const deleteBtn =
                card.querySelector(
                    ".delete-project-btn"
                );


            deleteBtn.addEventListener(
                "click",
                function() {

                    confirmDeleteProject(
                        project
                    );

                }
            );


            projectsGrid.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   FORMAT PROJECT DATE
   ===================================================== */

function formatProjectDate(
    dateValue
) {

    if (!dateValue) {

        return "Unknown date";

    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Unknown date";

    }


    return date.toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


/* =====================================================
   COPY SAVED PROJECT
   ===================================================== */

async function copySavedProject(
    project
) {

    const text = `

HTML
====

${project.html_code || ""}


CSS
===

${project.css_code || ""}


JavaScript
==========

${project.js_code || ""}

`;


    try {

        await navigator.clipboard.writeText(
            text
        );


        showToast(
            "Project code copied.",
            "success"
        );


    } catch (error) {

        console.error(
            "Copy project error:",
            error
        );


        showToast(
            "Unable to copy project.",
            "error"
        );

    }

}


/* =====================================================
   DOWNLOAD SAVED PROJECT
   ===================================================== */

async function downloadSavedProject(
    project
) {

    if (
        typeof JSZip ===
        "undefined"
    ) {

        showToast(
            "ZIP library is unavailable.",
            "error"
        );

        return;

    }


    try {

        const zip =
            new JSZip();


        zip.file(
            "index.html",
            project.html_code || ""
        );


        zip.file(
            "style.css",
            project.css_code || ""
        );


        zip.file(
            "script.js",
            project.js_code || ""
        );


        const blob =
            await zip.generateAsync({
                type: "blob"
            });


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;


        link.download =
            `${sanitizeFilename(
                project.project_name ||
                "Codexa Project"
            )}.zip`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(url);


        showToast(
            "Project ZIP downloaded.",
            "success"
        );


    } catch (error) {

        console.error(
            "Saved project download error:",
            error
        );


        showToast(
            "Unable to download project.",
            "error"
        );

    }

}


/* =====================================================
   CONFIRM DELETE PROJECT
   ===================================================== */

function confirmDeleteProject(
    project
) {

    const name =
        project.project_name ||
        "Untitled Project";


    openConfirm(
        "Delete Project",
        `Are you sure you want to delete "${name}"?`,
        async function() {

            await deleteProject(
                project.id
            );

        }
    );

}


/* =====================================================
   DELETE PROJECT
   ===================================================== */

async function deleteProject(
    projectId
) {

    if (!currentUser) {

        showToast(
            "Please login first.",
            "error"
        );

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("projects")
                .delete()
                .eq(
                    "id",
                    projectId
                )
                .eq(
                    "user_id",
                    currentUser.id
                );


        if (error) {
            throw error;
        }


        if (
            activeProjectId ===
            projectId
        ) {

            activeProjectId = null;

            clearSnapshot = null;

            projectNameInput.value = "";

            htmlCode.value =
                DEFAULT_HTML;

            cssCode.value =
                DEFAULT_CSS;

            jsCode.value =
                DEFAULT_JS;

            undoBtn.disabled = true;

            hideOpenedProjectBar();

            clearPreview();

            clearErrorConsole();

            saveBtn.textContent =
                "Save Project";

        }


        showToast(
            "Project deleted successfully.",
            "success"
        );


        await loadSavedProjects();


    } catch (error) {

        console.error(
            "Delete project error:",
            error
        );


        showToast(
            error.message ||
            "Unable to delete project.",
            "error"
        );

    }

}


/* =====================================================
   COPY EDITOR CODE
   ===================================================== */

async function copyCode(
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        showToast(
            "Code editor not found.",
            "error"
        );

        return;

    }


    try {

        await navigator.clipboard.writeText(
            element.value
        );


        showToast(
            "Code copied.",
            "success"
        );


    } catch (error) {

        console.error(
            "Copy error:",
            error
        );


        showToast(
            "Unable to copy code.",
            "error"
        );

    }

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHtml(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   TOAST
   ===================================================== */

function showToast(
    message,
    type = "info"
) {

    if (!toastContainer) {
        return;
    }


    const toast =
        document.createElement("div");


    toast.className =
        `toast ${type}`;


    toast.textContent =
        message;


    toastContainer.appendChild(
        toast
    );


    const duration =
        2800;


    setTimeout(
        function() {

            toast.classList.add(
                "hide"
            );


            setTimeout(
                function() {

                    toast.remove();

                },
                250
            );

        },
        duration
    );

}


/* =====================================================
   CONFIRM MODAL
   ===================================================== */

function openConfirm(
    title,
    message,
    callback
) {

    confirmTitle.textContent =
        title;

    confirmMessage.textContent =
        message;


    confirmCallback =
        callback;


    confirmOverlay.classList.add(
        "active"
    );


    confirmOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =====================================================
   CLOSE CONFIRM MODAL
   ===================================================== */

function closeConfirm() {

    confirmOverlay.classList.remove(
        "active"
    );


    confirmOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    confirmCallback = null;

}


/* =====================================================
   CONFIRM BUTTON
   ===================================================== */

confirmAction.addEventListener(
    "click",
    async function() {

        if (
            typeof confirmCallback !==
            "function"
        ) {

            closeConfirm();

            return;

        }


        const callback =
            confirmCallback;


        closeConfirm();


        try {

            await callback();

        } catch (error) {

            console.error(
                "Confirmation action error:",
                error
            );

        }

    }
);


/* =====================================================
   CANCEL BUTTON
   ===================================================== */

confirmCancel.addEventListener(
    "click",
    closeConfirm
);


/* =====================================================
   CLOSE CONFIRM ON BACKDROP
   ===================================================== */

confirmOverlay.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            confirmOverlay
        ) {

            closeConfirm();

        }

    }
);


/* =====================================================
   ESC KEY
   ===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeConfirm();

            closeMobileMenu();

        }

    }
);


/* =====================================================
   SUPABASE AUTH STATE
   ===================================================== */

supabaseClient.auth.onAuthStateChange(
    function(
        event,
        session
    ) {

        if (
            session &&
            session.user
        ) {

            currentUser =
                session.user;


            showApp();

        } else {

            currentUser = null;

            activeProjectId = null;


            if (splashFinished) {

                showAuthPage();

            }

        }

    }
);


/* =====================================================
   INITIALIZE CODEXA
   ===================================================== */

async function initializeCodexa() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {
            throw error;
        }


        if (
            data &&
            data.session &&
            data.session.user
        ) {

            currentUser =
                data.session.user;


            resetEditorState();


            showApp();

        } else {

            currentUser = null;


            showAuthPage();

        }


    } catch (error) {

        console.error(
            "Initialization error:",
            error
        );


        currentUser = null;

        showAuthPage();

    }

}


/* =====================================================
   INITIAL DEFAULT EDITOR VALUES
   ===================================================== */

function initializeEditors() {

    if (
        !htmlCode.value &&
        !cssCode.value &&
        !jsCode.value
    ) {

        htmlCode.value =
            DEFAULT_HTML;

        cssCode.value =
            DEFAULT_CSS;

        jsCode.value =
            DEFAULT_JS;

    }


    undoBtn.disabled = true;


    renderErrorConsole();

}


/* =====================================================
   INITIALIZE
   ===================================================== */

initializeEditors();

initializeCodexa();


/* =====================================================
   SPLASH FALLBACK
   ===================================================== */

setTimeout(
    function() {

        if (!splashFinished) {

            finishSplash();

        }

    },
    2200
);