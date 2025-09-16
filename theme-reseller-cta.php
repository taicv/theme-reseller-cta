<?php
/**
 * Plugin Name:       Theme Reseller CTA
 * Description:       Enqueue the theme-reseller-cta JavaScript on the front end.
 * Version:           1.0.0
 * Author:            Your Name
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       theme-reseller-cta
 * Requires at least: 5.0
 * Requires PHP:      7.2
 *
 * @package Theme_Reseller_CTA
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'THEME_RESELLER_CTA_VERSION' ) ) {
	define( 'THEME_RESELLER_CTA_VERSION', '1.0.0' );
}

// Include configuration file
require_once plugin_dir_path( __FILE__ ) . 'theme-reseller-cta-config.php';

/**
 * Enqueue front-end assets for Theme Reseller CTA.
 *
 * @return void
 */
function trc_enqueue_frontend_assets() {
	// Only enqueue on the front end.
	if ( is_admin() ) {
		return;
	}

	// Only enqueue on the homepage.
	if ( ! is_front_page() ) {
		return;
	}

	$relative_js_path = 'asset/js/theme-reseller-cta.js';
	$file_path        = plugin_dir_path( __FILE__ ) . $relative_js_path;
	$file_url         = plugins_url( $relative_js_path, __FILE__ );

	$version = THEME_RESELLER_CTA_VERSION;
	if ( file_exists( $file_path ) ) {
		$mtime   = filemtime( $file_path );
		$version = $mtime ? (string) $mtime : $version;
	}

	wp_register_script(
		'theme-reseller-cta',
		$file_url,
		array(),
		$version,
		true
	);

	// Localize script with configuration data
	wp_localize_script(
		'theme-reseller-cta',
		'trcConfig',
		array(
			'apiUrl'         => defined( 'TRC_ENDPOINT_DOMAIN' ) ? TRC_ENDPOINT_DOMAIN . "/wp-json/api/v1/reseller/" : '/wp-json/api/v1/reseller/',
			'defaultWebsite' => defined( 'TRC_DEFAULT_WEBSITE' ) ? TRC_DEFAULT_WEBSITE : 'https://thewebgo.com/',
			'defaultPhone'   => defined( 'TRC_DEFAULT_PHONE' ) ? TRC_DEFAULT_PHONE : '0988 888 888',
			'defaultName'    => defined( 'TRC_DEFAULT_NAME' ) ? TRC_DEFAULT_NAME : 'thewebgo.com',
			'buttonPosition' => defined( 'TRC_BUTTON_POSITION' ) ? TRC_BUTTON_POSITION : 'bottom-right',
			'buttonColor'    => defined( 'TRC_BUTTON_COLOR' ) ? TRC_BUTTON_COLOR : '#007cba',
			'buttonSpacing'  => defined( 'TRC_BUTTON_SPACING' ) ? TRC_BUTTON_SPACING : '10',
			'enableButton'   => defined( 'TRC_ENABLE_BUTTON' ) ? TRC_ENABLE_BUTTON : true,
			'modalBackgroundColor' => defined( 'TRC_MODAL_BACKGROUND_COLOR' ) ? TRC_MODAL_BACKGROUND_COLOR : '#1e73be',
			'defaultMessage' => defined( 'TRC_DEFAULT_MESSAGE' ) ? TRC_DEFAULT_MESSAGE : 'Bạn đang xem demo từ',
		)
	);

	wp_enqueue_script( 'theme-reseller-cta' );
}
add_action( 'wp_enqueue_scripts', 'trc_enqueue_frontend_assets' );



add_action('rest_api_init', 'theme_reseller_register_reseller_endpoint');

function theme_reseller_register_reseller_endpoint() {
    register_rest_route('api/v1', '/reseller/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'theme_reseller_get_reseller_name',
        'permission_callback' => '__return_true', // Public access
        'args' => array(
            'id' => array(
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
        ),
    ));
}

function theme_reseller_get_reseller_name($request) {
    $user_id = (int) $request['id'];
    $user = get_user_by('ID', $user_id);
    
    if (!$user) {
        return new WP_Error('user_not_found', 'Reseller not found', array('status' => 404));
    }

    $billing_phone = get_user_meta($user_id, 'billing_phone', true);
    $billing_phone = is_string($billing_phone) ? sanitize_text_field($billing_phone) : '';


    nocache_headers(); 
    return rest_ensure_response(array(
        'code'    => 'success',
        'message' => 'Reseller found successfully',
        'data'    => array(
            'status' => 200,
            'reseller' => array(
                'id'            => $user->ID,
                'nickname'      => $user->nickname,
                'billing_phone' => $billing_phone,
                'url'          => $user->user_url,
            )
        )
    ));
}


