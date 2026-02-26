# PATCH 004 — Form Input Validation

**Priority:** MEDIUM
**File:** `quiz_javascript.html`

## Simple Explanation

The forms only check whether the fields are empty. They don't validate the format of the input — an invalid email or a single-character phone number would be accepted and submitted. This patch adds client-side format checks: emails must contain `@` and a domain, phone numbers must have at least 10 digits, and names must be at least 2 characters. Users get a specific error message before anything is sent to the server.

---

## Problem

Both forms only check for empty fields. No format validation on email or phone. Users can submit `"asdf"` as an email or `"x"` as a phone number.

## Current Code

```javascript
// handleEmailSubmit — line 1364
if (!email || !name) {
    alert('Please fill in all required fields.');
    return;
}

// handlePhoneSubmit — line 1424
if (!phone || !name) {
    alert('Please fill in all required fields.');
    return;
}
```

## Patched Code

```javascript
// Add these validation helpers above the submit handlers

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    // Strip formatting, require at least 10 digits
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
}

function isValidName(name) {
    return name.trim().length >= 2;
}
```

```javascript
// handleEmailSubmit — replace the validation block
function handleEmailSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('emailInput').value.trim();
    const name = document.getElementById('nameInput').value.trim();
    const notes = document.getElementById('notesInput').value.trim();

    if (!isValidName(name)) {
        alert('Please enter your name (at least 2 characters).');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // ... rest of handler unchanged
}
```

```javascript
// handlePhoneSubmit — replace the validation block
function handlePhoneSubmit(e) {
    e.preventDefault();

    const phone = document.getElementById('phoneInput').value.trim();
    const name = document.getElementById('phoneNameInput').value.trim();
    const bestTime = document.getElementById('bestTimeInput').value.trim();
    const notes = document.getElementById('phoneNotesInput').value.trim();

    if (!isValidName(name)) {
        alert('Please enter your name (at least 2 characters).');
        return;
    }

    if (!isValidPhone(phone)) {
        alert('Please enter a valid phone number (at least 10 digits).');
        return;
    }

    // ... rest of handler unchanged
}
```

## Notes

- Server-side validation via `sanitize_email()` and `sanitize_text_field()` already exists in `functions.php` — this patch adds the client-side layer so users get immediate feedback
- The email regex is intentionally simple — it catches obvious mistakes without rejecting valid edge-case emails
- Phone validation strips formatting chars (parens, dashes, spaces) and checks digit count
