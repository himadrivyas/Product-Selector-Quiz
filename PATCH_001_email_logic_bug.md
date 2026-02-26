# PATCH 001 — Email Logic Bug: Customer Copy Sent on Both Form Types

**Priority:** CRITICAL
**File:** `functions.php`
**Lines:** 133-158

## Simple Explanation

The code decides whether to email the customer by checking if an email address exists in the data. It should instead check which form the customer used — "Email Quote" or "Request a Call." The "Request a Call" path should never send the customer an email; the sales team handles that manually. Also, the operator notification is going to `sales@sondercare.com` but the overview doc says it should go to `info@sondercare.com`.

---

## Problem

`sondercare_send_notification_email()` sends a customer email whenever `$data['email']` is non-empty (line 148). This fires for **both** form types.

Per the overview doc:
- **"Email Quote" form** → send to operator AND customer (carbon copy)
- **"Request Call" form** → send to operator ONLY (sales team reaches out)

Currently, if a user fills in the phone form, no customer email is sent (because the phone form doesn't collect email). But the logic is checking the wrong condition — it should be gated on `contactType`, not on whether email exists.

This matters because if the phone form ever collects an email field (or if the data structure changes), the customer would incorrectly receive an email.

## Current Code

```php
// 3. SEND EMAIL NOTIFICATION
function sondercare_send_notification_email($data) {
    $to = 'sales@sondercare.com'; // Change this to your email
    $subject = 'New Bed Selector Quote #' . ($data['quoteNumber'] ?? 'N/A');

    $message = "New bed selector quote received:\n\n";
    $message .= "Quote Number: " . ($data['quoteNumber'] ?? 'N/A') . "\n";
    $message .= "Name: " . $data['name'] . "\n";
    $message .= "Contact: " . ($data['email'] ?? $data['phone']) . "\n";
    $message .= "Bed Size: " . ($data['bedSize'] ?? 'Not specified') . "\n\n";
    $message .= "Notes: " . ($data['notes'] ?? 'None') . "\n\n";
    $message .= "View details in WordPress Admin → Bed Quotes\n";

    wp_mail($to, $subject, $message);

    // Also send to customer if email provided
    if (!empty($data['email'])) {
        $customer_subject = 'Your SonderCare Bed Quote #' . ($data['quoteNumber'] ?? '');
        $customer_message = "Dear " . $data['name'] . ",\n\n";
        $customer_message .= "Thank you for your interest in SonderCare beds!\n\n";
        $customer_message .= "Your quote number is: " . ($data['quoteNumber'] ?? 'N/A') . "\n\n";
        $customer_message .= "We'll be in touch shortly.\n\n";
        $customer_message .= "Best regards,\nSonderCare Team";

        wp_mail($data['email'], $customer_subject, $customer_message);
    }
}
```

## Patched Code

```php
// 3. SEND EMAIL NOTIFICATION
function sondercare_send_notification_email($data) {
    $to = 'info@sondercare.com';
    $subject = 'New Bed Selector Quote #' . ($data['quoteNumber'] ?? 'N/A');

    $message = "New bed selector quote received:\n\n";
    $message .= "Quote Number: " . ($data['quoteNumber'] ?? 'N/A') . "\n";
    $message .= "Name: " . $data['name'] . "\n";
    $message .= "Contact Type: " . ($data['contactType'] ?? 'N/A') . "\n";
    $message .= "Email: " . ($data['email'] ?? 'N/A') . "\n";
    $message .= "Phone: " . ($data['phone'] ?? 'N/A') . "\n";
    $message .= "Bed Size: " . ($data['bedSize'] ?? 'Not specified') . "\n\n";
    $message .= "Notes: " . ($data['notes'] ?? 'None') . "\n\n";
    $message .= "View details in WordPress Admin → Bed Quotes\n";

    // Always send to operator
    wp_mail($to, $subject, $message);

    // Only send customer copy for "Email Quote" form — NOT "Request Call"
    if ($data['contactType'] === 'email' && !empty($data['email'])) {
        $customer_subject = 'Your SonderCare Bed Quote #' . ($data['quoteNumber'] ?? '');
        $customer_message = "Dear " . $data['name'] . ",\n\n";
        $customer_message .= "Thank you for your interest in SonderCare beds!\n\n";
        $customer_message .= "Your quote number is: " . ($data['quoteNumber'] ?? 'N/A') . "\n\n";
        $customer_message .= "We'll be in touch shortly.\n\n";
        $customer_message .= "Best regards,\nSonderCare Team";

        wp_mail($data['email'], $customer_subject, $customer_message);
    }
}
```

## Changes

1. **Operator email address:** `sales@sondercare.com` → `info@sondercare.com` (per overview doc)
2. **Customer email condition:** `!empty($data['email'])` → `$data['contactType'] === 'email' && !empty($data['email'])`
3. **Operator email body:** Added `Contact Type`, `Email`, and `Phone` as separate fields (operator should see all details regardless of form type)
