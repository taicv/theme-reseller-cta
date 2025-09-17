=== Theme Reseller CTA ===
Contributors: yourname
Tags: reseller, cta, contact, floating button, theme demo
Requires at least: 5.0
Tested up to: 6.8
Requires PHP: 7.2
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Advanced floating contact button with complete customization, flexible API mapping, and rich configuration options.

== Description ==

Professional floating contact button system for theme demo sites with enterprise-level customization capabilities.

**🎨 Complete UI Customization**
* Custom HTML templates for button and modal
* Custom CSS styling with dynamic variables
* Flexible positioning and responsive design
* Template variables for dynamic content

**🔄 Flexible API Integration**
* Unlimited field mapping from any API structure
* Dot notation support for nested data access
* Configurable response structure handling
* Smart data caching with cookies

**⚙️ Rich Configuration System**
* HTML template customization
* CSS style configuration
* Field mapping configuration
* Default value management

== Installation ==

1. Upload plugin to `/wp-content/plugins/`
2. Activate through WordPress admin
3. Configure in `theme-reseller-cta-config.php`
4. Add REST API code to theme's `functions.php` (for API mode)

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

**Basic Settings:**
* `TRC_ENDPOINT_DOMAIN` - API domain
* `TRC_BUTTON_POSITION` - Position (bottom-right, bottom-left, top-right, top-left)
* `TRC_BUTTON_COLOR` - Button color
* `TRC_MODAL_BACKGROUND_COLOR` - Modal background
* `TRC_ENABLE_BUTTON` - Enable/disable

**HTML Templates:**
* `TRC_BUTTON_HTML` - Custom button HTML with variables
* `TRC_MODAL_HTML` - Custom modal HTML with variables

**CSS Styling:**
* `TRC_BUTTON_CSS` - Custom button CSS with variables
* `TRC_MODAL_CSS` - Custom modal CSS with variables

**Field Mapping (No Limits):**
* `TRC_FIELD_MAPPING` - Map any API fields using dot notation
* `TRC_DEFAULT_VALUES` - Default values for each field

== How to Customize Templates ==

**Button HTML Template:**
`define( 'TRC_BUTTON_HTML', '<i class="icon">💬</i>' );`

**Modal HTML Template:**
`define( 'TRC_MODAL_HTML', '
<span class="trc-close">×</span>
<h3>Contact {NICKNAME}</h3>
<p>{MESSAGE}</p>
<a href="tel:{BILLING_PHONE}" class="trc-btn">📞 Call</a>
<a href="{URL}" target="_blank" class="trc-btn">🌐 Website</a>
' );`

**Available Variables:**
* `{NICKNAME}` - Reseller name
* `{BILLING_PHONE}` - Phone number
* `{URL}` - Website URL
* `{MESSAGE}` - Default message
* `{BUTTON_COLOR}` - Button color
* `{MODAL_BACKGROUND_COLOR}` - Modal background

== How to Setup Response Data Structure ==

**Flexible Field Mapping:**
`define( 'TRC_FIELD_MAPPING', array(
    'nickname'      => 'data.reseller.nickname',
    'billing_phone' => 'data.reseller.billing_phone',
    'url'          => 'data.reseller.url',
    'custom_field'  => 'response.custom.path',
) );`

**Supports Any API Structure:**
* Use dot notation for nested data: `user.profile.name`
* Map unlimited fields from any response format
* Automatically handles missing fields with defaults

== How to Update Reseller Information ==

**For WooCommerce Users:**

1. **Go to main site** (which hosts the API)
2. **Login to your WooCommerce account**
3. **Go to Account page**
4. **Update nickname** - This shows as reseller name
5. **Update website** - Enter in website field
6. **Update phone** - Update billing phone number
7. **Save changes**

Changes appear immediately on demo sites using that reseller ID.

== How to Use ==

1. **Static Mode**: Configure defaults in config file
2. **API Mode**: Use URL with `?id=123` parameter  
3. **Auto-caching**: Data cached in cookies for performance
4. **Fallback**: Always falls back to default values

== Advanced Features ==

* **Smart Caching**: Reseller data cached in cookies
* **Template Variables**: Dynamic content replacement
* **Nested Data Access**: Dot notation for complex APIs
* **Responsive Design**: Works on all devices
* **Performance Optimized**: Minimal load impact