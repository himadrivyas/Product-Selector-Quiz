# PATCH 006 — Admin Page Improvements

**Priority:** MEDIUM
**File:** `functions.php`

## Simple Explanation

The admin quote list has no search, no filtering, and no pagination — it loads every quote on one page. As volume grows this becomes unusable. This patch adds: a search box that filters by name, email, phone, or quote number; a dropdown to filter by contact type (email vs. phone); pagination at 25 quotes per page; and human-readable labels in the detail modal ("Bed Width" instead of "q1", "Mattress" instead of "q5").

---

## Current State

The admin page has:
- Quote list table (sortable by date DESC)
- View detail modal
- Delete with nonce
- CSV export

## Missing per Phase 1 requirements

### 6A. No search or filtering

Operators need to find quotes by customer name, email, quote number, or date range. With volume, scrolling through all quotes is impractical.

#### Add search to admin page

Replace the current `$submissions` query block (line 194) with:

```php
// Get search/filter params
$search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
$contact_filter = isset($_GET['contact_type']) ? sanitize_text_field($_GET['contact_type']) : '';

// Build query
$where_clauses = array();
$where_values = array();

if ($search) {
    $where_clauses[] = "(quote_number LIKE %s OR name LIKE %s OR email LIKE %s OR phone LIKE %s)";
    $like = '%' . $wpdb->esc_like($search) . '%';
    $where_values = array_merge($where_values, array($like, $like, $like, $like));
}

if ($contact_filter) {
    $where_clauses[] = "contact_type = %s";
    $where_values[] = $contact_filter;
}

$where_sql = '';
if (!empty($where_clauses)) {
    $where_sql = 'WHERE ' . implode(' AND ', $where_clauses);
}

$query = "SELECT * FROM $table_name $where_sql ORDER BY created_at DESC";

if (!empty($where_values)) {
    $submissions = $wpdb->get_results($wpdb->prepare($query, $where_values));
} else {
    $submissions = $wpdb->get_results($query);
}
```

Add search form HTML after `<hr class="wp-header-end">`:

```php
<form method="get" style="margin: 15px 0;">
    <input type="hidden" name="page" value="bed-selector-quotes">
    <input type="text" name="s" value="<?php echo esc_attr($search); ?>"
           placeholder="Search by name, email, quote #..."
           style="width: 300px; padding: 5px 10px;">
    <select name="contact_type">
        <option value="">All Types</option>
        <option value="email" <?php selected($contact_filter, 'email'); ?>>Email Quote</option>
        <option value="phone" <?php selected($contact_filter, 'phone'); ?>>Request Call</option>
    </select>
    <button type="submit" class="button">Search</button>
    <?php if ($search || $contact_filter): ?>
        <a href="?page=bed-selector-quotes" class="button">Clear</a>
    <?php endif; ?>
</form>
```

---

### 6B. Raw SQL without prepare in current queries

The current export query (line 364) and main listing query (line 194) use raw SQL:

```php
$submissions = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
```

While `$table_name` is constructed from `$wpdb->prefix` (safe), this pattern is brittle if ever modified to include user input. The search patch above uses `$wpdb->prepare()` which fixes this for filtered queries.

---

### 6C. No pagination

If hundreds of quotes accumulate, the admin page loads them all at once.

#### Add basic pagination

```php
// After search query building, before executing:
$per_page = 25;
$current_page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
$offset = ($current_page - 1) * $per_page;

// Get total count
$count_query = "SELECT COUNT(*) FROM $table_name $where_sql";
if (!empty($where_values)) {
    $total_items = $wpdb->get_var($wpdb->prepare($count_query, $where_values));
} else {
    $total_items = $wpdb->get_var($count_query);
}
$total_pages = ceil($total_items / $per_page);

// Add LIMIT to main query
$query .= " LIMIT %d OFFSET %d";
$query_values = array_merge($where_values, array($per_page, $offset));
$submissions = $wpdb->get_results($wpdb->prepare($query, $query_values));
```

Add pagination controls after the table:

```php
<?php if ($total_pages > 1): ?>
<div class="tablenav bottom">
    <div class="tablenav-pages">
        <span class="displaying-num"><?php echo $total_items; ?> items</span>
        <?php
        echo paginate_links(array(
            'base' => add_query_arg('paged', '%#%'),
            'format' => '',
            'current' => $current_page,
            'total' => $total_pages,
            'prev_text' => '&laquo;',
            'next_text' => '&raquo;',
        ));
        ?>
    </div>
</div>
<?php endif; ?>
```

---

### 6D. Quote detail modal shows raw question IDs

The detail modal displays `q1`, `q2-bed`, `q5` etc. as the question column. Operators won't know what these mean.

#### Fix in `sondercare_get_quote_details` (line 347)

Add a label map:

```php
$question_labels = array(
    'q1' => 'Bed Width',
    'q2-bed' => 'Finish (Standard)',
    'q2-headboard' => 'Finish (King)',
    'q3' => 'User Height',
    'q4' => 'Fall Risk',
    'q5' => 'Mattress',
    'q6' => 'Safety Accessories',
    'q7' => 'Comfort Accessories',
    'q8' => 'Functionality Accessories',
    'q9' => 'Premium Bedding',
    'q10' => 'Delivery Method',
    'q11' => 'Delivery Speed',
);

foreach ($answers as $questionId => $answer) {
    $label = $question_labels[$questionId] ?? $questionId;
    $html .= '<tr>';
    $html .= '<td style="padding:10px; border:1px solid #ddd;"><strong>' . esc_html($label) . '</strong></td>';
    $html .= '<td style="padding:10px; border:1px solid #ddd;">' . esc_html(is_array($answer) ? implode(', ', $answer) : $answer) . '</td>';
    $html .= '</tr>';
}
```
