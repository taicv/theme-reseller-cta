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
 * Default Message Configuration
 */
// Default message shown in modal
define( 'TRC_DEFAULT_MESSAGE', 'Bạn đang xem demo từ' );

/**
 * Additional Configuration Options
 */
// Button position (bottom-right, bottom-left, top-right, top-left)
define( 'TRC_BUTTON_POSITION', 'bottom-right' );

// Button color (hex color code)
define( 'TRC_BUTTON_COLOR', '#1e73be' );

// Modal background color (hex color code)
define( 'TRC_MODAL_BACKGROUND_COLOR', '#ffffff' );

// Button spacing (px)
define( 'TRC_BUTTON_SPACING', '0' );

// Enable/disable the floating button (true/false)
define( 'TRC_ENABLE_BUTTON', true );

/**
 * HTML Template Configuration
 */
// Button HTML template (use {BUTTON_COLOR}, {MODAL_BACKGROUND_COLOR} for dynamic colors)
define( 'TRC_BUTTON_HTML', '[i]' );

// Modal content HTML template (use {NICKNAME}, {BILLING_PHONE}, {URL}, {MESSAGE} for dynamic content)
define( 'TRC_MODAL_HTML', '
<span class="trc-close">×</span>
<p>{MESSAGE} {NICKNAME}</p>
<a class="trc-btn" href="tel:{BILLING_PHONE}">📞 {BILLING_PHONE}</a>
<a class="trc-btn" href="{URL}" target="_blank">🌐 WEBSITE</a>
' );

/**
 * CSS Style Configuration
 */
// Custom CSS for the floating button
define( 'TRC_BUTTON_CSS', '
.trc-float-btn {
    position: fixed;
    background: {BUTTON_COLOR};
    width: 20px;
    height: 20px;
    border-radius: 0;
    border: none;
    color: {MODAL_BACKGROUND_COLOR};
    font-size: 12px;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    text-transform: lowercase;
    font-family: serif;
    letter-spacing: 1px;
}
' );

// Custom CSS for the modal
define( 'TRC_MODAL_CSS', '
.trc-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    font-size: 85%;
}
.trc-modal-content {
    color: {BUTTON_COLOR};
    background: {MODAL_BACKGROUND_COLOR};
    padding: 30px;
    border-radius: 10px;
    text-align: center;
	max-width: 70vw;
	width: fit-content;
    position: relative;
}
.trc-btn {
    display: inline-block;
    margin: 10px;
    padding: 12px 24px;
    background: {BUTTON_COLOR};
    color: {MODAL_BACKGROUND_COLOR};
    text-decoration: none;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-weight: bold;
}
.trc-btn:hover {
    opacity: 0.8;
	color: {MODAL_BACKGROUND_COLOR};
}
.trc-close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 24px;
    cursor: pointer;
}
' );

/**
 * Flexible Field Mapping Configuration
 * Configure which fields to fetch from API and how to map them
 */
// Field mapping from API response to local variables
// Format: 'local_field_name' => 'api.path.to.field'
// Use dot notation to access nested properties (e.g., 'data.reseller.nickname')
define( 'TRC_FIELD_MAPPING', array(
	'nickname'      => 'data.reseller.nickname',
	'billing_phone' => 'data.reseller.billing_phone', 
	'url'          => 'data.reseller.url',
) );

// Default values for each field (used when API fails or field is missing)
define( 'TRC_DEFAULT_VALUES', array(
	'nickname'      => 'thewebgo.com',
	'billing_phone' => '0988 888 888',
	'url'          => 'https://thewebgo.com/',
) );