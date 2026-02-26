# PATCH 009 — Hardcoded admin-ajax.php Path

**Priority:** MEDIUM
**File:** `quiz_javascript.html`
**Lines:** 1392, 1453

## Simple Explanation

The form submission URL `/wp-admin/admin-ajax.php` is hardcoded in the JavaScript. This breaks on any WordPress install that isn't at the site root — subdirectory installs, custom admin URLs, or security plugins that rename the admin path. The fix is to have WordPress output its own correct AJAX URL via PHP, so the JavaScript always uses the right address regardless of how the site is configured.

---

## Problem

Both form handlers use a hardcoded path:

```javascript
fetch('/wp-admin/admin-ajax.php', {
```

This breaks if:
- WordPress is installed in a subdirectory (e.g., `example.com/blog/wp-admin/admin-ajax.php`)
- The admin URL has been changed via a security plugin
- The site uses a non-standard `WP_ADMIN_DIR`

## Current Approach

The existing code already has a `wp_localize_script` call in `functions.php` for the WooCommerce cart (line 41):

```php
wp_localize_script('sc-ajax-script', 'sc_ajax', array('ajax_url' => admin_url('admin-ajax.php')));
```

The quiz code previously used a similar `bedSelectorData.ajaxUrl` but it was removed (comments on lines 1384, 1445: `CHANGED FROM bedSelectorData.ajaxUrl`).

## Fix Option A: Use the existing `sc_ajax` object

Since `sc_ajax.ajax_url` is already available globally, the quiz can use it:

```javascript
// Replace both instances of:
fetch('/wp-admin/admin-ajax.php', {

// With:
fetch(sc_ajax.ajax_url, {
```

This is the simplest fix but creates a dependency on the WooCommerce cart script being enqueued.

## Fix Option B: Output the URL inline (more robust)

Since the quiz is embedded via Elementor HTML widget, add a PHP snippet before the script:

```html
<script>
var bedSelectorData = {
    ajaxUrl: '<?php echo admin_url("admin-ajax.php"); ?>'
};
</script>
```

Then update the fetch calls:

```javascript
// Replace both instances of:
fetch('/wp-admin/admin-ajax.php', {

// With:
fetch(bedSelectorData.ajaxUrl, {
```

This can be combined with the nonce from PATCH 003:

```html
<script>
var bedSelectorData = {
    ajaxUrl: '<?php echo admin_url("admin-ajax.php"); ?>',
    nonce: '<?php echo wp_create_nonce("bed_selector_submit"); ?>'
};
</script>
```

## Recommendation

**Option B** — it's self-contained, doesn't depend on other scripts, and bundles nicely with the nonce fix from PATCH 003.
