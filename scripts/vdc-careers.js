/* ============================================================
   CAREERS — application form behaviour
   The form posts natively (multipart) to FormSubmit so a CV can
   travel as an attachment; this script only enhances it: role
   preselection, the dentist-only field, validation, the CV
   picker, and the thank-you state after FormSubmit redirects back.
   ============================================================ */
(function () {
  "use strict";

  const apply = document.getElementById("apply");
  const form = document.getElementById("vcar-form");
  if (!apply || !form) return;

  const MAX_BYTES = 5 * 1024 * 1024;
  const OK_EXT = /\.(pdf|doc|docx)$/i;
  const roleLabel = {
    assistant: "Dental Assistant & Receptionist",
    dentist: "Dentist (BDS / MDS)",
  };

  /* ---------- thank-you state after FormSubmit's redirect ---------- */
  const params = new URLSearchParams(window.location.search);
  if (params.get("applied") === "1") {
    apply.classList.add("is-done");
    requestAnimationFrame(() => apply.scrollIntoView({ block: "start" }));
    return;
  }

  /* ---------- role: preselect from the job cards ---------- */
  const radios = form.querySelectorAll('input[name="Role"]');
  function syncRole() {
    const picked = form.querySelector('input[name="Role"]:checked');
    form.classList.toggle("is-dentist", !!picked && picked.dataset.role === "dentist");
  }
  radios.forEach((r) => r.addEventListener("change", syncRole));
  syncRole();

  document.querySelectorAll("[data-apply-role]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = form.querySelector('input[data-role="' + btn.dataset.applyRole + '"]');
      if (target) { target.checked = true; syncRole(); }
      if (window.lenis) window.lenis.scrollTo(apply, { offset: -60 });
      else apply.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => { const n = form.querySelector('[name="Name"]'); if (n) n.focus({ preventScroll: true }); }, 700);
    });
  });

  /* ---------- CV picker ---------- */
  const fileWrap = form.querySelector(".vcar-file");
  const fileInput = form.querySelector('input[type="file"]');
  const fileTitle = form.querySelector(".vcar-file-text b");
  const fileSub = form.querySelector(".vcar-file-text span");
  const fileField = fileWrap ? fileWrap.closest(".vcar-field") : null;
  const defaultTitle = fileTitle ? fileTitle.textContent : "";
  const defaultSub = fileSub ? fileSub.textContent : "";

  function kb(n) { return n < 1024 * 1024 ? Math.round(n / 1024) + " KB" : (n / 1024 / 1024).toFixed(1) + " MB"; }

  function checkFile() {
    if (!fileInput) return true;
    const f = fileInput.files && fileInput.files[0];
    fileField.classList.remove("is-bad");
    if (!f) {
      fileWrap.classList.remove("has-file");
      fileTitle.textContent = defaultTitle; fileSub.textContent = defaultSub;
      return true;                         // a CV is optional
    }
    let msg = "";
    if (!OK_EXT.test(f.name)) msg = "Please attach a PDF or Word document.";
    else if (f.size > MAX_BYTES) msg = "That file is " + kb(f.size) + ". Please keep it under 5 MB.";
    if (msg) {
      fileField.classList.add("is-bad");
      fileField.querySelector(".vcar-err").textContent = msg;
      fileWrap.classList.remove("has-file");
      fileTitle.textContent = defaultTitle; fileSub.textContent = defaultSub;
      return false;
    }
    fileWrap.classList.add("has-file");
    fileTitle.textContent = f.name;
    fileSub.textContent = kb(f.size) + " · ready to send";
    return true;
  }
  if (fileInput) {
    fileInput.addEventListener("change", checkFile);
    ["dragenter", "dragover"].forEach((ev) => fileInput.addEventListener(ev, () => fileWrap.classList.add("is-drag")));
    ["dragleave", "drop"].forEach((ev) => fileInput.addEventListener(ev, () => fileWrap.classList.remove("is-drag")));
  }

  /* ---------- validation ---------- */
  const rules = {
    Name: (v) => v.trim().length >= 2 || "Please enter your full name.",
    Phone: (v) => /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(v.trim()) || "Please enter a 10-digit Indian mobile number.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address.",
    Qualification: (v) => v.trim().length >= 2 || "Please tell us your highest qualification.",
    Experience: (v) => v !== "" || "Please choose your experience.",
  };

  function fieldOf(el) { return el.closest(".vcar-field"); }

  function validateOne(name) {
    const el = form.elements[name];
    if (!el) return true;
    const res = rules[name](el.value);
    const field = fieldOf(el);
    if (res === true) { field.classList.remove("is-bad"); return true; }
    field.classList.add("is-bad");
    field.querySelector(".vcar-err").textContent = res;
    return false;
  }

  Object.keys(rules).forEach((name) => {
    const el = form.elements[name];
    if (!el) return;
    el.addEventListener("blur", () => { if (el.value) validateOne(name); });
    el.addEventListener("input", () => { if (fieldOf(el).classList.contains("is-bad")) validateOne(name); });
  });

  const consent = form.querySelector("#vcar-consent");
  const consentRow = consent ? consent.closest(".vcar-consent") : null;
  if (consent) consent.addEventListener("change", () => consentRow.classList.toggle("is-bad", !consent.checked));

  const roleSet = form.querySelector(".vcar-role-set");
  const roleErr = roleSet ? roleSet.querySelector(".vcar-err") : null;

  /* ---------- submit ---------- */
  const submit = form.querySelector(".vcar-submit");

  form.addEventListener("submit", (e) => {
    // Never post applicants' details to an unconfigured address.
    if (/REPLACE_WITH/i.test(form.getAttribute("action") || "")) {
      e.preventDefault();
      alert("The application form has not been connected to an inbox yet. Please call or WhatsApp 92868 98353 to apply.");
      return;
    }

    let firstBad = null;
    const picked = form.querySelector('input[name="Role"]:checked');
    if (!picked) {
      roleSet.classList.add("is-bad");
      if (roleErr) roleErr.style.display = "block";
      firstBad = firstBad || roleSet;
    } else if (roleErr) {
      roleSet.classList.remove("is-bad");
      roleErr.style.display = "none";
    }
    Object.keys(rules).forEach((name) => {
      if (!validateOne(name) && !firstBad) firstBad = form.elements[name];
    });
    if (!checkFile() && !firstBad) firstBad = fileInput;
    if (consent && !consent.checked) {
      consentRow.classList.add("is-bad");
      firstBad = firstBad || consent;
    }

    if (firstBad) {
      e.preventDefault();
      const top = (firstBad.closest(".vcar-field, .vcar-fieldset, .vcar-consent") || firstBad);
      top.scrollIntoView({ behavior: "smooth", block: "center" });
      if (firstBad.focus) setTimeout(() => firstBad.focus({ preventScroll: true }), 400);
      return;
    }

    // A readable subject line, and a way back to this page afterwards.
    const name = form.elements.Name.value.trim();
    form.elements._subject.value = "New application: " + roleLabel[picked.dataset.role] + " — " + name;
    const back = new URL(window.location.href);
    back.search = "?applied=1"; back.hash = "apply";
    form.elements._next.value = back.toString();

    submit.disabled = true;
    submit.querySelector("span").textContent = "Sending your application…";
  });
})();
