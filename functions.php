<?php
/**
 * Theme functions and definitions.
 *
 * For additional information on potential customization options,
 * read the developers' documentation:
 *
 * https://developers.elementor.com/docs/hello-elementor-theme/
 *
 * @package HelloElementorChild
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'HELLO_ELEMENTOR_CHILD_VERSION', '2.0.0' );

/**
 * Load child theme scripts & styles.
 *
 * @return void
 */
function hello_elementor_child_scripts_styles() {

	wp_enqueue_style(
		'hello-elementor-child-style',
		get_stylesheet_directory_uri() . '/style.css',
		[
			'hello-elementor-theme-style',
		],
		HELLO_ELEMENTOR_CHILD_VERSION
	);

}
add_action( 'wp_enqueue_scripts', 'hello_elementor_child_scripts_styles', 20 );

// Add to cart ajax
function sc_ajaxcart_enqueue() {
      wp_enqueue_script( 'sc-ajax-script', get_stylesheet_directory_uri() . '/scripts.js', array('jquery'), '1.0.2' );
      wp_localize_script( 'sc-ajax-script', 'sc_ajax', array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );
 }
 add_action( 'wp_enqueue_scripts', 'sc_ajaxcart_enqueue' );

function sc_ajax_add_to_cart() {
    global $woocommerce;

	$products = $_POST['products'];
    $products = explode(",", $products);

    $woocommerce->cart->empty_cart();

    if( is_array($products) ) {
        foreach( $products as $productID ) {
            $productID = intval($productID);

            $woocommerce->cart->add_to_cart($productID, 1);
        }
    }

    die();
}
add_action("wp_ajax_sc_ajax_add_to_cart", "sc_ajax_add_to_cart");
add_action("wp_ajax_nopriv_sc_ajax_add_to_cart", "sc_ajax_add_to_cart");

// new code
// THIS IS ALL YOU NEED FOR OPTION 1

// 1. CREATE DATABASE TABLE
function sondercare_create_submissions_table() {
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
}
add_action('after_switch_theme', 'sondercare_create_submissions_table');

// 2. HANDLE FORM SUBMISSIONS (AJAX)
add_action('wp_ajax_submit_bed_selector', 'sondercare_handle_submission');
add_action('wp_ajax_nopriv_submit_bed_selector', 'sondercare_handle_submission');

function sondercare_handle_submission() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'bed_selector_submissions';
    
    // Get and decode data
    $data = json_decode(stripslashes($_POST['data']), true);
    
    // Insert into database
    $result = $wpdb->insert(
        $table_name,
        array(
            'quote_number' => sanitize_text_field($data['quoteNumber'] ?? ''),
            'contact_type' => sanitize_text_field($data['contactType']),
            'name' => sanitize_text_field($data['name']),
            'email' => sanitize_email($data['email'] ?? ''),
            'phone' => sanitize_text_field($data['phone'] ?? ''),
            'bed_size' => sanitize_text_field($data['bedSize'] ?? ''),
            'answers' => wp_json_encode($data['answers']),
            'notes' => sanitize_textarea_field($data['notes'] ?? ''),
            'created_at' => current_time('mysql')
        ),
        array('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')
    );
    
    if ($result) {
        // Send email notification
        sondercare_send_notification_email($data);
        wp_send_json_success(array('message' => 'Quote saved successfully'));
    } else {
        wp_send_json_error(array('message' => 'Failed to save quote'));
    }
}

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

// 4. ADD ADMIN MENU
add_action('admin_menu', 'sondercare_add_admin_menu');

function sondercare_add_admin_menu() {
    add_menu_page(
        'Bed Quotes',           // Page title
        'Bed Quotes',           // Menu title
        'manage_options',       // Capability
        'bed-selector-quotes',  // Menu slug
        'sondercare_admin_page',// Callback function
        'dashicons-clipboard',  // Icon
        26                      // Position
    );
}

// 5. ADMIN PAGE HTML
function sondercare_admin_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'bed_selector_submissions';
    
    // Handle delete
    if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
        check_admin_referer('delete_quote_' . $_GET['id']);
        $wpdb->delete($table_name, array('id' => intval($_GET['id'])));
        echo '<div class="notice notice-success"><p>Quote deleted.</p></div>';
    }
    
    // Handle export
    if (isset($_GET['action']) && $_GET['action'] === 'export') {
        sondercare_export_quotes_csv();
        exit;
    }
    
    // Get all submissions
    $submissions = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
    
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline">Bed Selector Quotes</h1>
        <a href="?page=bed-selector-quotes&action=export" class="page-title-action">Export CSV</a>
        <hr class="wp-header-end">
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th style="width: 140px;">Quote Number</th>
                    <th style="width: 150px;">Date</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th style="width: 80px;">Bed Size</th>
                    <th style="width: 80px;">Type</th>
                    <th style="width: 180px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($submissions)): ?>
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 40px;">
                            No quotes yet. Quotes will appear here when customers complete the bed selector.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($submissions as $sub): ?>
                        <tr>
                            <td>
                                <strong style="color: #2271b1;">
                                    <?php echo esc_html($sub->quote_number); ?>
                                </strong>
                            </td>
                            <td><?php echo date('M j, Y g:i a', strtotime($sub->created_at)); ?></td>
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
                            <td><?php echo esc_html($sub->bed_size ?: '—'); ?></td>
                            <td>
                                <span style="background: <?php echo $sub->contact_type === 'email' ? '#d4edda' : '#d1ecf1'; ?>; 
                                             padding: 3px 8px; border-radius: 4px; font-size: 0.85em;">
                                    <?php echo ucfirst($sub->contact_type); ?>
                                </span>
                            </td>
                            <td>
                                <a href="#" class="button view-details" data-id="<?php echo $sub->id; ?>">
                                    👁️ View
                                </a>
                                <a href="?page=bed-selector-quotes&action=delete&id=<?php echo $sub->id; ?>&_wpnonce=<?php echo wp_create_nonce('delete_quote_' . $sub->id); ?>" 
                                   class="button button-link-delete" 
                                   onclick="return confirm('Delete this quote?')">
                                    🗑️ Delete
                                </a>
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

// 6. AJAX HANDLER FOR VIEWING DETAILS
add_action('wp_ajax_get_quote_details', 'sondercare_get_quote_details');

function sondercare_get_quote_details() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'bed_selector_submissions';
    $id = intval($_POST['id']);
    
    $quote = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $id));
    
    if (!$quote) {
        wp_send_json_error();
    }
    
    $answers = json_decode($quote->answers, true);
    
    $html = '<h2 style="margin-top:0; color:#2271b1;">Quote Details</h2>';
    
    // Quote info box
    $html .= '<div style="background:#f0f6fc; padding:20px; border-radius:8px; margin-bottom:20px;">';
    $html .= '<h3 style="margin:0 0 10px 0; color:#2271b1;">Quote #' . esc_html($quote->quote_number) . '</h3>';
    $html .= '<p style="margin:5px 0;"><strong>Date:</strong> ' . date('F j, Y g:i a', strtotime($quote->created_at)) . '</p>';
    $html .= '<p style="margin:5px 0;"><strong>Name:</strong> ' . esc_html($quote->name) . '</p>';
    $html .= '<p style="margin:5px 0;"><strong>Email:</strong> ' . ($quote->email ? esc_html($quote->email) : 'N/A') . '</p>';
    $html .= '<p style="margin:5px 0;"><strong>Phone:</strong> ' . ($quote->phone ? esc_html($quote->phone) : 'N/A') . '</p>';
    $html .= '<p style="margin:5px 0;"><strong>Bed Size:</strong> ' . esc_html($quote->bed_size ?: 'Not specified') . '</p>';
    if ($quote->notes) {
        $html .= '<p style="margin:10px 0 0 0;"><strong>Notes:</strong><br>' . nl2br(esc_html($quote->notes)) . '</p>';
    }
    $html .= '</div>';
    
    // Selections
    $html .= '<h3>Customer Selections:</h3>';
    $html .= '<table style="width:100%; border-collapse:collapse;">';
    $html .= '<thead><tr style="background:#f0f6fc;">';
    $html .= '<th style="padding:10px; text-align:left; border:1px solid #ddd;">Question</th>';
    $html .= '<th style="padding:10px; text-align:left; border:1px solid #ddd;">Answer</th>';
    $html .= '</tr></thead><tbody>';
    
    foreach ($answers as $questionId => $answer) {
        $html .= '<tr>';
        $html .= '<td style="padding:10px; border:1px solid #ddd;"><strong>' . esc_html($questionId) . '</strong></td>';
        $html .= '<td style="padding:10px; border:1px solid #ddd;">' . esc_html(is_array($answer) ? implode(', ', $answer) : $answer) . '</td>';
        $html .= '</tr>';
    }
    
    $html .= '</tbody></table>';
    
    wp_send_json_success(array('html' => $html));
}

// 7. CSV EXPORT FUNCTION
function sondercare_export_quotes_csv() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'bed_selector_submissions';
    
    $quotes = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
    
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="bed-quotes-' . date('Y-m-d') . '.csv"');
    
    $output = fopen('php://output', 'w');
    
    // Headers
    fputcsv($output, array('Quote Number', 'Date', 'Name', 'Email', 'Phone', 'Bed Size', 'Type', 'Notes'));
    
    // Data
    foreach ($quotes as $quote) {
        fputcsv($output, array(
            $quote->quote_number,
            date('Y-m-d H:i:s', strtotime($quote->created_at)),
            $quote->name,
            $quote->email,
            $quote->phone,
            $quote->bed_size,
            $quote->contact_type,
            $quote->notes
        ));
    }
    
    fclose($output);
}
?>
