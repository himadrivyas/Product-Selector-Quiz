# PATCH 002 — Operator Email Missing Full Quote Details

**Priority:** HIGH
**File:** `functions.php`
**Lines:** 133-145

## Simple Explanation

The operator email only contains the customer's name, contact info, and bed size. It's missing all the actual selections — bed model, finish, mattress, accessories, bedding, delivery method, itemized prices, and subtotal. The overview requires a "full featured quote" in the email. Right now operators have to log into WordPress admin every time to see what was actually selected. This patch sends the full results table (the same one the customer sees) inside the email.

---

## Problem

The overview requires both forms to "send the full featured quote and quote number with customer data and selections to operators." The current operator email only includes: quote number, name, contact info, bed size, and notes.

It does **not** include:
- The actual bed model selected (Aura Premium, Aura Platinum, Split King)
- Finish selection
- Mattress choice
- All selected accessories (safety, comfort, functionality)
- Bedding selections
- Delivery method and speed
- Itemized pricing
- Estimated subtotal

The operator gets a stub notification and has to go into WP Admin to see the actual selections. The overview implies the email itself should contain the full quote.

## Current Operator Email Body

```
New bed selector quote received:

Quote Number: SC-20260226-123
Name: John Doe
Contact: john@example.com
Bed Size: 39
Notes: None

View details in WordPress Admin → Bed Quotes
```

## Recommended Approach

The frontend already builds a complete results summary with item names, selections, and prices in `generateResultsSummary()`. Two options:

### Option A: Send structured answers from frontend, resolve labels server-side

The frontend currently sends `answers` as raw IDs (e.g., `{"q1": "39", "q2-bed": "premium", "q5": "dream-mattress"}`). The server would need a copy of the quiz data to resolve IDs to labels and prices. This keeps the server as the source of truth but requires duplicating the quiz data in PHP.

### Option B: Build the full quote HTML on the frontend and include it in the submission

Add a `quoteHtml` field to the submission payload containing the rendered results table. The server includes it directly in the email.

**Option B is simpler and avoids data duplication.** The tradeoff is the client controls email content.

## Patched Code — Frontend (quiz_javascript.html)

Add `quoteHtml` to the submission data in both `handleEmailSubmit` and `handlePhoneSubmit`:

```javascript
// In handleEmailSubmit, after building submissionData:
const submissionData = {
    quoteNumber: state.quoteNumber,
    contactType: 'email',
    email: email,
    name: name,
    notes: notes,
    answers: state.answers,
    bedSize: state.selectedBedSize,
    quoteHtml: document.getElementById('resultsSummary').innerHTML,
    timestamp: new Date().toISOString()
};

// Same change in handlePhoneSubmit:
const submissionData = {
    quoteNumber: state.quoteNumber,
    contactType: 'phone',
    phone: phone,
    name: name,
    bestTime: bestTime,
    notes: notes,
    answers: state.answers,
    bedSize: state.selectedBedSize,
    quoteHtml: document.getElementById('resultsSummary').innerHTML,
    timestamp: new Date().toISOString()
};
```

## Patched Code — Backend (functions.php)

```php
function sondercare_send_notification_email($data) {
    $to = 'info@sondercare.com';
    $subject = 'New Bed Selector Quote #' . ($data['quoteNumber'] ?? 'N/A');

    // Use HTML email with the full quote
    $headers = array('Content-Type: text/html; charset=UTF-8');

    $message = '<html><body>';
    $message .= '<h2>New Bed Selector Quote</h2>';
    $message .= '<p><strong>Quote Number:</strong> ' . esc_html($data['quoteNumber'] ?? 'N/A') . '</p>';
    $message .= '<p><strong>Name:</strong> ' . esc_html($data['name']) . '</p>';
    $message .= '<p><strong>Contact Type:</strong> ' . esc_html($data['contactType'] ?? 'N/A') . '</p>';
    $message .= '<p><strong>Email:</strong> ' . esc_html($data['email'] ?? 'N/A') . '</p>';
    $message .= '<p><strong>Phone:</strong> ' . esc_html($data['phone'] ?? 'N/A') . '</p>';
    $message .= '<p><strong>Best Time to Call:</strong> ' . esc_html($data['bestTime'] ?? 'N/A') . '</p>';
    $message .= '<p><strong>Notes:</strong> ' . nl2br(esc_html($data['notes'] ?? 'None')) . '</p>';
    $message .= '<hr>';
    $message .= '<h3>Full Quote Details</h3>';
    $message .= wp_kses_post($data['quoteHtml'] ?? '<p>No quote details available.</p>');
    $message .= '</body></html>';

    wp_mail($to, $subject, $message, $headers);

    // Customer copy — only for "Email Quote" form
    if ($data['contactType'] === 'email' && !empty($data['email'])) {
        $customer_subject = 'Your SonderCare Bed Quote #' . ($data['quoteNumber'] ?? '');

        $customer_message = '<html><body>';
        $customer_message .= '<p>Dear ' . esc_html($data['name']) . ',</p>';
        $customer_message .= '<p>Thank you for using the SonderCare Bed Selector! Here is your personalized quote:</p>';
        $customer_message .= '<hr>';
        $customer_message .= wp_kses_post($data['quoteHtml'] ?? '');
        $customer_message .= '<hr>';
        $customer_message .= '<p>If you have any questions, reply to this email or call us.</p>';
        $customer_message .= '<p>Best regards,<br>SonderCare Team</p>';
        $customer_message .= '</body></html>';

        wp_mail($data['email'], $customer_subject, $customer_message, $headers);
    }
}
```

## Notes

- `wp_kses_post()` sanitizes the HTML to allow only safe post-level tags (strips `<script>`, event handlers, etc.)
- The DB `answers` column still stores raw answer IDs for structured querying
- The `quoteHtml` is used only for email rendering, not stored in DB (unless you also want it stored — would require adding a `quote_html` longtext column)
