# PATCH 010 — Verify Database Table Exists

**Priority:** CRITICAL
**File:** n/a (requires live site access)
**Blocking:** All form submissions depend on this table

## Simple Explanation

The function that creates the `wp_bed_selector_submissions` table is hooked to `after_switch_theme`, which only fires once when the theme is activated. If this code was added to `functions.php` after the theme was already active, the function has never run and the table doesn't exist. Without the table, every form submission fails silently.

---

## Action Required

**Someone with access to the live site needs to verify whether the table exists.** Any one of these methods works:

### Option 1: phpMyAdmin / database admin panel
Look for a table called `wp_bed_selector_submissions` (prefix may vary — could be `wpsc_`, `wp2_`, etc. depending on install).

### Option 2: WP-CLI (if SSH access available)
```bash
wp db query "SHOW TABLES LIKE '%bed_selector_submissions';"
```

### Option 3: Temporary PHP snippet
Add this temporarily to `functions.php`, load any admin page, then remove it:
```php
add_action('admin_notices', function() {
    global $wpdb;
    $table = $wpdb->prefix . 'bed_selector_submissions';
    $exists = $wpdb->get_var("SHOW TABLES LIKE '$table'") === $table;
    echo '<div class="notice notice-' . ($exists ? 'success' : 'error') . '"><p>';
    echo $exists ? "Table <strong>$table</strong> exists." : "Table <strong>$table</strong> does NOT exist.";
    echo '</p></div>';
});
```

---

## If the table does NOT exist

Run the creation function manually. Easiest way — add this one-time snippet to `functions.php`, load any admin page, then remove it:

```php
add_action('admin_init', 'sondercare_create_submissions_table');
```

Or just temporarily change line 93 from:
```php
add_action('after_switch_theme', 'sondercare_create_submissions_table');
```
to:
```php
add_action('admin_init', 'sondercare_create_submissions_table');
```

Load any admin page (this triggers the function), then consider leaving it as `admin_init` permanently — this is what PATCH 008 recommends anyway.

## If the table DOES exist

No immediate action needed. PATCH 008 still recommended to prevent future issues, but not urgent.
