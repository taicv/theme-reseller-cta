<?php
/**
 * Theme Reseller CTA Configuration
 *
 * This file contains configuration settings for the Theme Reseller CTA plugin.
 * You can modify these values to customize the plugin behavior.
 *
 * @package Theme_Reseller_CTA
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * API Endpoint Configuration
 */
// The domain/base URL for the reseller API endpoint
define( 'TRC_ENDPOINT_DOMAIN', 'https://thewebgo.com' );

/**
 * Default Reseller Information
 * These values will be used when the API request fails or returns no data
 */
// Default reseller website URL
define( 'TRC_DEFAULT_WEBSITE', 'https://thewebgo.com/' );

// Default reseller phone number
define( 'TRC_DEFAULT_PHONE', '0989 072 072' );

// Default reseller name/nickname
define( 'TRC_DEFAULT_NAME', 'thewebgo.com' );

// Default reseller name/nickname
define( 'TRC_DEFAULT_MESSAGE', 'Bạn đang xem demo từ thewebgo.com' );

/**
 * Additional Configuration Options
 */
// Button position (bottom-right, bottom-left, top-right, top-left)
define( 'TRC_BUTTON_POSITION', 'bottom-right' );

// Button color (hex color code)
define( 'TRC_BUTTON_COLOR', '#ffffff' );

// Modal background color (hex color code)
define( 'TRC_MODAL_BACKGROUND_COLOR', '#1e73be' );

// Button spacing (px)
define( 'TRC_BUTTON_SPACING', '0' );

// Enable/disable the floating button (true/false)
define( 'TRC_ENABLE_BUTTON', true );
