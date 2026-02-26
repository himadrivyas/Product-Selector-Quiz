# PATCH 003 — Security Hardening

**Priority:** HIGH
**File:** `functions.php`, `quiz_javascript.html`

## Simple Explanation

Five security gaps in one patch: (A) No CSRF protection — any external website can forge a POST request that submits fake quotes. Fixed by adding a nonce (a one-time token that proves the request came from our site). (B) No rate limiting — nothing stops automated scripts from flooding the database with thousands of submissions. Fixed by capping each IP at 3 submissions per 10 minutes. (C) The "view quote details" AJAX endpoint has no permission check — any logged-in WordPress user (even subscribers) can view customer data. Fixed by restricting to admins only. (D) The CSV export link has no nonce — anyone with the URL can trigger a download. Fixed by adding a nonce check. (E) No bot protection — a hidden form field is added that real users never see but automated bots fill in, letting us silently discard those submissions.

---

## Issues

### 3A. No nonce on frontend form submission

The frontend AJAX calls removed nonce verification (comments say "NO nonce needed for public forms"). This is incorrect — public-facing forms still benefit from nonce to prevent CSRF. Without it, any external site can craft a POST to your `admin-ajax.php` and submit fake quotes.

**File:** `quiz_javascript.html` — lines 1380-1384, 1441-1445
**File:** `functions.php` — line 99

#### Frontend Fix

The quiz JS needs access to a nonce. Since this is embedded in a WordPress page, the nonce should be passed via `wp_localize_script` or printed inline. For an Elementor HTML widget, add a small PHP snippet that outputs the nonce:

```html
<!-- Add this BEFORE the quiz script in the Elementor HTML widget or page template -->
<script>
var bedSelectorNonce = '<?php echo wp_create_nonce("bed_selector_submit"); ?>';
</script>
```

Then in `quiz_javascript.html`, both submit handlers should include it:

```javascript
// In handleEmailSubmit and handlePhoneSubmit:
const formData = new FormData();
formData.append('action', 'submit_bed_selector');
formData.append('nonce', bedSelectorNonce);
formData.append('data', JSON.stringify(submissionData));
```

#### Backend Fix

```php
function sondercare_handle_submission() {
    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'] ?? '', 'bed_selector_submit')) {
        wp_send_json_error(array('message' => 'Security check failed. Please refresh and try again.'));
        return;
    }

    global $wpdb;
    // ... rest of handler
}
```

---

### 3B. No rate limiting on form submission

Nothing prevents an attacker from submitting thousands of quotes per minute, filling the DB and triggering mass emails.

**File:** `functions.php`

#### Fix — Add transient-based rate limiting

Add this at the top of `sondercare_handle_submission()`:

```php
function sondercare_handle_submission() {
    // Rate limit: max 3 submissions per IP per 10 minutes
    $ip = $_SERVER['REMOTE_ADDR'];
    $rate_key = 'bed_selector_rate_' . md5($ip);
    $attempts = get_transient($rate_key);

    if ($attempts !== false && $attempts >= 3) {
        wp_send_json_error(array('message' => 'Too many submissions. Please try again later.'));
        return;
    }

    // Increment counter
    if ($attempts === false) {
        set_transient($rate_key, 1, 600); // 10 minutes
    } else {
        set_transient($rate_key, $attempts + 1, 600);
    }

    // ... nonce check, then rest of handler
}
```

---

### 3C. `get_quote_details` AJAX handler has no capability check

**File:** `functions.php` — lines 309-357

Any logged-in WordPress user (subscriber, contributor, etc.) can call `get_quote_details` and view any quote by ID. This should be restricted to admins.

#### Current Code

```php
add_action('wp_ajax_get_quote_details', 'sondercare_get_quote_details');

function sondercare_get_quote_details() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'bed_selector_submissions';
    $id = intval($_POST['id']);
    // ...
}
```

#### Patched Code

```php
function sondercare_get_quote_details() {
    // Only allow users who can manage options (admins)
    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => 'Unauthorized'));
        return;
    }

    // Verify nonce
    if (!check_ajax_referer('quote_details_nonce', 'nonce', false)) {
        wp_send_json_error(array('message' => 'Security check failed'));
        return;
    }

    global $wpdb;
    $table_name = $wpdb->prefix . 'bed_selector_submissions';
    $id = intval($_POST['id']);
    // ... rest unchanged
}
```

Also update the admin page JS to include the nonce:

```javascript
jQuery(document).ready(function($) {
    $('.view-details').on('click', function(e) {
        e.preventDefault();
        var id = $(this).data('id');

        $.post(ajaxurl, {
            action: 'get_quote_details',
            id: id,
            nonce: '<?php echo wp_create_nonce("quote_details_nonce"); ?>'
        }, function(response) {
            if (response.success) {
                $('#modal-content').html(response.data.html);
                $('#quote-modal').show();
            }
        });
    });
});
```

---

### 3D. CSV export has no nonce check

**File:** `functions.php` — lines 188-189

The export action is triggered by a GET parameter with no nonce. Anyone who knows the URL (`?page=bed-selector-quotes&action=export`) could potentially trigger it.

#### Current Code

```php
if (isset($_GET['action']) && $_GET['action'] === 'export') {
    sondercare_export_quotes_csv();
    exit;
}
```

#### Patched Code

```php
if (isset($_GET['action']) && $_GET['action'] === 'export') {
    if (!wp_verify_nonce($_GET['_wpnonce'] ?? '', 'export_quotes')) {
        wp_die('Security check failed.');
    }
    sondercare_export_quotes_csv();
    exit;
}
```

Update the export link in the admin page HTML:

```php
<a href="?page=bed-selector-quotes&action=export&_wpnonce=<?php echo wp_create_nonce('export_quotes'); ?>" class="page-title-action">Export CSV</a>
```

---

### 3E. No honeypot field for bot protection

**File:** `quiz.html`, `quiz_javascript.html`, `functions.php`

Simple honeypot field — hidden from real users, filled by bots.

#### HTML (quiz.html) — add to both forms

```html
<!-- Inside emailForm, before submit button -->
<div class="form-group" style="position:absolute;left:-9999px;" aria-hidden="true">
    <label for="website">Website</label>
    <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
</div>

<!-- Inside phoneForm, before submit button -->
<div class="form-group" style="position:absolute;left:-9999px;" aria-hidden="true">
    <label for="company">Company</label>
    <input type="text" id="company" name="company" tabindex="-1" autocomplete="off">
</div>
```

#### JS (quiz_javascript.html) — check honeypot before submit

```javascript
// At the top of handleEmailSubmit:
const honeypot = document.getElementById('website').value;
if (honeypot) {
    // Bot detected — silently succeed (don't reveal detection)
    document.getElementById('emailForm').classList.remove('active');
    document.getElementById('successMessage').classList.add('active');
    return;
}

// At the top of handlePhoneSubmit:
const honeypot = document.getElementById('company').value;
if (honeypot) {
    document.getElementById('phoneForm').classList.remove('active');
    document.getElementById('successMessage').classList.add('active');
    return;
}
```

#### PHP (functions.php) — server-side honeypot check

```php
// At the top of sondercare_handle_submission, after rate limiting:
if (!empty($data['website']) || !empty($data['company'])) {
    // Bot submission — return success to avoid revealing detection
    wp_send_json_success(array('message' => 'Quote saved successfully'));
    return;
}
```
