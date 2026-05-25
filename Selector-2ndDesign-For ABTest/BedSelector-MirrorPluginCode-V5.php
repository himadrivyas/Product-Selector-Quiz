<?php

/*
Plugin Name: Bed Selector Quiz
Description: A plugin for a questionnaire to find right SonderCare Hospital bed and accessories as per user's need and condition. 
Version: 2.0
Author: Web Dev - SonderCare

*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// ==========================================
// BED SELECTOR QUIZ - BACKEND
// ==========================================

// 1. CREATE DATABASE TABLE
function sondercare_create_submissions_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . "bed_selector_submissions";
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

    require_once ABSPATH . "wp-admin/includes/upgrade.php";
    dbDelta($sql);
}
// add_action("after_switch_theme", "sondercare_create_submissions_table");
register_activation_hook(__FILE__, 'sondercare_create_submissions_table');

// 1B. CREATE QUOTES TABLE (stores quotes when "See Results" is clicked)
function sondercare_create_quotes_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . "bed_selector_quotes";
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        quote_number varchar(50) NOT NULL,

        email varchar(255) DEFAULT NULL,
        phone varchar(50) DEFAULT NULL,
        postal_code varchar(30) DEFAULT NULL,

        bed_size varchar(20) DEFAULT NULL,
        bed_model varchar(100) DEFAULT NULL,
        mattress varchar(100) DEFAULT NULL,
        accessories text DEFAULT NULL,
        delivery_method varchar(100) DEFAULT NULL,
        warranty varchar(100) DEFAULT NULL,
        subtotal decimal(10,2) DEFAULT 0,

        answers longtext NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        synced_to_sheets tinyint(1) DEFAULT 0,

        PRIMARY KEY (id),
        UNIQUE KEY quote_number (quote_number)
    ) $charset_collate;";

    require_once ABSPATH . "wp-admin/includes/upgrade.php";
    dbDelta($sql);
}
// add_action("after_switch_theme", "sondercare_create_quotes_table");
register_activation_hook(__FILE__, 'sondercare_create_quotes_table');

// 2. CUSTOMIZE EMAIL SENDER NAME AND EMAIL
function sondercare_custom_email_from_name($original_email_from_name)
{
    return 'SonderCare';
}
add_filter('wp_mail_from_name', 'sondercare_custom_email_from_name');

function sondercare_custom_email_from($original_email_from)
{
    return 'info@sondercare.com'; // Change this to your preferred email
}
add_filter('wp_mail_from', 'sondercare_custom_email_from');

// 4. HELPER FUNCTION - Get Price for Individual Option
function sondercare_get_option_price($optionId, $bedSize)
{
    $prices = [
        // Q2-bed prices (Aura Premium/Platinum)
        "premium" => ["39" => 6999, "48" => 8999],
        "platinum" => ["39" => 8499, "48" => 10999],

        // Q2-headboard prices (Split King)
        "grey-headboard" => 12999,
        "offwhite-headboard" => 12999,

        // Q5 - Mattress prices
        "comfort-mattress" => ["39" => 899, "78" => 1799],
        "dream-mattress" => ["39" => 1299, "48" => 1499, "78" => 2599],
        "hybrid-mattress" => ["39" => 1799, "48" => 1999, "78" => 3599],
        "air-mattress" => ["39" => 2999, "48" => 3999, "78" => 5999],
        
        // ✅ FIX ISSUE #1: Add "None Required" for mattress
        "no-mattress-selected" => 0,

        // Q6 - Safety Accessories
        "helper-bar" => 369,
        "additional-rails" => 594,
        "underbed-light" => 219,
        "rail-pads" => 198,

        // Q7 - Comfort Accessories
        "overbed-table" => 789,
        "rail-organizer" => 89,
        "reading-light" => 179,
        "extension-kit" => ["39" => 449, "48" => 489, "78" => 829],

        // Q8 - Functionality
        "transport-cart" => 199,
        "battery-backup" => ["39" => 149, "48" => 149, "78" => 279],

        // Q9 - Bedding
        "microfiber-sheets" => ["39" => 99],
        "cotton-sheets" => ["39" => 169, "48" => 199, "78" => 269],
        "heavenly-pillow" => 189,
        "duvet-&-duvetcover" => ["39" => 469, "48" => 529, "78" => 619],

        // ✅ FIX ISSUE #2: Fixed drop-ship pricing structure
        "standard" => ["39" => 599, "48" => 599, "78" => 899],
        "expedited" => ["39" => 899, "48" => 899, "78" => 1299],
        "rush" => ["39" => 1199, "48" => 1199, "78" => 1699],
        "drop-ship" => ["39" => 449, "48" => 449, "78" => 799],
        "pickup" => 0,

        // Q11 - Warranty
        "5year-only-parts" => 0,
        "5year-parts-and-labor" => 199,
    ];

    $cleanBedSize = str_replace("(King)", "", $bedSize);

    if (!isset($prices[$optionId])) {
        return null;
    }

    $price = $prices[$optionId];

    if (is_array($price)) {
        return isset($price[$cleanBedSize]) ? $price[$cleanBedSize] : null;
    }

    return $price;
}

// 3. HELPER FUNCTION - Calculate Total Price from Answers
function sondercare_calculate_total_price($answers, $bedSize)
{
    $totalPrice = 0;

    foreach ($answers as $questionId => $answer) {
        if (is_array($answer)) {
            foreach ($answer as $optionId) {
                $price = sondercare_get_option_price($optionId, $bedSize);
                if ($price !== null) {
                    $totalPrice += $price;
                }
            }
        } else {
            $price = sondercare_get_option_price($answer, $bedSize);
            if ($price !== null) {
                $totalPrice += $price;
            }
        }
    }

    return $totalPrice;
}

// 5. HELPER FUNCTION - Generate HTML Email Content
function sondercare_generate_email_html($data, $isAdmin = true)
{
    $answers = $data["answers"] ?? [];
    $quoteNumber = $data["quoteNumber"];
    $bedSize = $data["bedSize"] ?? "Not specified";

    $date_format = get_option( 'date_format' );
    $time_format = get_option( 'time_format' );
    $current_time_localized = wp_date( $date_format . ' @ ' . $time_format, time() );


    // Calculate total price
    $totalPrice = sondercare_calculate_total_price($answers, $bedSize);

    // Option mappings
    $option_map = [
        "39" => '39" Twin XL',
        "48" => '48" Wide',
        "78" => '78" Split King',
        "premium" => "Woodgrain (Aura Premium)",
        "platinum" => "Upholstered (Aura Platinum)",
        "grey-headboard" => "Graphite Gray",
        "offwhite-headboard" => "Silverstone",
        "extensionkit-no" => 'Less than 6\'2"',
        "extensionkit-yes" => '6\'2" or taller',
        "safety-acc-no" => "Limited risk",
        "safety-acc-yes" => "Mid - High risk",
        "comfort-mattress" => "Comfort",
        "dream-mattress" => "Dream",
        "hybrid-mattress" => "Signature Hybrid",
        "air-mattress" => "Air",
        "no-mattress-selected" => "None Required",
        "helper-bar" => "Helper Bar",
        "additional-rails" => "Additional Rails",
        "underbed-light" => "Auto Nightlight",
        "rail-pads" => "Rail Pads (Pair)",
        "overbed-table" => "Overbed Table",
        "rail-organizer" => "Rail Organizer",
        "reading-light" => "Reading Light",
        "extension-kit" => "Extension Kit",
        "battery-backup" => "Battery Back-up",
        "transport-cart" => "Transport Cart",
        "microfiber-sheets" => "Microfiber Sheets",
        "cotton-sheets" => "Cotton Sheets",
        "heavenly-pillow" => "Heavenly Pillow",
        "duvet-&-duvetcover" => "Duvet and Cover",
        "standard" => "Standard White Glove Delivery (10-21 days)",
        "expedited" => "Expedited White Glove Delivery (4-9 days)",
        "rush" => "Rush White Glove Delivery (1-3 days)",
        "drop-ship" => "Drop Ship (Driveway)",
        "pickup" => "Pick-up at Warehouse",
        "5year-only-parts" => "5 Year Warranty Parts Only",
        "5year-parts-and-labor" => "5 Year Warranty Full Parts & Labor",
    ];

    $question_map = [
        "q1" => "Which bed width is preferred?",
    "q2-bed" => "Which finish do you prefer?",
    "q2-headboard" => "Which finish do you prefer?",
    "q3" => "Which mattress do you prefer?",
    "q4" => "How do you prefer delivery?",
    "q5" => "Any warranty upgrade?",
    "q6" => "Add any optional accessories?",
    "q7" => "Add any premium bedding?"
    ];

    // Start HTML email
    $html = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SonderCare Bed Quote</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #25385b; padding: 30px 20px; text-align: center;">
                                <h1 style="color: #C3AB74; margin: 0 0 10px 0; font-size: 32px; font-weight: 600;">SonderCare</h1>
                                <p style="color: #ffffff; margin: 0; font-size: 18px;">Bed Selector Quote</p>
                            </td>
                        </tr>
                        
                        <!-- Quote Number -->
                        <tr>
                            <td style="background-color: #f0f6fc; padding: 15px 20px; border-bottom: 3px solid #25385b;">
                                <p style="margin: 0; font-size: 16px; color: #25385b; font-weight: 600;">Quote #' . esc_html($quoteNumber) . '</p>
                                <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Date: ' . $current_time_localized . '</p>

                            </td>
                        </tr>
                        
                        <!-- Customer Information -->';

    if ($isAdmin) {
        $html .= '
                        <tr>
                            <td style="padding: 20px;">
                                <h2 style="color: #25385b; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #C3AB74; padding-bottom: 8px;">Customer Information</h2>
                                <table width="100%" cellpadding="5" cellspacing="0">
                                    <tr>
                                        <td width="120" style="color: #666; font-size: 14px;"><strong>Name:</strong></td>
                                        <td style="color: #333; font-size: 14px;">' . esc_html($data["name"]) . '</td>
                                    </tr>';

        if (!empty($data["email"])) {
            $html .= '
                                    <tr>
                                        <td style="color: #666; font-size: 14px;"><strong>Email:</strong></td>
                                        <td style="color: #333; font-size: 14px;"><a href="mailto:' . esc_attr($data["email"]) . '" style="color: #2271b1; text-decoration: none;">' . esc_html($data["email"]) . '</a></td>
                                    </tr>';
        }

        if (!empty($data["phone"])) {
            $html .= '
                                    <tr>
                                        <td style="color: #666; font-size: 14px;"><strong>Phone:</strong></td>
                                        <td style="color: #333; font-size: 14px;"><a href="tel:' . esc_attr($data["phone"]) . '" style="color: #2271b1; text-decoration: none;">' . esc_html($data["phone"]) . '</a></td>
                                    </tr>';
        }

        $html .= '
                                    <tr>
                                        <td style="color: #666; font-size: 14px;"><strong>Contact Type:</strong></td>
                                        <td style="color: #333; font-size: 14px;">' . ucfirst(esc_html($data["contactType"])) . '</td>
                                    </tr>';

        if (!empty($data["notes"])) {
            $html .= '
                                    <tr>
                                        <td style="color: #666; font-size: 14px; vertical-align: top;"><strong>Notes:</strong></td>
                                        <td style="color: #333; font-size: 14px;">' . nl2br(esc_html($data["notes"])) . '</td>
                                    </tr>';
        }

        $html .= '
                                </table>
                            </td>
                        </tr>';
    } else {
        // Customer email - simpler greeting
        $html .= '
                        <tr>
                            <td style="padding: 20px;">
                                <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">Dear ' . esc_html($data["name"]) . ',</p>
                                <p style="margin: 0 0 15px 0; font-size: 14px; color: #666; line-height: 1.6;">Thank you for using the SonderCare Bed Selector! Below is a detailed summary of your selections.</p>
                            </td>
                        </tr>';
    }

    // Quote Details Table
    $html .= '
                        <tr>
                            <td style="padding: 0 20px 20px 20px;">
                                <h2 style="color: #25385b; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #C3AB74; padding-bottom: 8px;">Quote Details</h2>
                                <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; border: 1px solid #ddd;">
                                    <thead>
                                        <tr style="background-color: #f5f5f5;">
                                            <th style="text-align: left; padding: 12px; border: 1px solid #ddd; color: #25385b; font-size: 14px;">Item</th>
                                            <th style="text-align: left; padding: 12px; border: 1px solid #ddd; color: #25385b; font-size: 14px;">Selection</th>
                                            <th style="text-align: right; padding: 12px; border: 1px solid #ddd; color: #25385b; font-size: 14px;">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>';

    // Process each answer
    foreach ($answers as $qid => $answer) {
        if (!isset($question_map[$qid])) {
            continue;
        }

        $questionText = $question_map[$qid];

        if (is_array($answer)) {
            if (empty($answer)) {
                $html .= '
                                        <tr>
                                            <td style="padding: 10px; border: 1px solid #ddd; color: #666; font-size: 13px;">' . esc_html($questionText) . '</td>
                                            <td style="padding: 10px; border: 1px solid #ddd; color: #999; font-style: italic; font-size: 13px;">None selected</td>
                                            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-size: 13px;">—</td>
                                        </tr>';
            } else {
                // Multiple selections - show each with individual price
                foreach ($answer as $index => $optId) {
                    $optionText = isset($option_map[$optId]) ? $option_map[$optId] : $optId;
                    $itemPrice = sondercare_get_option_price($optId, $bedSize);
                    $priceDisplay = $itemPrice !== null ? '$' . number_format($itemPrice, 0) : '—';

                    $html .= '
                                        <tr>
                                            <td style="padding: 10px; border: 1px solid #ddd; color: #666; font-size: 13px;">' . ($index === 0 ? esc_html($questionText) : '') . '</td>
                                            <td style="padding: 10px; border: 1px solid #ddd; color: #333; font-size: 13px;">' . esc_html($optionText) . '</td>
                                            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-size: 13px; color: #C3AB74; font-weight: 600;">' . $priceDisplay . '</td>
                                        </tr>';
                }
            }
        } else {
            // Single selection
            $optionText = isset($option_map[$answer]) ? $option_map[$answer] : $answer;

            // Combine q1 with finish selection
            if ($qid === "q1") {
                $bedSizes = ["39" => '39" Twin XL', "48" => '48" Wide', "78" => '78" Split King'];
                $bedText = $bedSizes[$answer] ?? $answer;

                if (isset($answers["q2-bed"])) {
                    $finish = isset($option_map[$answers["q2-bed"]]) ? $option_map[$answers["q2-bed"]] : "";
                    $optionText = $bedText . " - " . $finish;
                } elseif (isset($answers["q2-headboard"])) {
                    $finish = isset($option_map[$answers["q2-headboard"]]) ? $option_map[$answers["q2-headboard"]] : "";
                    $optionText = $bedText . " - " . $finish;
                }
            }

            // Skip q2 rows because they are already merged into q1 row
            if ($qid === "q2-bed" || $qid === "q2-headboard") {
                continue;
            }

            // Get price for this item
            $itemPrice = null;
            if ($qid === "q1") {
                // Get bed price from q2-bed or q2-headboard
                if (isset($answers["q2-bed"])) {
                    $itemPrice = sondercare_get_option_price($answers["q2-bed"], $bedSize);
                } elseif (isset($answers["q2-headboard"])) {
                    $itemPrice = sondercare_get_option_price($answers["q2-headboard"], $bedSize);
                }
            } else {
                $itemPrice = sondercare_get_option_price($answer, $bedSize);
            }

            $priceDisplay = $itemPrice !== null ? '$' . number_format($itemPrice, 0) : '—';

            $html .= '
                                        <tr>
                                            <td style="padding: 10px; border: 1px solid #ddd; color: #666; font-size: 13px;">' . esc_html($questionText) . '</td>
                                            <td style="padding: 10px; border: 1px solid #ddd; color: #333; font-size: 13px;">' . esc_html($optionText) . '</td>
                                            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-size: 13px; color: #C3AB74; font-weight: 600;">' . $priceDisplay . '</td>
                                        </tr>';
        }
    }

    $html .= '
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Total Price -->
                        <tr>
                            <td style="padding: 0 20px 20px 20px;">
                                <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #25385b; border-radius: 8px;">
                                    <tr>
                                        <td style="color: #ffffff; font-size: 16px; font-weight: 600;">Estimated Subtotal:</td>
                                        <td style="color: #C3AB74; font-size: 20px; font-weight: 700; text-align: right;">$' . number_format($totalPrice, 0) . '</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>';

    // Footer message
    if ($isAdmin) {
        $html .= '
                        <tr>
                            <td style="padding: 20px; background-color: #f9f9f9; border-top: 1px solid #ddd;">
                                <p style="margin: 0; font-size: 13px; color: #666; text-align: center;">View full details in WordPress Admin → Bed Quotes</p>
                            </td>
                        </tr>';
    } else {
        $html .= '
                        <tr>
                            <td style="padding: 20px; background-color: #f9f9f9; border-top: 1px solid #ddd;">
                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #333;">We\'ll be in touch shortly to discuss your bed selection and answer any questions.</p>
                                <p style="margin: 0; font-size: 13px; color: #666;">Best regards,<br><strong>SonderCare Team</strong></p>
                            </td>
                        </tr>';
    }

    $html .= '
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>';

    return $html;
}

// 6. HANDLE FORM SUBMISSIONS (AJAX)
add_action("wp_ajax_submit_bed_selector", "sondercare_handle_submission");
add_action("wp_ajax_nopriv_submit_bed_selector", "sondercare_handle_submission");

function sondercare_handle_submission()
{
    global $wpdb;
    $table_name = $wpdb->prefix . "bed_selector_submissions";

    // Get and decode data
    $data = json_decode(stripslashes($_POST["data"]), true);
    
    // ✅ ENHANCED LOGGING - Start
    error_log('=== SUBMISSION START ===');
    error_log('Raw POST data: ' . print_r($_POST, true));
    error_log('Decoded data: ' . print_r($data, true));

    // ✅ Get phone number from quotes table
    $quotes_table = $wpdb->prefix . "bed_selector_quotes";
    $quote = $wpdb->get_row($wpdb->prepare(
        "SELECT phone FROM $quotes_table WHERE quote_number = %s",
        $data["quoteNumber"]
    ));
    
    $phone = $quote ? $quote->phone : '';
    
    error_log('Quote Number: ' . $data["quoteNumber"]);
    error_log('Phone from quotes table: ' . ($phone ? $phone : 'NOT FOUND'));
    error_log('Quote object: ' . print_r($quote, true));

    // ✅ Insert into database WITH PHONE
    $insert_data = [
        "quote_number" => sanitize_text_field($data["quoteNumber"] ?? ""),
        "contact_type" => sanitize_text_field($data["contactType"]),
        "name" => sanitize_text_field($data["name"]),
        "email" => sanitize_email($data["email"] ?? ""),
        "phone" => sanitize_text_field($phone),
        "bed_size" => sanitize_text_field($data["bedSize"] ?? ""),
        "answers" => wp_json_encode($data["answers"]),
        "notes" => sanitize_textarea_field($data["notes"] ?? ""),
        "created_at" => current_time("mysql"),
    ];
    
    error_log('Data to insert: ' . print_r($insert_data, true));
    
    $result = $wpdb->insert(
        $table_name,
        $insert_data,
        ["%s", "%s", "%s", "%s", "%s", "%s", "%s", "%s", "%s"]
    );

    error_log('Insert result: ' . ($result ? 'SUCCESS' : 'FAILED'));
    error_log('Last error: ' . $wpdb->last_error);
    error_log('Rows affected: ' . $wpdb->rows_affected);

    if ($result) {
        // ✅ Add phone to data array for email and sheets sync
        $data["phone"] = $phone;
        
        error_log('About to send emails...');
        
        // Send email notification
        sondercare_send_notification_email($data);
        
        error_log('Emails sent, sending success response');
        
        wp_send_json_success(["message" => "Quote saved successfully"]);
    } else {
        error_log('Database insert failed: ' . $wpdb->last_error);
        wp_send_json_error(["message" => "Failed to save quote: " . $wpdb->last_error]);
    }
    
    error_log('=== SUBMISSION END ===');
}
// 6B. SAVE QUOTE TO QUOTES TABLE (called when "See Results" is clicked)
add_action("wp_ajax_save_quote", "sondercare_save_quote");
add_action("wp_ajax_nopriv_save_quote", "sondercare_save_quote");

function sondercare_save_quote()
{
    global $wpdb;

    $table_name = $wpdb->prefix . "bed_selector_quotes";

    $data = json_decode(stripslashes($_POST["data"]), true);

    $answers = $data["answers"] ?? [];
    $bedSize = $data["bedSize"] ?? '';
    $subtotal = floatval($data["subtotal"] ?? 0);

    $quoteNumber = sanitize_text_field($data["quoteNumber"]);

    $bedModel = sondercare_get_bed_model($answers);
    $mattress = sondercare_get_mattress_name($answers);
    $accessories = sondercare_get_accessories_list($answers);
    $delivery = sondercare_get_delivery_method($answers);
    $warranty = sondercare_get_warranty($answers);

    $quote_data = [

        "quote_number" => $quoteNumber,
        "email" => sanitize_email($data["email"] ?? ""),
        "phone" => sanitize_text_field($data["phone"] ?? ""),
        "postal_code" => sanitize_text_field($data["postalCode"] ?? ""),
        "bed_size" => sanitize_text_field($bedSize),
        "bed_model" => sanitize_text_field($bedModel),
        "mattress" => sanitize_text_field($mattress),
        "accessories" => sanitize_text_field($accessories),
        "delivery_method" => sanitize_text_field($delivery),
        "warranty" => sanitize_text_field($warranty),
        "subtotal" => $subtotal,
        "answers" => wp_json_encode($answers),
        "created_at" => current_time("mysql"),
        "synced_to_sheets" => 0
    ];

    $result = $wpdb->replace(
        $table_name,
        $quote_data
    );

    if ($result !== false) {

        $quote_id = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT id FROM $table_name WHERE quote_number=%s",
                $quoteNumber
            )
        );

        sondercare_sync_to_google_sheets($quote_id);

        wp_send_json_success([
            "message"=>"Quote saved successfully"
        ]);

    } else {

        error_log("QUOTE ERROR: " . $wpdb->last_error);

        wp_send_json_error([
            "message"=>"Failed to save quote"
        ]);
    }
}

// Helper functions to extract readable data
function sondercare_get_bed_model($answers)
{
    if (isset($answers['q2-bed'])) {
        return $answers['q2-bed'] === 'premium' ? 'Aura Premium' : 'Aura Platinum';
    } elseif (isset($answers['q2-headboard'])) {
        return 'Aura Companion (Split King)';
    }
    return 'N/A';
}

function sondercare_get_mattress_name($answers)
{
    if (!isset($answers['q3'])) return 'None';  // ✅ CHANGED FROM q5 to q3
    
    $mattressMap = [
        'comfort-mattress' => 'Comfort',
        'dream-mattress' => 'Dream',
        'hybrid-mattress' => 'Signature Hybrid',
        'air-mattress' => 'Air',
        'none' => 'None Required'  // ✅ CHANGED FROM 'no-mattress-selected' to 'none'
    ];
    
    return $mattressMap[$answers['q3']] ?? 'N/A';
}

function sondercare_get_accessories_list($answers)
{
    $accessories = [];
    
    // All accessories now in q6
    if (isset($answers['q6']) && is_array($answers['q6'])) {
        foreach ($answers['q6'] as $item) {
            // Skip 'none' option
            if ($item === 'none') continue;
            $accessories[] = ucwords(str_replace('-', ' ', $item));
        }
    }
    
    // Premium bedding in q7
    if (isset($answers['q7']) && is_array($answers['q7'])) {
        foreach ($answers['q7'] as $item) {
            // Skip 'none' option
            if ($item === 'none') continue;
            $accessories[] = ucwords(str_replace('-', ' ', $item));
        }
    }
    
    return !empty($accessories) ? implode(', ', $accessories) : 'None';
}

function sondercare_get_delivery_method($answers)
{
    if (!isset($answers['q4'])) return 'N/A';  // ✅ CHANGED FROM q10 to q4
    
    $deliveryMap = [
        'standard' => 'Standard White Glove',
        'expedited' => 'Expedited White Glove',
        'rush' => 'Rush White Glove',
        'drop-ship' => 'Drop Ship',
        'pickup' => 'Pick-up'
    ];
    
    return $deliveryMap[$answers['q4']] ?? 'N/A';
}

function sondercare_get_warranty($answers)
{
    if (!isset($answers['q5'])) return 'N/A';  // ✅ CHANGED FROM q11 to q5
    
    return $answers['q5'] === '5year-parts-and-labor' ? '5 Year Parts & Labor' : '5 Year Parts Only';
}

// 7. SEND EMAIL NOTIFICATION WITH HTML
function sondercare_send_notification_email($data)
{
    $to = "himadri.vyas@sondercare.com";
    $quoteNumber = $data["quoteNumber"] ?? "N/A";
    $subject = "New Bed Selector Quote #" . $quoteNumber;

    // Generate HTML email for admin
    $admin_html = sondercare_generate_email_html($data, true);

    // Set headers for HTML email
    $headers = ["Content-Type: text/html; charset=UTF-8"];

    // Send to admin
    // wp_mail($to, $subject, $admin_html, $headers);

    $admin_sent = wp_mail(
    $to,
    $subject,
    $admin_html,
    $headers
);

error_log(
    'Admin email: ' .
    ($admin_sent ? 'SUCCESS' : 'FAILED')
);



    // Send to customer if email provided
    if (!empty($data["email"])) {
        $customer_subject = "Your SonderCare Bed Quote #" . $quoteNumber;
        $customer_html = sondercare_generate_email_html($data, false);
        // wp_mail($data["email"], $customer_subject, $customer_html, $headers);
        $customer_sent = wp_mail(
    sanitize_email($data["email"]),
    $customer_subject,
    $customer_html,
    $headers
);

error_log(
    'Customer email: ' .
    ($customer_sent ? 'SUCCESS' : 'FAILED')
);
    }

    // ✅ NEW: Also sync submission to Google Sheets
    if (!empty($data["name"]) && (!empty($data["email"]) || !empty($data["phone"]))) {
        sondercare_sync_submission_to_sheets($data);
    }

}

// NEW FUNCTION: Sync submission data to Google Sheets
function sondercare_sync_submission_to_sheets($data)
{
    $web_app_url = get_option('sondercare_sheets_url', '');
    
    if (empty($web_app_url)) {
        return false;
    }
    
$answers = $data["answers"] ?? [];
$bedSize = $data["bedSize"] ?? '';
    
    // Calculate subtotal
    $subtotal = sondercare_calculate_total_price($answers, $bedSize);
    
    // Extract readable data
    $bedModel = sondercare_get_bed_model($answers);
    $mattress = sondercare_get_mattress_name($answers);
    $accessories = sondercare_get_accessories_list($answers);
    $delivery = sondercare_get_delivery_method($answers);
    $warranty = sondercare_get_warranty($answers);
    
    // Prepare submission data for Google Sheets
    $sheet_data = [
        'type' => 'submission',  // This tells Apps Script it's a submission
        'quote_number' => $data["quoteNumber"],
        'date' => current_time('mysql'),
        'name' => $data["name"],
        'email' => $data["email"] ?? '',
        'phone' => $data["phone"] ?? '',  // ✅ NOW AVAILABLE FROM $data
        'contact_type' => $data["contactType"],
        'bed_size' => $bedSize,
        'bed_model' => $bedModel,
        'mattress' => $mattress,
        'accessories' => $accessories,
        'delivery' => $delivery,
        'warranty' => $warranty,
        'subtotal' => number_format($subtotal, 2, '.', ''),
        'notes' => $data["notes"] ?? ''
    ];
    
    // Send to Google Sheets
    $response = wp_remote_post($web_app_url, [
        'body' => json_encode($sheet_data),
        'headers' => ['Content-Type' => 'application/json'],
        'timeout' => 15
    ]);
    
    if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
        return true;
    }
    
    return false;
}
// 8. ADD ADMIN MENU
add_action("admin_menu", "sondercare_add_admin_menu");
 
function sondercare_add_admin_menu()
{
    // Main menu
    add_menu_page(
        "SonderCare Quotes",
        "SonderCare Quotes",
        "manage_options",
        "sondercare-quotes",
        "sondercare_admin_page",
        "dashicons-clipboard",
        26
    );
    
    // Settings submenu
    add_submenu_page(
        'sondercare-quotes',
        'Google Sheets Settings',
        'Settings',
        'manage_options',
        'sondercare-settings',
        'sondercare_settings_page'
    );
}
// 9. ADMIN PAGE HTML
function sondercare_admin_page()
{
    global $wpdb;
    $table_name = $wpdb->prefix . "bed_selector_submissions";

    // Handle delete
    if (isset($_GET["action"]) && $_GET["action"] === "delete" && isset($_GET["id"])) {
        check_admin_referer("delete_quote_" . $_GET["id"]);
        $wpdb->delete($table_name, ["id" => intval($_GET["id"])]);
        echo '<div class="notice notice-success"><p>Quote deleted.</p></div>';
    }

    // Handle export
    if (isset($_GET["action"]) && $_GET["action"] === "export") {
        sondercare_export_quotes_csv();
        exit();
    }

    // Get all submissions
    $submissions = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline">Bed Selector Quotes</h1>
        <a href="?page=sondercare-quotes&action=export" class="page-title-action">Export CSV</a>
        <hr class="wp-header-end">
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th style="width: 140px;">Quote Number</th>
                    <th style="width: 150px;">Date</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th style="width: 100px;">Bed Size</th>
                    <th style="width: 80px;">Type</th>
                    <th style="width: 100px;">Subtotal</th>
                    <th style="width: 180px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($submissions)): ?>
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 40px;">
                            No quotes yet. Quotes will appear here when customers complete the bed selector.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($submissions as $sub):
                        $answers = json_decode($sub->answers, true);
                        
                        // ✅ FIX ISSUE #3: Calculate subtotal with proper bed size
                        $bed_display = "Not selected";
                        $bedSizeForCalc = $sub->bed_size;
                        
                        if (!empty($sub->bed_size)) {
                            $bed_display = $sub->bed_size;
                        } elseif (isset($answers["q1"])) {
                            $bed_map = ["39" => '39" Twin XL', "48" => '48" Wide', "78" => '78" Split King'];
                            $bed_display = isset($bed_map[$answers["q1"]]) ? $bed_map[$answers["q1"]] : $answers["q1"];
                            
                            // Get the actual bed size for calculation
                            $q1_options = ["39" => "39", "48" => "48", "78" => "78(King)"];
                            $bedSizeForCalc = isset($q1_options[$answers["q1"]]) ? $q1_options[$answers["q1"]] : $answers["q1"];
                        }
                        
                        $subtotal = sondercare_calculate_total_price($answers, $bedSizeForCalc);
                    ?>
                        <tr>
                            <td><strong style="color: #2271b1;"><?php echo esc_html($sub->quote_number); ?></strong></td>
                            <td><?php echo date("M j, Y g:i a", strtotime($sub->created_at)); ?></td>
                            <td><strong><?php echo esc_html($sub->name); ?></strong></td>
                            <td>
                                <?php if ($sub->email): ?>
                                    <a href="mailto:<?php echo esc_attr($sub->email); ?>">
                                        📧 <?php echo esc_html($sub->email); ?>
                                    </a>
                                <?php else: ?>
                                    <a href="tel:<?php echo esc_attr($sub->phone); ?>">
                                        📞 <?php echo esc_html($sub->phone); ?>
                                    </a>
                                <?php endif; ?>
                            </td>
                            <td><?php echo esc_html($bed_display); ?></td>
                            <td>
                                <span style="background: <?php echo $sub->contact_type === "email" ? "#d4edda" : "#d1ecf1"; ?>; 
                                             padding: 3px 8px; border-radius: 4px; font-size: 0.85em;">
                                    <?php echo ucfirst($sub->contact_type); ?>
                                </span>
                            </td>
                            <td><strong style="color: #C3AB74;">$<?php echo number_format($subtotal, 0); ?></strong></td>
                            <td>
                                <a href="#" class="button view-details" data-id="<?php echo $sub->id; ?>">👁️ View</a>
                                <a href="?page=bed-selector-quotes&action=delete&id=<?php echo $sub->id; ?>&_wpnonce=<?php echo wp_create_nonce("delete_quote_" . $sub->id); ?>" 
                                   class="button button-link-delete" 
                                   onclick="return confirm('Delete this quote?')">🗑️ Delete</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
        
        <p style="margin-top: 20px; color: #666;">
            Total Quotes: <strong><?php echo count($submissions); ?></strong>
        </p>
    </div>
    
    <!-- Modal for viewing details -->
    <div id="quote-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; 
         background:rgba(0,0,0,0.7); z-index:9999; overflow-y: auto;">
        <div style="background:white; margin:50px auto; padding:30px; max-width:800px; 
             border-radius:8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
            <button onclick="document.getElementById('quote-modal').style.display='none'" 
                    style="float:right; font-size:28px; border:none; background:none; 
                    cursor:pointer; color:#999; line-height:1;">×</button>
            <div id="modal-content"></div>
        </div>
    </div>
    
    <script>
    jQuery(document).ready(function($) {
        $('.view-details').on('click', function(e) {
            e.preventDefault();
            var id = $(this).data('id');
            
            $.post(ajaxurl, {
                action: 'get_quote_details',
                id: id
            }, function(response) {
                if (response.success) {
                    $('#modal-content').html(response.data.html);
                    $('#quote-modal').show();
                }
            });
        });
    });
    </script>
    
    <style>
    .wp-list-table td { vertical-align: middle; }
    .wp-list-table a.button { margin: 2px; }
    </style>
    <?php
}

// 10. AJAX HANDLER FOR VIEWING DETAILS
add_action("wp_ajax_get_quote_details", "sondercare_get_quote_details");

function sondercare_get_quote_details()
{
    global $wpdb;
    $table_name = $wpdb->prefix . "bed_selector_submissions";
    $id = intval($_POST["id"]);

    $quote = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $id));

    if (!$quote) {
        wp_send_json_error();
    }

    $answers = json_decode($quote->answers, true);
    
    // Get proper bed size for calculation
    $bedSizeForCalc = $quote->bed_size;
    if (empty($bedSizeForCalc) && isset($answers["q1"])) {
        $q1_options = ["39" => "39", "48" => "48", "78" => "78(King)"];
        $bedSizeForCalc = isset($q1_options[$answers["q1"]]) ? $q1_options[$answers["q1"]] : $answers["q1"];
    }
    
    $totalPrice = sondercare_calculate_total_price($answers, $bedSizeForCalc);

    $question_map = [
        "q1" => "Which bed width is preferred?",
        "q2-bed" => "Which finish do you prefer?",
        "q2-headboard" => "Which finish do you prefer?",
        "q3" => "How tall is the user?",
        "q4" => "Is the user at risk of falling?",
        "q5" => "Which mattress do you prefer?",
        "q6" => "Add any safety accessories?",
        "q7" => "Add any comfort accessories?",
        "q8" => "Add any functionality accessories?",
        "q9" => "Add any premium bedding?",
        "q10" => "How would you like your bed delivered?",
        "q11" => "Any warranty upgrade?",
    ];

    $option_map = [
        "39" => '39" Twin XL',
        "48" => '48" Wide',
        "78" => '78" Split King',
        "premium" => "Woodgrain (Aura Premium)",
        "platinum" => "Upholstered (Aura Platinum)",
        "grey-headboard" => "Graphite Gray",
        "offwhite-headboard" => "Silverstone",
        "extensionkit-no" => 'Less than 6\'2"',
        "extensionkit-yes" => '6\'2" or taller',
        "safety-acc-no" => "Limited risk",
        "safety-acc-yes" => "Mid - High risk",
        "comfort-mattress" => "Comfort",
        "dream-mattress" => "Dream",
        "hybrid-mattress" => "Signature Hybrid",
        "air-mattress" => "Air",
        "no-mattress-selected" => "None Required",
        "helper-bar" => "Helper Bar",
        "additional-rails" => "Additional Rails",
        "underbed-light" => "Auto Nightlight",
        "rail-pads" => "Rail Pads (Pair)",
        "overbed-table" => "Overbed Table",
        "rail-organizer" => "Rail Organizer",
        "reading-light" => "Reading Light",
        "extension-kit" => "Extension Kit",
        "battery-backup" => "Battery Back-up",
        "transport-cart" => "Transport Cart",
        "microfiber-sheets" => "Microfiber Sheets",
        "cotton-sheets" => "Cotton Sheets",
        "heavenly-pillow" => "Heavenly Pillow",
        "duvet-&-duvetcover" => "Duvet and Cover",
        "standard" => "Standard White Glove Delivery",
        "expedited" => "Expedited White Glove Delivery",
        "rush" => "Rush White Glove Delivery",
        "drop-ship" => "Drop Ship (Driveway)",
        "pickup" => "Pick-up at Warehouse",
        "5year-only-parts" => "5 Year Warranty Parts Only",
        "5year-parts-and-labor" => "5 Year Warranty Full Parts & Labor",
    ];

    $html = '<h2 style="margin-top:0; color:#2271b1;">Quote Details</h2>';
    $html .= '<div style="background:#f0f6fc; padding:20px; border-radius:8px; margin-bottom:20px;">';
    $html .= '<h3 style="margin:0 0 10px 0; color:#2271b1;">Quote #' . esc_html($quote->quote_number) . '</h3>';
    $html .= '<p style="margin:5px 0;"><strong>Date:</strong> ' . date("F j, Y g:i a", strtotime($quote->created_at)) . '</p>';
    $html .= '<p style="margin:5px 0;"><strong>Name:</strong> ' . esc_html($quote->name) . '</p>';
    $html .= '<p style="margin:5px 0;"><strong>Email:</strong> ' . ($quote->email ? esc_html($quote->email) : "N/A") . '</p>';
    $html .= '<p style="margin:5px 0;"><strong>Phone:</strong> ' . ($quote->phone ? esc_html($quote->phone) : "N/A") . '</p>';

    $bed_display = "Not selected";
    if (!empty($quote->bed_size)) {
        $bed_display = $quote->bed_size;
    } elseif (isset($answers["q1"])) {
        $bed_sizes = ["39" => '39" Twin XL', "48" => '48" Wide', "78" => '78" Split King'];
        $bed_display = $bed_sizes[$answers["q1"]] ?? $answers["q1"];
    }

    $html .= '<p style="margin:5px 0;"><strong>Bed Size:</strong> ' . esc_html($bed_display) . '</p>';
    $html .= '<p style="margin:5px 0;"><strong>Total Price:</strong> <span style="color:#C3AB74; font-size:1.2em; font-weight:700;">$' . number_format($totalPrice, 0) . '</span></p>';

    if ($quote->notes) {
        $html .= '<p style="margin:10px 0 0 0;"><strong>Notes:</strong><br>' . nl2br(esc_html($quote->notes)) . '</p>';
    }
    $html .= '</div>';

    $html .= '<h3>Customer Selections:</h3>';
    $html .= '<table style="width:100%; border-collapse:collapse;">';
    $html .= '<thead><tr style="background:#f0f6fc;">';
    $html .= '<th style="padding:10px; text-align:left; border:1px solid #ddd;">Question</th>';
    $html .= '<th style="padding:10px; text-align:left; border:1px solid #ddd;">Answer</th>';
    $html .= '<th style="padding:10px; text-align:right; border:1px solid #ddd;">Price</th>';
    $html .= '</tr></thead><tbody>';

    foreach ($answers as $questionId => $answer) {
        $question_text = isset($question_map[$questionId]) ? $question_map[$questionId] : $questionId;

        if (is_array($answer)) {
            if (empty($answer)) {
                $html .= '<tr>';
                $html .= '<td style="padding:10px; border:1px solid #ddd; font-weight:600;">' . esc_html($question_text) . '</td>';
                $html .= '<td style="padding:10px; border:1px solid #ddd;"><span style="color:#999; font-style:italic;">None selected</span></td>';
                $html .= '<td style="padding:10px; border:1px solid #ddd; text-align:right;">—</td>';
                $html .= '</tr>';
            } else {
                foreach ($answer as $index => $opt_id) {
                    $answer_text = isset($option_map[$opt_id]) ? $option_map[$opt_id] : $opt_id;
                    $itemPrice = sondercare_get_option_price($opt_id, $bedSizeForCalc);
                    $priceDisplay = $itemPrice !== null ? '$' . number_format($itemPrice, 0) : '—';

                    $html .= '<tr>';
                    $html .= '<td style="padding:10px; border:1px solid #ddd; font-weight:600;">' . ($index === 0 ? esc_html($question_text) : '') . '</td>';
                    $html .= '<td style="padding:10px; border:1px solid #ddd;">' . esc_html($answer_text) . '</td>';
                    $html .= '<td style="padding:10px; border:1px solid #ddd; text-align:right; color:#C3AB74; font-weight:600;">' . $priceDisplay . '</td>';
                    $html .= '</tr>';
                }
            }
        } else {
            $answer_text = isset($option_map[$answer]) ? $option_map[$answer] : $answer;

            if ($questionId === "q1") {
                $bed_sizes = ["39" => '39" Twin XL', "48" => '48" Wide', "78" => '78" Split King'];
                $bed_text = $bed_sizes[$answer] ?? $answer;

                if (isset($answers["q2-bed"])) {
                    $finish = isset($option_map[$answers["q2-bed"]]) ? $option_map[$answers["q2-bed"]] : "";
                    $answer_text = $bed_text . " - " . $finish;
                } elseif (isset($answers["q2-headboard"])) {
                    $finish = isset($option_map[$answers["q2-headboard"]]) ? $option_map[$answers["q2-headboard"]] : "";
                    $answer_text = $bed_text . " - " . $finish;
                } else {
                    $answer_text = $bed_text;
                }
            }

            if ($questionId === "q2-bed" || $questionId === "q2-headboard") {
                continue;
            }

            $itemPrice = null;
            if ($questionId === "q1") {
                if (isset($answers["q2-bed"])) {
                    $itemPrice = sondercare_get_option_price($answers["q2-bed"], $bedSizeForCalc);
                } elseif (isset($answers["q2-headboard"])) {
                    $itemPrice = sondercare_get_option_price($answers["q2-headboard"], $bedSizeForCalc);
                }
            } else {
                $itemPrice = sondercare_get_option_price($answer, $bedSizeForCalc);
            }

            $priceDisplay = $itemPrice !== null ? '$' . number_format($itemPrice, 0) : '—';

            $html .= '<tr>';
            $html .= '<td style="padding:10px; border:1px solid #ddd; font-weight:600;">' . esc_html($question_text) . '</td>';
            $html .= '<td style="padding:10px; border:1px solid #ddd;">' . esc_html($answer_text) . '</td>';
            $html .= '<td style="padding:10px; border:1px solid #ddd; text-align:right; color:#C3AB74; font-weight:600;">' . $priceDisplay . '</td>';
            $html .= '</tr>';
        }
    }

    $html .= '</tbody></table>';

    wp_send_json_success(['html' => $html]);
}

// 11. CSV EXPORT FUNCTION
function sondercare_export_quotes_csv()
{
    global $wpdb;
    $table_name = $wpdb->prefix . "bed_selector_submissions";
    $quotes = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");

    header("Content-Type: text/csv");
    header('Content-Disposition: attachment; filename="bed-quotes-' . date("Y-m-d") . '.csv"');

    $output = fopen("php://output", "w");
    fputcsv($output, ["Quote Number", "Date", "Name", "Email", "Phone", "Bed Size", "Type", "Subtotal", "Notes"]);

    foreach ($quotes as $quote) {
        $answers = json_decode($quote->answers, true);
        
        // Get proper bed size for calculation
        $bedSizeForCalc = $quote->bed_size;
        if (empty($bedSizeForCalc) && isset($answers["q1"])) {
            $q1_options = ["39" => "39", "48" => "48", "78" => "78(King)"];
            $bedSizeForCalc = isset($q1_options[$answers["q1"]]) ? $q1_options[$answers["q1"]] : $answers["q1"];
        }
        
        $subtotal = sondercare_calculate_total_price($answers, $bedSizeForCalc);
        
        fputcsv($output, [
            $quote->quote_number,
            date("Y-m-d H:i:s", strtotime($quote->created_at)),
            $quote->name,
            $quote->email,
            $quote->phone,
            $quote->bed_size,
            $quote->contact_type,
            '$' . number_format($subtotal, 0),
            $quote->notes
        ]);
    }

    fclose($output);
}

// 12. GOOGLE SHEETS INTEGRATION
function sondercare_sync_to_google_sheets($quote_id)
{
    global $wpdb;
    $table_name = $wpdb->prefix . "bed_selector_quotes";
    
    // Get the quote data
    $quote = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $quote_id));
    
    if (!$quote) {
        return false;
    }
    
    // Get your Google Sheets Web App URL (you'll need to create this)
    $web_app_url = get_option('sondercare_sheets_url', '');
    
    // If no URL is set, skip sync
    if (empty($web_app_url)) {
        return false;
    }
    
    // Prepare data for Google Sheets
    $sheet_data = [
        'quote_number' => $quote->quote_number,
        'date' => $quote->created_at,
        'email' => $quote->email ?? '',         
        'phone' => $quote->phone ?? '',           
        'postal_code' => $quote->postal_code ?? '',
        'bed_size' => $quote->bed_size,
        'bed_model' => $quote->bed_model,
        'mattress' => $quote->mattress,
        'accessories' => $quote->accessories,
        'delivery' => $quote->delivery_method,
        'warranty' => $quote->warranty,
        'subtotal' => number_format($quote->subtotal, 2)
    ];
    
    // Send to Google Sheets
    $response = wp_remote_post($web_app_url, [
        'body' => json_encode($sheet_data),
        'headers' => ['Content-Type' => 'application/json'],
        'timeout' => 15
    ]);
    
    // Mark as synced if successful
    if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
        $wpdb->update(
            $table_name,
            ['synced_to_sheets' => 1],
            ['id' => $quote_id],
            ['%d'],
            ['%d']
        );
        return true;
    }
    
    return false;
}

// 13. ADMIN SETTINGS PAGE FOR GOOGLE SHEETS URL
function sondercare_settings_page()
{
    // Save settings
    if (isset($_POST['sondercare_save_settings'])) {
        update_option('sondercare_sheets_url', sanitize_text_field($_POST['sheets_url']));
        echo '<div class="updated"><p>Settings saved!</p></div>';
    }
    
    $sheets_url = get_option('sondercare_sheets_url', '');
    
    ?>
    <div class="wrap">
        <h1>SonderCare Bed Selector Settings</h1>
        
        <form method="post">
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="sheets_url">Google Sheets Web App URL</label>
                    </th>
                    <td>
                        <input type="url" 
                               name="sheets_url" 
                               id="sheets_url" 
                               value="<?php echo esc_attr($sheets_url); ?>" 
                               class="regular-text"
                               placeholder="https://script.google.com/macros/s/...">
                        <p class="description">
                            Enter your Google Apps Script Web App URL to sync quotes to Google Sheets.
                            <br><a href="#instructions" onclick="document.getElementById('setup-instructions').style.display='block'">View Setup Instructions</a>
                        </p>
                    </td>
                </tr>
            </table>
            
            <p class="submit">
                <input type="submit" 
                       name="sondercare_save_settings" 
                       class="button button-primary" 
                       value="Save Settings">
            </p>
        </form>
        
        <div id="setup-instructions" style="display:none; margin-top:30px; padding:20px; background:#f0f6fc; border-left:4px solid #2271b1;">
            <h2>Google Sheets Setup Instructions</h2>
            <ol>
                <li>Create a new Google Sheet for your quotes</li>
                <li>Add headers: Quote Number, Date, Bed Size, Bed Model, Mattress, Accessories, Delivery, Warranty, Subtotal</li>
                <li>Go to Extensions → Apps Script</li>
                <li>Paste the provided Google Apps Script code (see below)</li>
                <li>Deploy as Web App (Anyone can access)</li>
                <li>Copy the Web App URL and paste it above</li>
            </ol>
            
            <h3>Google Apps Script Code:</h3>
            <textarea readonly style="width:100%; height:200px; font-family:monospace; font-size:12px;">
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.quote_number,
    data.date,
    data.bed_size,
    data.bed_model,
    data.mattress,
    data.accessories,
    data.delivery,
    data.warranty,
    data.subtotal
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
            </textarea>
        </div>
    </div>
    <?php
}

?>
