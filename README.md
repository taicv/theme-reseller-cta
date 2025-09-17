# Theme Reseller CTA

🚀 **Advanced floating contact button with complete customization, flexible API mapping, and enterprise-level configuration options.**

## ✨ Rich Features

### 🎨 **Complete UI Customization**
- **Custom HTML Templates** - Design button and modal with your own HTML
- **Custom CSS Styling** - Full control over appearance with dynamic variables  
- **Template Variables** - Dynamic content replacement system
- **Responsive Design** - Adaptive layout for all devices

### 🔄 **Flexible API Integration** 
- **Unlimited Field Mapping** - Map any number of fields from any API structure
- **Dot Notation Support** - Access nested data: `user.profile.contact.phone`
- **Smart Data Caching** - Automatic cookie-based caching for performance
- **Fallback System** - Always works with default values

### ⚙️ **Rich Configuration System**
- **Template Customization** - HTML/CSS templates with variables
- **Field Mapping** - Configure response data structure
- **Default Management** - Set fallback values for any scenario

## How to Install

1. Upload to `wp-content/plugins/theme-reseller-cta/`
2. Activate in WordPress admin
3. Configure in `theme-reseller-cta-config.php`
4. Add API code to theme's `functions.php`

## How to Setup API

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

### 🎯 **Basic Settings**
```php
// Core configuration
define( 'TRC_ENDPOINT_DOMAIN', 'https://your-domain.com' );
define( 'TRC_BUTTON_POSITION', 'bottom-right' ); // bottom-left, top-right, top-left
define( 'TRC_BUTTON_COLOR', '#1e73be' );
define( 'TRC_MODAL_BACKGROUND_COLOR', '#ffffff' );
define( 'TRC_ENABLE_BUTTON', true );
```

### 🎨 **HTML Template Customization**
```php
// Custom button HTML (supports emojis, icons, HTML)
define( 'TRC_BUTTON_HTML', '💬' );

// Custom modal HTML with dynamic variables
define( 'TRC_MODAL_HTML', '
<span class="trc-close">×</span>
<h3>Contact {NICKNAME}</h3>
<p>{MESSAGE}</p>
<a href="tel:{BILLING_PHONE}" class="trc-btn">📞 Call Now</a>
<a href="{URL}" target="_blank" class="trc-btn">🌐 Visit Website</a>
' );
```

### 🎨 **CSS Style Customization**
```php
// Custom button CSS with template variables
define( 'TRC_BUTTON_CSS', '
.trc-float-btn {
    background: {BUTTON_COLOR};
    color: {MODAL_BACKGROUND_COLOR};
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 24px;
}
' );

// Custom modal CSS
define( 'TRC_MODAL_CSS', '
.trc-modal-content {
    background: {MODAL_BACKGROUND_COLOR};
    border: 3px solid {BUTTON_COLOR};
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
' );
```

### 🔄 **Flexible API Response Mapping**
```php
// Map any API structure - NO LIMITS!
define( 'TRC_FIELD_MAPPING', array(
    'nickname'      => 'data.reseller.nickname',        // Standard path
    'billing_phone' => 'data.reseller.billing_phone',   // Nested access
    'url'          => 'data.reseller.url',              // Multiple levels
    'email'        => 'response.contact.email',         // Custom fields
    'company'      => 'user.business.company_name',     // Any structure
) );

// Default values for each field
define( 'TRC_DEFAULT_VALUES', array(
    'nickname'      => 'Default Company',
    'billing_phone' => '0123456789',
    'url'          => 'https://example.com/',
    'email'        => 'contact@example.com',
    'company'      => 'Your Business',
) );
```

## How to Setup Response Data Structure

### 🎯 **Any API Response Format Supported**

**Your API can return ANY structure:**
```json
{
  "success": true,
  "user": {
    "profile": {
      "name": "John Doe",
      "contact": {
        "phone": "123-456-7890",
        "website": "https://johndoe.com"
      }
    }
  }
}
```

**Just map it in config:**
```php
define( 'TRC_FIELD_MAPPING', array(
    'nickname'      => 'user.profile.name',
    'billing_phone' => 'user.profile.contact.phone', 
    'url'          => 'user.profile.contact.website',
) );
```

### 🔧 **Template Variables Available**
- `{NICKNAME}` - Mapped nickname field
- `{BILLING_PHONE}` - Mapped phone field  
- `{URL}` - Mapped URL field
- `{MESSAGE}` - Default message
- `{BUTTON_COLOR}` - Button color
- `{MODAL_BACKGROUND_COLOR}` - Modal background
- **Plus any custom fields you map!**

## How to Update Reseller Information

### 📝 **For WooCommerce Users**

1. **Go to main site** (which hosts the API)
2. **Login to your WooCommerce account**
3. **Go to Account page**
4. **Update nickname** - This shows as reseller name
5. **Update website** - Enter in website field
6. **Update phone** - Update billing phone number  
7. **Save changes**

**✅ Changes appear immediately on all demo sites using that reseller ID.**

## How to Use

### 🎯 **Multiple Operation Modes**

**Static Mode**
```
Configure defaults in config file → Shows static info
```

**API Mode**  
```
Use URL: https://demo-site.com/?id=123 → Fetches dynamic data
```

**Cached Mode**
```
Data automatically cached in cookies → Fast repeat visits
```

**Fallback Mode**
```
API fails → Uses default values seamlessly
```

## 🚀 **Advanced Features**

### ⚡ **Performance Optimizations**
- Smart cookie-based caching
- Minimal DOM manipulation
- Lightweight JavaScript (< 8KB)
- CSS injection with variables

### 🎨 **Design Flexibility**
- Template variable system
- Dynamic CSS with placeholders
- HTML customization
- Responsive design

### 🔄 **Data Management**
- Unlimited field mapping
- Dot notation for nested access
- Automatic fallbacks
- Error handling

### 🛡️ **Enterprise Ready**
- WordPress coding standards
- Security best practices
- Performance optimized
- Extensible architecture

---

**Visit: [https://thewebgo.com/](https://thewebgo.com/)**