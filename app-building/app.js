const app = document.querySelector("#app");

const SESSION_KEY = "pb-session";
const USERS_KEY = "pb-users";
const PROFILE_KEY = "pb-profile";

const BASE_COURSES = [
  "Calculus I",
  "Calculus II",
  "Linear Algebra",
  "Statistics",
  "Probability",
  "Discrete Mathematics",
  "Differential Equations",
  "Numerical Methods",
];

const SAMPLE_BIO = "I'm a first year cs student. I struggle with maths";

const SEEDED_CONTEXT = "Calculus I";
const SEEDED_FILES = [
  "Calculus I – Lecture 3: Derivatives.pdf",
  "Calculus I – Lecture 4: Applications of derivatives.pdf",
];

const state = {
  screen: "boot",
  bio: SAMPLE_BIO,
  courses: ["Calculus I"],
  extraCourses: [],
  none: false,
  draftCourse: "",
  emailDraft: "",
  masterEmail: null,
  masterNotice: "",
  seeded: false,
};

function currentEmail() {
  return localStorage.getItem(SESSION_KEY);
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
}

function readProfile() {
  const email = currentEmail();
  if (email) {
    return readUsers()[email]?.profile || null;
  }
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY));
  } catch {
    return null;
  }
}

function writeProfile(profile) {
  const email = currentEmail();
  if (email) {
    const users = readUsers();
    users[email] = { ...(users[email] || {}), profile };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return;
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function courseNames() {
  return [...BASE_COURSES, ...state.extraCourses, "None of these"];
}

function isSelected(name) {
  if (name === "None of these") return state.none;
  return !state.none && state.courses.includes(name);
}

function greetingText() {
  if (state.courses.length === 0) {
    return "Hi! I will start from the beginning.";
  }
  const names = state.courses;
  const listed =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return `Hi! You have already taken ${listed}, so I will not start from zero.`;
}

function applySaved(profile) {
  state.bio = profile.bio;
  state.courses = profile.courses.filter((name) => name !== "None of these");
  state.none = state.courses.length === 0;
  state.extraCourses = state.courses.filter((name) => !BASE_COURSES.includes(name));
  state.draftCourse = "";
}

function isMaster(email) {
  return Boolean(state.masterEmail) && email === state.masterEmail;
}

function resetProfileDraft() {
  state.bio = SAMPLE_BIO;
  state.courses = ["Calculus I"];
  state.extraCourses = [];
  state.none = false;
  state.draftCourse = "";
}

function ensureMasterSeed(email) {
  const users = readUsers();
  const user = { ...(users[email] || {}) };
  const contexts = Array.isArray(user.contexts)
    ? user.contexts.map((context) => ({
        ...context,
        files: [...(context.files || [])],
        topics: context.topics || [],
      }))
    : [];
  let context = contexts.find((item) => item.name === SEEDED_CONTEXT);
  if (!context) {
    context = { name: SEEDED_CONTEXT, files: [...SEEDED_FILES], topics: [] };
    contexts.unshift(context);
  } else {
    for (const name of SEEDED_FILES) {
      if (!context.files.includes(name)) context.files.push(name);
    }
  }
  user.contexts = contexts;
  users[email] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function seededContext() {
  const email = currentEmail();
  const contexts = readUsers()[email]?.contexts || [];
  return contexts.find((context) => context.name === SEEDED_CONTEXT) || null;
}

function openSaved(email) {
  if (isMaster(email)) {
    ensureMasterSeed(email);
    state.seeded = true;
    const profile = readUsers()[email]?.profile;
    if (profile) applySaved(profile);
    else resetProfileDraft();
    state.screen = "workspace";
    return;
  }
  state.seeded = false;
  const profile = readUsers()[email]?.profile || null;
  if (profile) {
    applySaved(profile);
    state.screen = "workspace";
    return;
  }
  resetProfileDraft();
  state.screen = "profile";
}

async function boot() {
  try {
    const response = await fetch("/master");
    if (!response.ok) {
      state.masterNotice = "The master login is not set.";
    } else {
      const data = await response.json();
      state.masterEmail = typeof data.email === "string" ? data.email : null;
      if (!state.masterEmail) state.masterNotice = "The master login is not set.";
    }
  } catch {
    state.masterNotice = "The master login is not set.";
  }
  const email = currentEmail();
  if (email) openSaved(email);
  else state.screen = "login";
  render();
}

function render() {
  if (state.screen === "boot") {
    app.innerHTML = "";
    return;
  }

  if (state.screen === "login") {
    const notice = state.masterNotice
      ? `<p class="notice">${escapeHtml(state.masterNotice)}</p>`
      : "";
    app.innerHTML = `
      <form class="login">
        <h1>Sign in</h1>
        ${notice}
        <div class="field">
          <label for="email">Email</label>
          <input class="text-input" id="email" name="email" type="text" autocomplete="username" value="${escapeHtml(state.emailDraft)}" />
        </div>
        <button class="primary" type="submit">Continue</button>
      </form>
    `;
    return;
  }

  if (state.screen === "workspace") {
    const context = state.seeded ? seededContext() : null;
    const files = (context?.files || [])
      .map((name) => `<li>${escapeHtml(name)}</li>`)
      .join("");
    const seed = context
      ? `
        <section class="seed">
          <p class="context-name">Context: ${escapeHtml(context.name)}</p>
          <h2>Course material</h2>
          <ul class="files">${files}</ul>
          <h2>Topics found</h2>
          <ul class="topics"></ul>
        </section>
      `
      : "";
    const greeting = readProfile()
      ? `<p class="greeting">${escapeHtml(greetingText())}</p>`
      : "";
    app.innerHTML = `
      <header class="header">
        <button class="profile-button" type="button" data-action="edit-profile">Profile</button>
      </header>
      ${seed}
      ${greeting}
    `;
    return;
  }

  const chips = courseNames()
    .map(
      (name) => `
        <li>
          <button class="chip" type="button" data-action="toggle-course" data-course="${escapeHtml(name)}" aria-pressed="${isSelected(name)}">${escapeHtml(name)}</button>
        </li>
      `,
    )
    .join("");

  app.innerHTML = `
    <form class="profile">
      <h1>Hey, ready to study?</h1>
      <p class="lede">Tell us a little about you, so the help can start at the right place.</p>
      <div class="field">
        <label for="about">About you</label>
        <textarea id="about" name="about">${escapeHtml(state.bio)}</textarea>
      </div>
      <p class="courses-label" id="courses-label">Math courses you took before</p>
      <ul class="chips" aria-labelledby="courses-label">${chips}</ul>
      <div class="add-row">
        <input class="text-input" id="new-course" type="text" placeholder="Add another course" value="${escapeHtml(state.draftCourse)}" />
        <button class="secondary" type="button" data-action="add-course">Add</button>
      </div>
      <button class="primary" type="submit">Continue</button>
    </form>
  `;
}

function toggleCourse(name) {
  if (name === "None of these") {
    state.none = true;
    state.courses = [];
    return;
  }
  state.none = false;
  if (state.courses.includes(name)) {
    state.courses = state.courses.filter((course) => course !== name);
    if (state.courses.length === 0) state.none = true;
    return;
  }
  state.courses = [...state.courses, name];
}

function addCourse() {
  const input = document.querySelector("#new-course");
  const name = input.value.trim();
  state.bio = document.querySelector("#about").value;
  state.draftCourse = "";
  if (!name || name === "None of these" || courseNames().includes(name)) {
    render();
    return;
  }
  state.extraCourses = [...state.extraCourses, name];
  state.none = false;
  state.courses = [...state.courses, name];
  render();
}

function rememberFields() {
  const about = document.querySelector("#about");
  const draft = document.querySelector("#new-course");
  if (about) state.bio = about.value;
  if (draft) state.draftCourse = draft.value;
}

app.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "toggle-course") {
    rememberFields();
    toggleCourse(button.dataset.course);
    render();
  }
  if (action === "add-course") addCourse();
  if (action === "edit-profile") {
    state.screen = "profile";
    render();
  }
});

app.addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.screen === "login") {
    const input = document.querySelector("#email");
    state.emailDraft = input.value;
    const email = input.value.trim();
    if (!email) return;
    localStorage.setItem(SESSION_KEY, email);
    if (!readUsers()[email]) {
      const users = readUsers();
      users[email] = {};
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    openSaved(email);
    render();
    return;
  }
  state.bio = document.querySelector("#about").value;
  const profile = { bio: state.bio, courses: [...state.courses] };
  writeProfile(profile);
  state.seeded = isMaster(currentEmail());
  state.screen = "workspace";
  render();
});

boot();
