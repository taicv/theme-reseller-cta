# Theme Reseller CTA

A lightweight WordPress plugin that adds a floating contact button for theme resellers to display their contact information on demo sites.

## Features

- 🎯 **Floating Contact Button** - Customizable floating button that appears on the homepage
- 🎨 **Customizable Design** - Configure colors, position, and spacing to match your brand
- 🔄 **API Integration** - Dynamic reseller data fetching with fallback to defaults
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Lightweight** - Minimal performance impact with clean, efficient code
- 🛡️ **WordPress Standards** - Follows WordPress coding standards and best practices

## Installation

1. **Upload the plugin**
   ```
   wp-content/plugins/theme-reseller-cta/
   ```

2. **Activate the plugin**
   - Go to WordPress Admin → Plugins
   - Find "Theme Reseller CTA" and click "Activate"

3. **Configure settings**
   - Edit `theme-reseller-cta-config.php` to customize your settings

4. **⚠️ IMPORTANT: REST API Setup (Required for Remote API)**
   - If using remote REST API, add the API code to your theme's `functions.php`
   - See the "REST API Setup" section below for the required code

## Configuration

All configuration is done through the `theme-reseller-cta-config.php` file:

### API Settings
```php
// API endpoint for dynamic reseller data
define( 'TRC_ENDPOINT_DOMAIN', 'https://your-api-domain.com' );
```

### Default Reseller Information
```php
define( 'TRC_DEFAULT_WEBSITE', 'https://yourwebsite.com/' );
define( 'TRC_DEFAULT_PHONE', '0123 456 789' );
define( 'TRC_DEFAULT_NAME', 'Your Company Name' );
define( 'TRC_DEFAULT_MESSAGE', 'You are viewing a demo from your company' );
```

### Visual Customization
```php
// Button position: bottom-right, bottom-left, top-right, top-left
define( 'TRC_BUTTON_POSITION', 'bottom-right' );

// Colors (hex codes)
define( 'TRC_BUTTON_COLOR', '#ffffff' );
define( 'TRC_MODAL_BACKGROUND_COLOR', '#1e73be' );

// Spacing from screen edge (pixels)
define( 'TRC_BUTTON_SPACING', '20' );

// Enable/disable the button
define( 'TRC_ENABLE_BUTTON', true );
```

## REST API Setup

**⚠️ REQUIRED for Remote API Usage**

If you want to use a remote REST API to fetch reseller data dynamically, you **MUST** add the following code to your theme's `functions.php` file:

```php
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
```

This code creates a REST API endpoint at `/wp-json/api/v1/reseller/{id}` that:
- ✅ Validates numeric user ID input
- ✅ Sanitizes all output data
- ✅ Returns proper error responses
- ✅ Uses WordPress native functions
- ✅ Follows WordPress security standards

## How It Works

1. **URL Parameter Detection** - The plugin checks for an `id` parameter in the URL
2. **API Call** - Makes a request to fetch reseller data: `{API_URL}/wp-json/api/v1/reseller/{id}`
3. **Fallback** - If API fails or no ID provided, uses default configuration values
4. **Display** - Shows floating button only on the homepage/front page

### API Response Format
The plugin expects this JSON response format:
```json
{
  "data": {
    "status": 200,
    "reseller": {
      "nickname": "Reseller Name",
      "billing_phone": "0123456789",
      "url": "https://reseller-website.com"
    }
  }
}
```

## Usage Examples

### Demo URL with Reseller ID
```
https://yourdemo.com/?id=reseller123
```

### Manual Configuration
Simply edit the constants in `theme-reseller-cta-config.php` for static setups.

## File Structure

```
theme-reseller-cta/
├── theme-reseller-cta.php          # Main plugin file
├── theme-reseller-cta-config.php   # Configuration file
├── asset/
│   └── js/
│       └── theme-reseller-cta.js   # Frontend JavaScript
├── readme.txt                      # WordPress.org readme
└── README.md                       # This file
```

## Requirements

- **WordPress**: 5.0 or higher
- **PHP**: 7.2 or higher
- **License**: GPL-2.0-or-later

## Development

### WordPress Coding Standards
This plugin follows WordPress coding standards:
- Proper sanitization and escaping
- WordPress native functions usage
- No external dependencies
- Clean and documented code

### Security Features
- ✅ Input sanitization with `sanitize_text_field()`
- ✅ Output escaping with `esc_html()`, `esc_url()`
- ✅ WordPress nonce verification for forms
- ✅ Capability checks with `current_user_can()`
- ✅ No direct file access protection

### Performance
- Lightweight JavaScript (< 5KB)
- Only loads on homepage
- Efficient CSS injection
- Minimal DOM manipulation

## Troubleshooting

### Button not appearing?
1. Check if `TRC_ENABLE_BUTTON` is set to `true`
2. Verify you're on the homepage/front page
3. Check browser console for JavaScript errors

### API not working?
1. Verify `TRC_ENDPOINT_DOMAIN` is correct
2. **Check if REST API code is added to theme's `functions.php`**
3. Check if the API endpoint is accessible: `/wp-json/api/v1/reseller/{id}`
4. Ensure proper JSON response format
5. Verify user exists with the provided ID
6. Check user has `billing_phone` meta field set

### Styling issues?
1. Check CSS conflicts with your theme
2. Adjust `TRC_BUTTON_SPACING` if button is cut off
3. Modify colors in the configuration file

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Follow WordPress coding standards
4. Test thoroughly
5. Submit a pull request

## License

This plugin is licensed under the GPL-2.0-or-later license. See [LICENSE](https://www.gnu.org/licenses/gpl-2.0.html) for details.

## Support

For support, feature requests, or bug reports:
- Visit: [https://thewebgo.com/](https://thewebgo.com/)
- Email: support@thewebgo.com

## Changelog

### 1.0.0 (Current)
- ✨ Initial release
- ✨ Floating contact button functionality
- ✨ API integration for dynamic reseller data
- ✨ Customizable button position and colors
- ✨ WordPress coding standards compliance
- ✨ Responsive design implementation

---

**Made with ❤️ for the WordPress community**
