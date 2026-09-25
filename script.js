/* =====================================================
   CODEXA — JAVASCRIPT PART 1/3
   SUPABASE + AUTH + COMPILER CORE
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
   DOM ELEMENTS
   ===================================================== */

const authPage =
    document.getElementById("authPage");

const appShell =
    document.getElementById("appShell");


const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginBtn =
    document.getElementById("loginBtn");

const loginMessage =
    document.getElementById("loginMessage");

const showSignupBtn =
    document.getElementById("showSignupBtn");


const signupForm =
    document.getElementById("signupForm");

const signupEmail =
    document.getElementById("signupEmail");

const signupPassword =
    document.getElementById("signupPassword");

const signupPasswordConfirm =
    document.getElementById("signupPasswordConfirm");

const signupBtn =
    document.getElementById("signupBtn");

const signupMessage =
    document.getElementById("signupMessage");

const showLoginBtn =
    document.getElementById("showLoginBtn");


const savedProjectsBtn =
    document.getElementById("savedProjectsBtn");

const saveBtn =
    document.getElementById("saveBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const clearBtn =
    document.getElementById("clearBtn");

const runBtn =
    document.getElementById("runBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


const compilerPage =
    document.getElementById("compilerPage");

const projectNameInput =
    document.getElementById("projectNameInput");

const openedProjectBar =
    document.getElementById("openedProjectBar");

const openedProjectText =
    document.getElementById("openedProjectText");

const backToSavedProjectsFromCompiler =
    document.getElementById(
        "backToSavedProjectsFromCompiler"
    );


const preview =
    document.getElementById("preview");

const htmlCode =
    document.getElementById("htmlCode");

const cssCode =
    document.getElementById("cssCode");

const jsCode =
    document.getElementById("jsCode");


const savedProjectsPage =
    document.getElementById(
        "savedProjectsPage"
    );

const backToCompilerBtn =
    document.getElementById(
        "backToCompilerBtn"
    );

const projectsGrid =
    document.getElementById("projectsGrid");


const fullscreenBtn =
    document.getElementById("fullscreenBtn");

const toastContainer =
    document.getElementById("toastContainer");


const confirmOverlay =
    document.getElementById("confirmOverlay");

const confirmTitle =
    document.getElementById("confirmTitle");

const confirmMessage =
    document.getElementById("confirmMessage");

const confirmCancel =
    document.getElementById("confirmCancel");

const confirmAction =
    document.getElementById("confirmAction");


/* =====================================================
   GLOBAL STATE
   ===================================================== */

let currentUser = null;
let currentSession = null;
let activeProjectId = null;
let confirmCallback = null;


/* =====================================================
   AUTH / APP VISIBILITY
   ===================================================== */

function showAuthPage() {

    authPage.classList.add("active");

    appShell.classList.remove("active");

    showLoginForm();

}


function showApp() {

    authPage.classList.remove("active");

    appShell.classList.add("active");

    showCompilerPage();

}


/* =====================================================
   AUTH FORM SWITCHING
   ===================================================== */

function showLoginForm() {

    loginForm.classList.remove(
        "hidden-auth"
    );

    signupForm.classList.add(
        "hidden-auth"
    );

    clearAuthMessages();

}


function showSignupForm() {

    loginForm.classList.add(
        "hidden-auth"
    );

    signupForm.classList.remove(
        "hidden-auth"
    );

    clearAuthMessages();

}


function clearAuthMessages() {

    loginMessage.textContent = "";
    signupMessage.textContent = "";

    loginMessage.className =
        "auth-message";

    signupMessage.className =
        "auth-message";

}


/* =====================================================
   AUTH MESSAGES
   ===================================================== */

function showLoginMessage(
    message,
    type = "error"
) {

    loginMessage.textContent =
        message;

    loginMessage.className =
        "auth-message " + type;

}


function showSignupMessage(
    message,
    type = "error"
) {

    signupMessage.textContent =
        message;

    signupMessage.className =
        "auth-message " + type;

}


/* =====================================================
   BUTTON LOADING
   ===================================================== */

function setButtonLoading(
    button,
    loading,
    normalText
) {

    if (!button) return;

    button.disabled =
        loading;

    button.textContent =
        loading
            ? "Please wait..."
            : normalText;

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

        showLoginMessage(
            "Please enter your email and password."
        );

        return;
    }


    showLoginMessage(
        "Logging in...",
        "loading"
    );


    setButtonLoading(
        loginBtn,
        true,
        "Login"
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email,
                password

            });


        if (error) {

            showLoginMessage(
                error.message
            );

            return;
        }


        if (!data.session) {

            showLoginMessage(
                "Please confirm your email before logging in."
            );

            return;
        }


        currentSession =
            data.session;

        currentUser =
            data.user;


        loginPassword.value = "";


        showApp();


        showToast(
            "Welcome Back",
            "You are now logged into Codexa.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Login Error:",
            error
        );

        showLoginMessage(
            "Something went wrong. Please try again."
        );

    }

    finally {

        setButtonLoading(
            loginBtn,
            false,
            "Login"
        );

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

        showSignupMessage(
            "Please fill in all fields."
        );

        return;
    }


    if (password !== confirmPassword) {

        showSignupMessage(
            "Passwords do not match."
        );

        return;
    }


    if (password.length < 6) {

        showSignupMessage(
            "Password must be at least 6 characters."
        );

        return;
    }


    showSignupMessage(
        "Creating your account...",
        "loading"
    );


    setButtonLoading(
        signupBtn,
        true,
        "Create Account"
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.signUp({

                email,
                password

            });


        if (error) {

            showSignupMessage(
                error.message
            );

            return;
        }


        if (!data.session) {

            showSignupMessage(
                "Account created. Check your email to confirm your account.",
                "success"
            );

            signupPassword.value = "";
            signupPasswordConfirm.value = "";

            return;
        }


        currentSession =
            data.session;

        currentUser =
            data.user;


        showApp();


        showToast(
            "Account Created",
            "Welcome to Codexa.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Signup Error:",
            error
        );

        showSignupMessage(
            "Something went wrong. Please try again."
        );

    }

    finally {

        setButtonLoading(
            signupBtn,
            false,
            "Create Account"
        );

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

            showToast(
                "Logout Failed",
                error.message,
                "error"
            );

            return;
        }


        currentUser = null;
        currentSession = null;
        activeProjectId = null;


        showAuthPage();


        showToast(
            "Logged Out",
            "You have been logged out of Codexa.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Logout Error:",
            error
        );

    }

}


/* =====================================================
   AUTH STATE
   ===================================================== */

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        currentSession =
            session || null;

        currentUser =
            session
                ? session.user
                : null;


        if (session) {

            showApp();

        }

        else {

            showAuthPage();

        }

    }
);


/* =====================================================
   COMPILER PAGE
   ===================================================== */

function showCompilerPage() {

    compilerPage.style.display =
        "block";

    savedProjectsPage.style.display =
        "none";

}


/* =====================================================
   PREVIEW
   ===================================================== */

function buildPreview() {

    if (
        !preview ||
        !htmlCode ||
        !cssCode ||
        !jsCode
    ) {
        return;
    }


    const html =
        htmlCode.value;

    const css =
        cssCode.value;

    const js =
        jsCode.value;


    const documentContent = `
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
${js}
<\/script>

</body>
</html>
`;


    preview.srcdoc =
        documentContent;

}


/* =====================================================
   RUN
   ===================================================== */

function runProject() {

    buildPreview();


    showToast(
        "Project Running",
        "Your code has been loaded into the live preview.",
        "success"
    );

}


/* =====================================================
   LIVE PREVIEW
   ===================================================== */

htmlCode.addEventListener(
    "input",
    buildPreview
);

cssCode.addEventListener(
    "input",
    buildPreview
);

jsCode.addEventListener(
    "input",
    buildPreview
);


/* =====================================================
   SAVE PROJECT
   ===================================================== */

async function saveCurrentProject() {

    if (!currentUser) {

        showToast(
            "Login Required",
            "Please login before saving a project.",
            "error"
        );

        showAuthPage();

        return;
    }


    const projectName =
        projectNameInput.value.trim();


    if (!projectName) {

        showToast(
            "Project Name Required",
            "Please enter a project name first.",
            "error"
        );

        projectNameInput.focus();

        return;
    }


    const projectData = {

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

    };


    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";


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


            openedProjectBar.style.display =
                "flex";

            openedProjectText.textContent =
                "Saved project is currently open: " +
                projectName;


            showToast(
                "Project Updated",
                `"${projectName}" has been updated.`,
                "success"
            );

        }

        else {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("projects")
                    .insert([
                        projectData
                    ])
                    .select()
                    .single();


            if (error) {
                throw error;
            }


            activeProjectId =
                data?.id || null;


            openedProjectBar.style.display =
                "flex";

            openedProjectText.textContent =
                "Saved project is currently open: " +
                projectName;


            showToast(
                "Project Saved",
                `"${projectName}" has been saved to your Codexa cloud.`,
                "success"
            );

        }

    }

    catch (error) {

        console.error(
            "Save Project Error:",
            error
        );


        showToast(
            "Save Failed",
            error.message ||
            "Unable to save the project.",
            "error"
        );

    }

    finally {

        saveBtn.disabled = false;
        saveBtn.textContent = "Save Project";

    }

}


/* =====================================================
   TOAST
   ===================================================== */

function showToast(
    title,
    message,
    type = "success"
) {

    if (!toastContainer) return;


    const toast =
        document.createElement("div");

    toast.className =
        "toast " + type;


    const icon =
        document.createElement("div");

    icon.className =
        "toast-icon";

    icon.textContent =
        type === "error"
            ? "!"
            : "✓";


    const content =
        document.createElement("div");

    content.className =
        "toast-content";


    const toastTitle =
        document.createElement("div");

    toastTitle.className =
        "toast-title";

    toastTitle.textContent =
        title;


    const toastMessage =
        document.createElement("div");

    toastMessage.className =
        "toast-message";

    toastMessage.textContent =
        message;


    const close =
        document.createElement("button");

    close.type = "button";
    close.className = "toast-close";
    close.textContent = "×";


    content.appendChild(
        toastTitle
    );

    content.appendChild(
        toastMessage
    );


    toast.appendChild(icon);
    toast.appendChild(content);
    toast.appendChild(close);


    toastContainer.appendChild(
        toast
    );


    close.addEventListener(
        "click",
        () => removeToast(toast)
    );


    setTimeout(
        () => removeToast(toast),
        4500
    );

}


function removeToast(toast) {

    if (!toast) return;


    toast.classList.add(
        "toast-hide"
    );


    setTimeout(
        () => {

            if (toast.parentNode) {

                toast.parentNode.removeChild(
                    toast
                );

            }

        },
        300
    );

}
/* =====================================================
   CODEXA — JAVASCRIPT PART 2/3
   CONFIRM + SAVED PROJECTS + CLEAR
   ===================================================== */


/* =====================================================
   CONFIRMATION
   ===================================================== */

function showConfirm(
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


function hideConfirm() {

    confirmOverlay.classList.remove(
        "active"
    );

    confirmOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    confirmCallback =
        null;

}


confirmCancel.addEventListener(
    "click",
    hideConfirm
);


confirmAction.addEventListener(
    "click",
    async () => {

        if (
            typeof confirmCallback ===
            "function"
        ) {

            const callback =
                confirmCallback;

            hideConfirm();

            await callback();

        }

        else {

            hideConfirm();

        }

    }
);


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            confirmOverlay.classList.contains("active")
        ) {

            hideConfirm();

        }

    }
);


/* =====================================================
   SHOW SAVED PROJECTS
   ===================================================== */

async function showSavedProjects() {

    if (!currentUser) {

        showToast(
            "Login Required",
            "Please login to view your saved projects.",
            "error"
        );

        showAuthPage();

        return;
    }


    compilerPage.style.display =
        "none";

    savedProjectsPage.style.display =
        "block";


    await loadSavedProjects();

}


/* =====================================================
   LOAD SAVED PROJECTS
   ===================================================== */

async function loadSavedProjects() {

    if (!currentUser) {

        projectsGrid.innerHTML =
            "";

        return;
    }


    projectsGrid.innerHTML = `
        <div class="projects-loading">
            Loading your projects...
        </div>
    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("projects")
                .select(
                    "id, user_id, project_name, html_code, css_code, js_code, created_at, updated_at"
                )
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

    }

    catch (error) {

        console.error(
            "Load Projects Error:",
            error
        );


        projectsGrid.innerHTML = `
            <div class="projects-empty">

                <h3>
                    Unable to load projects
                </h3>

                <p>
                    ${escapeHtml(
                        error.message ||
                        "Something went wrong."
                    )}
                </p>

            </div>
        `;


        showToast(
            "Load Failed",
            error.message ||
            "Unable to load your projects.",
            "error"
        );

    }

}


/* =====================================================
   RENDER SAVED PROJECTS
   ===================================================== */

function renderSavedProjects(
    projects
) {

    projectsGrid.innerHTML =
        "";


    if (!projects.length) {

        projectsGrid.innerHTML = `
            <div class="projects-empty">

                <div class="empty-project-icon">
                    +
                </div>

                <h3>
                    No Saved Projects
                </h3>

                <p>
                    Your saved Codexa projects will appear here.
                </p>

                <button
                    type="button"
                    class="empty-project-btn"
                    onclick="createNewProject()"
                >
                    Create New Project
                </button>

            </div>
        `;

        return;
    }


    projects.forEach(
        (project) => {

            projectsGrid.appendChild(
                createProjectCard(project)
            );

        }
    );

}


/* =====================================================
   PROJECT CARD
   ===================================================== */

function createProjectCard(
    project
) {

    const card =
        document.createElement("article");

    card.className =
        "project-card";


    const name =
        project.project_name ||
        "Untitled Project";


    const updated =
        formatProjectDate(
            project.updated_at ||
            project.created_at
        );


    card.innerHTML = `

        <div class="project-card-top">

            <div class="project-card-icon">
                C
            </div>

            <div class="project-card-info">

                <h3>
                    ${escapeHtml(name)}
                </h3>

                <span>
                    Updated ${escapeHtml(updated)}
                </span>

            </div>

        </div>


        <div class="project-card-preview">

            <div class="mini-preview-line long"></div>
            <div class="mini-preview-line medium"></div>
            <div class="mini-preview-line short"></div>

        </div>


        <div class="project-card-actions">

            <button
                type="button"
                class="project-open-btn"
            >
                Open
            </button>

            <button
                type="button"
                class="project-download-btn"
            >
                ZIP
            </button>

            <button
                type="button"
                class="project-delete-btn"
            >
                Delete
            </button>

        </div>

    `;


    card.querySelector(
        ".project-open-btn"
    ).addEventListener(
        "click",
        () => openSavedProject(project)
    );


    card.querySelector(
        ".project-download-btn"
    ).addEventListener(
        "click",
        () => downloadSavedProject(project)
    );


    card.querySelector(
        ".project-delete-btn"
    ).addEventListener(
        "click",
        () => confirmDeleteProject(project)
    );


    return card;

}


/* =====================================================
   OPEN PROJECT
   ===================================================== */

function openSavedProject(
    project
) {

    if (!project) {

        showToast(
            "Project Error",
            "The selected project could not be opened.",
            "error"
        );

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


    openedProjectBar.style.display =
        "flex";


    openedProjectText.textContent =
        "Saved project is currently open: " +
        (
            project.project_name ||
            "Untitled Project"
        );


    showCompilerPage();

    buildPreview();


    showToast(
        "Project Opened",
        `"${project.project_name || "Untitled Project"}" is now open.`,
        "success"
    );

}


/* =====================================================
   DELETE CONFIRMATION
   ===================================================== */

function confirmDeleteProject(
    project
) {

    if (!project) return;


    const projectName =
        project.project_name ||
        "Untitled Project";


    showConfirm(
        "Delete Project",
        `Are you sure you want to delete "${projectName}"? This action cannot be undone.`,
        async () => {

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
            "Login Required",
            "Please login again.",
            "error"
        );

        return;
    }


    if (!projectId) {

        showToast(
            "Delete Failed",
            "Invalid project ID.",
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

            resetCompiler();

        }


        showToast(
            "Project Deleted",
            "The project has been removed from your cloud storage.",
            "success"
        );


        await loadSavedProjects();

    }

    catch (error) {

        console.error(
            "Delete Project Error:",
            error
        );


        showToast(
            "Delete Failed",
            error.message ||
            "Unable to delete the project.",
            "error"
        );

    }

}


/* =====================================================
   CLEAR EDITOR
   ===================================================== */

function clearEditor() {

    htmlCode.value = "";
    cssCode.value = "";
    jsCode.value = "";


    buildPreview();


    showToast(
        "Editor Cleared",
        "All editor code has been cleared.",
        "success"
    );

}


clearBtn.addEventListener(
    "click",
    () => {

        showConfirm(
            "Clear Editor",
            "Are you sure you want to clear all HTML, CSS and JavaScript code?",
            clearEditor
        );

    }
);


/* =====================================================
   CREATE NEW PROJECT
   ===================================================== */

function createNewProject() {

    resetCompiler();

    showCompilerPage();


    showToast(
        "New Project",
        "A new blank project is ready.",
        "success"
    );

}


/* =====================================================
   RESET COMPILER
   ===================================================== */

function resetCompiler() {

    activeProjectId =
        null;


    projectNameInput.value =
        "";

    htmlCode.value =
        "";

    cssCode.value =
        "";

    jsCode.value =
        "";


    openedProjectBar.style.display =
        "none";


    openedProjectText.textContent =
        "Saved project is currently open.";


    buildPreview();

}


/* =====================================================
   FORMAT DATE
   ===================================================== */

function formatProjectDate(
    dateValue
) {

    if (!dateValue) {
        return "Unknown";
    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Unknown";
    }


    return date.toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
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
   PROJECT NAME ENTER
   ===================================================== */

projectNameInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            saveCurrentProject();

        }

    }
);


/* =====================================================
   AUTH ENTER
   ===================================================== */

loginPassword.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            loginUser();

        }

    }
);


signupPasswordConfirm.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            signupUser();

        }

    }
);


/* =====================================================
   AUTH EVENTS
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


logoutBtn.addEventListener(
    "click",
    () => {

        showConfirm(
            "Logout",
            "Are you sure you want to logout from Codexa?",
            logoutUser
        );

    }
);


/* =====================================================
   APP EVENTS
   ===================================================== */

runBtn.addEventListener(
    "click",
    runProject
);


saveBtn.addEventListener(
    "click",
    saveCurrentProject
);


savedProjectsBtn.addEventListener(
    "click",
    showSavedProjects
);


backToSavedProjectsFromCompiler.addEventListener(
    "click",
    showSavedProjects
);


backToCompilerBtn.addEventListener(
    "click",
    showCompilerPage
);
/* =====================================================
   CODEXA — JAVASCRIPT PART 3/3
   DOWNLOAD + COPY + FULLSCREEN + INIT
   ===================================================== */


/* =====================================================
   SANITIZE FILE NAME
   ===================================================== */

function sanitizeFilename(
    name
) {

    return String(
        name || "codexa-project"
    )
        .trim()
        .replace(
            /[<>:"/\\|?*\x00-\x1F]/g,
            ""
        )
        .replace(
            /\s+/g,
            "-"
        )
        .replace(
            /-+/g,
            "-"
        )
        .replace(
            /^[-.]+|[-.]+$/g,
            ""
        )
        .slice(
            0,
            80
        )
        ||
        "codexa-project";

}


/* =====================================================
   CREATE ZIP
   ===================================================== */

async function createProjectZip(
    project
) {

    if (
        typeof JSZip ===
        "undefined"
    ) {

        throw new Error(
            "JSZip library is not available."
        );

    }


    const zip =
        new JSZip();


    const projectName =
        project.project_name ||
        "codexa-project";


    const folder =
        zip.folder(
            sanitizeFilename(projectName)
        );


    folder.file(
        "index.html",
        project.html_code || ""
    );


    folder.file(
        "style.css",
        project.css_code || ""
    );


    folder.file(
        "script.js",
        project.js_code || ""
    );


    folder.file(
        "README.txt",
        `Codexa Project
================

Project: ${projectName}

Files:
- index.html
- style.css
- script.js

Created with Codexa — Build • Run • Create
`
    );


    return await zip.generateAsync({
        type: "blob"
    });

}


/* =====================================================
   DOWNLOAD CURRENT PROJECT
   ===================================================== */

async function downloadCurrentProject() {

    const projectName =
        projectNameInput.value.trim();


    if (!projectName) {

        showToast(
            "Project Name Required",
            "Please enter a project name before downloading.",
            "error"
        );

        projectNameInput.focus();

        return;
    }


    const project = {

        project_name:
            projectName,

        html_code:
            htmlCode.value,

        css_code:
            cssCode.value,

        js_code:
            jsCode.value

    };


    downloadBtn.disabled =
        true;

    downloadBtn.textContent =
        "Creating ZIP...";


    try {

        const blob =
            await createProjectZip(
                project
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement("a");


        link.href =
            url;


        link.download =
            sanitizeFilename(
                projectName
            ) + ".zip";


        document.body.appendChild(
            link
        );


        link.click();

        link.remove();


        setTimeout(
            () => {

                URL.revokeObjectURL(
                    url
                );

            },
            1000
        );


        showToast(
            "ZIP Downloaded",
            `"${projectName}" has been packaged successfully.`,
            "success"
        );

    }

    catch (error) {

        console.error(
            "Download Error:",
            error
        );


        showToast(
            "Download Failed",
            error.message ||
            "Unable to create the ZIP file.",
            "error"
        );

    }

    finally {

        downloadBtn.disabled =
            false;

        downloadBtn.textContent =
            "Download ZIP";

    }

}


/* =====================================================
   DOWNLOAD SAVED PROJECT
   ===================================================== */

async function downloadSavedProject(
    project
) {

    if (!project) {

        showToast(
            "Download Failed",
            "Project data is unavailable.",
            "error"
        );

        return;
    }


    try {

        const blob =
            await createProjectZip(
                project
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement("a");


        link.href =
            url;


        link.download =
            sanitizeFilename(
                project.project_name ||
                "codexa-project"
            ) + ".zip";


        document.body.appendChild(
            link
        );


        link.click();

        link.remove();


        setTimeout(
            () => {

                URL.revokeObjectURL(
                    url
                );

            },
            1000
        );


        showToast(
            "ZIP Downloaded",
            `"${project.project_name || "Project"}" has been downloaded.`,
            "success"
        );

    }

    catch (error) {

        console.error(
            "Saved Project Download Error:",
            error
        );


        showToast(
            "Download Failed",
            error.message ||
            "Unable to create the ZIP file.",
            "error"
        );

    }

}


/* =====================================================
   DOWNLOAD BUTTON
   ===================================================== */

downloadBtn.addEventListener(
    "click",
    downloadCurrentProject
);


/* =====================================================
   COPY CODE
   ===================================================== */

async function copyCode(
    targetId
) {

    const target =
        document.getElementById(
            targetId
        );


    if (!target) {

        showToast(
            "Copy Failed",
            "Code editor could not be found.",
            "error"
        );

        return;
    }


    const code =
        target.value || "";


    if (!code) {

        showToast(
            "Nothing to Copy",
            "This editor is currently empty.",
            "error"
        );

        return;
    }


    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                code
            );

        }

        else {

            target.focus();

            target.select();

            document.execCommand(
                "copy"
            );

            target.setSelectionRange(
                0,
                0
            );

        }


        showToast(
            "Copied",
            "Code copied to your clipboard.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Copy Error:",
            error
        );


        showToast(
            "Copy Failed",
            "Unable to copy the code.",
            "error"
        );

    }

}


/* =====================================================
   FULLSCREEN
   ===================================================== */

async function toggleFullscreen() {

    if (!preview) return;


    try {

        if (
            document.fullscreenElement
        ) {

            await document.exitFullscreen();

            return;
        }


        if (
            preview.requestFullscreen
        ) {

            await preview.requestFullscreen();

        }

        else {

            showToast(
                "Fullscreen Unavailable",
                "Fullscreen is not supported by this browser.",
                "error"
            );

        }

    }

    catch (error) {

        console.error(
            "Fullscreen Error:",
            error
        );


        showToast(
            "Fullscreen Failed",
            "Unable to open the preview in fullscreen.",
            "error"
        );

    }

}


fullscreenBtn.addEventListener(
    "click",
    toggleFullscreen
);


/* =====================================================
   FULLSCREEN TEXT
   ===================================================== */

document.addEventListener(
    "fullscreenchange",
    () => {

        fullscreenBtn.textContent =
            document.fullscreenElement
                ? "Exit Fullscreen"
                : "Fullscreen";

    }
);


/* =====================================================
   GITHUB
   ===================================================== */

const githubBtn =
    document.getElementById(
        "githubBtn"
    );


if (githubBtn) {

    githubBtn.addEventListener(
        "click",
        () => {

            /*
             * The HTML anchor handles
             * the GitHub navigation.
             */

        }
    );

}


/* =====================================================
   INITIALIZATION
   ===================================================== */

async function initializeCodexa() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Session Error:",
                error
            );

            showAuthPage();

            return;
        }


        if (
            data &&
            data.session
        ) {

            currentSession =
                data.session;

            currentUser =
                data.session.user;


            showApp();

            showCompilerPage();

        }

        else {

            currentSession =
                null;

            currentUser =
                null;


            showAuthPage();

        }

    }

    catch (error) {

        console.error(
            "Initialization Error:",
            error
        );


        showAuthPage();

    }

}


/* =====================================================
   INITIAL PREVIEW
   ===================================================== */

buildPreview();


/* =====================================================
   START CODEXA
   ===================================================== */

initializeCodexa();