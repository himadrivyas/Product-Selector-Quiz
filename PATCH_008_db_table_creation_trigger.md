# PATCH 008 — Database Table Creation Only Fires on Theme Switch

**Priority:** HIGH
**File:** `functions.php`
**Line:** 93

## Simple Explanation

The database table is only created when the WordPress theme is activated (`after_switch_theme` hook). If the table is ever lost — site migration, database restore, accidental drop — it won't be recreated until someone switches themes again. All form submissions silently fail in the meantime. This patch moves the check to `admin_init` with a version flag so WordPress verifies the table exists on every admin load, but skips the work if it's already up to date.

---

## Problem

The table creation function is hooked to `after_switch_theme`:

```php
add_action('after_switch_theme', 'sondercare_create_submissions_table');
```

This means the `wp_bed_selector_submissions` table is only created when the theme is activated. If:
- The table is accidentally dropped
- The site is migrated to a new host
- The database is restored from a backup that predates the table
- Another developer sets up a new environment

...the table won't exist and all form submissions will fail silently (the `$wpdb->insert` returns false, user sees "error submitting").

## Patched Code

Use `admin_init` with a version check so it runs once and only re-runs if the schema changes:

```php
function sondercare_create_submissions_table() {
    $installed_version = get_option('sondercare_db_version', '0');
    $current_version = '1.0';

    if ($installed_version === $current_version) {
        return; // Already up to date
    }

    global $wpdb;
    $table_name = $wpdb->prefix . 'bed_selector_submissions';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        quote_number varchar(50) NOT NULL,
        contact_type varchar(20) NOT NULL,
        name varchar(255) NOT NULL,
        email varchar(255) DEFAULT NULL,
        phone varchar(50) DEFAULT NULL,
        bed_size varchar(20) DEFAULT NULL,
        answers longtext NOT NULL,
        notes text DEFAULT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY quote_number (quote_number)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    update_option('sondercare_db_version', $current_version);
}
add_action('admin_init', 'sondercare_create_submissions_table');
```

## Notes

- `dbDelta` is safe to call repeatedly — it only modifies the table if the schema differs
- The version option prevents the function from running on every admin page load
- Bump `$current_version` when the schema changes in future patches
- `admin_init` is better than `init` because table creation only needs to happen when an admin is active, not on every frontend request
