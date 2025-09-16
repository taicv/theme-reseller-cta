# Theme Reseller CTA

Floating contact button for theme demo sites with API integration.

## How to Install

1. Upload to `wp-content/plugins/theme-reseller-cta/`
2. Activate in WordPress admin
3. Configure in `theme-reseller-cta-config.php`
4. Add API code to theme's `functions.php` 

## How to Setup API

**Required for dynamic reseller data**

Add this to your theme's `functions.php`:

```php
add_action('rest_api_init', 'theme_reseller_register_reseller_endpoint');

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
}
```

## How to Configure

Edit `theme-reseller-cta-config.php`:

```php
// API Settings
define( 'TRC_ENDPOINT_DOMAIN', 'https://your-domain.com' );

// Default Info
define( 'TRC_DEFAULT_WEBSITE', 'https://yoursite.com/' );
define( 'TRC_DEFAULT_PHONE', '0123456789' );
define( 'TRC_DEFAULT_NAME', 'Your Name' );

// Appearance
define( 'TRC_BUTTON_POSITION', 'bottom-right' ); // bottom-left, top-right, top-left
define( 'TRC_BUTTON_COLOR', '#ffffff' );
define( 'TRC_BUTTON_SPACING', '20' );
define( 'TRC_ENABLE_BUTTON', true );
```

## How to Use

### Static Mode
Just configure defaults in config file. Button shows default info.

### API Mode  
Use URL with ID parameter: `https://demo-site.com/?id=123`

### Button Behavior
- Shows only on homepage
- Click to open contact modal
- Falls back to defaults if API fails

## How to Update Reseller Information

To update reseller data for API mode:

1. **Go to main site** (which hosts the API)
2. **Login to your WooCommerce account**
3. **Go to Account page**
4. **Update nickname** - This shows as reseller name
5. **Update website** - Enter in website field
6. **Update phone** - Update billing phone number
7. **Save changes**

Changes will appear immediately on demo sites using that reseller ID.
