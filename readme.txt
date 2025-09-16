=== Theme Reseller CTA ===
Contributors: yourname
Tags: reseller, cta, contact, floating button, theme demo
Requires at least: 5.0
Tested up to: 6.8
Requires PHP: 7.2
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Adds a floating contact button for theme resellers on demo sites.

== Description ==

Simple floating contact button for theme demo sites. Shows reseller contact info via modal. Supports API integration for dynamic data.

== Installation ==

1. Upload plugin to `/wp-content/plugins/`
2. Activate through WordPress admin
3. Configure in `theme-reseller-cta-config.php`
4. For API usage: Add REST API code to theme's `functions.php`

== How to Setup API ==

Add this code to your theme's `functions.php`:

`add_action('rest_api_init', 'theme_reseller_register_reseller_endpoint');

function theme_reseller_register_reseller_endpoint() {
    register_rest_route('api/v1', '/reseller/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'theme_reseller_get_reseller_name',
        'permission_callback' => '__return_true',
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
}`

== How to Configure ==

Edit `theme-reseller-cta-config.php`:

* `TRC_ENDPOINT_DOMAIN` - API domain
* `TRC_DEFAULT_WEBSITE` - Default website
* `TRC_DEFAULT_PHONE` - Default phone
* `TRC_DEFAULT_NAME` - Default name
* `TRC_BUTTON_POSITION` - Position (bottom-right, bottom-left, top-right, top-left)
* `TRC_BUTTON_COLOR` - Button color
* `TRC_ENABLE_BUTTON` - Enable/disable

== How to Use ==

1. **Static Mode**: Configure defaults in config file
2. **API Mode**: Use URL with `?id=123` parameter
3. Button appears on homepage only
4. Click button to show contact modal

== How to Update Reseller Information ==

To update reseller data for API mode:

1. **Go to main site** (which hosts the API)
2. **Login to your WooCommerce account**
3. **Go to Account page**
4. **Update nickname** - This shows as reseller name
5. **Update website** - Enter in website field
6. **Update phone** - Update billing phone number
7. **Save changes**

Changes will appear immediately on demo sites using that reseller ID.
