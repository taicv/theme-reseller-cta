(function() {
    'use strict';

    // Get configuration from PHP
    const config = window.trcConfig || {};
    
    // Core configuration
    const RESELLER_API_URL = config.apiUrl || 'https://thewebgo.com//wp-json/api/v1/reseller/';
    const ENABLE_BUTTON = config.enableButton !== false;
    
    // UI configuration
    const BUTTON_POSITION = config.buttonPosition || 'bottom-right';
    const BUTTON_COLOR = config.buttonColor || '#ffffff';
    const BUTTON_SPACING = config.buttonSpacing || '10';
    const MODAL_BACKGROUND_COLOR = config.modalBackgroundColor || '#1e73be';
    const DEFAULT_MESSAGE = config.defaultMessage || 'Bạn đang xem demo từ ';
    
    // Template configuration
    const BUTTON_HTML = config.buttonHtml || '[i]';
    const MODAL_HTML = config.modalHtml || '<span class="trc-close">×</span><p>{MESSAGE} {NICKNAME}</p><a class="trc-btn" href="tel:{BILLING_PHONE}">📞 {BILLING_PHONE}</a><a class="trc-btn" href="{URL}" target="_blank">🌐 WEBSITE</a>';
    const BUTTON_CSS = config.buttonCss || '';
    const MODAL_CSS = config.modalCss || '';
    
    // Data mapping configuration
    const FIELD_MAPPING = config.fieldMapping || {
        'nickname': 'data.reseller.nickname',
        'billing_phone': 'data.reseller.billing_phone',
        'url': 'data.reseller.url'
    };
    const DEFAULT_VALUES = config.defaultValues || {
        'nickname': 'thewebgo.com',
        'billing_phone': '0988 888 888',
        'url': 'https://thewebgo.com/'
    };

    // Function to get nested property from object using dot notation
    function getNestedProperty(obj, path) {
        return path.split('.').reduce((current, prop) => {
            return current && current[prop] !== undefined ? current[prop] : null;
        }, obj);
    }

    // Function to map API response to reseller data using field mapping
    function mapApiResponse(apiData) {
        const mappedData = {};
        
        for (const [localField, apiPath] of Object.entries(FIELD_MAPPING)) {
            const value = getNestedProperty(apiData, apiPath);
            mappedData[localField] = value || DEFAULT_VALUES[localField] || '';
        }
        
        return mappedData;
    }

    // Initialize with default values
    let resellerData = { ...DEFAULT_VALUES };

    // Exit early if button is disabled
    if (!ENABLE_BUTTON) {
        return;
    }

    // Get button position styles
    function getPositionStyles(position, spacing) {
        const spacingPx = spacing + 'px';
        switch(position) {
            case 'bottom-left':
                return `bottom: ${spacingPx}; left: ${spacingPx};`;
            case 'top-right':
                return `top: ${spacingPx}; right: ${spacingPx};`;
            case 'top-left':
                return `top: ${spacingPx}; left: ${spacingPx};`;
            default:
                return `bottom: ${spacingPx}; right: ${spacingPx};`;
        }
    }

    // Template replacement function
    function replaceTemplateVars(template, data) {
        let result = template
            .replace(/\{BUTTON_COLOR\}/g, BUTTON_COLOR)
            .replace(/\{MODAL_BACKGROUND_COLOR\}/g, MODAL_BACKGROUND_COLOR)
            .replace(/\{MESSAGE\}/g, DEFAULT_MESSAGE)
            .replace(/\{BUTTON_SPACING\}/g, getPositionStyles(BUTTON_POSITION, BUTTON_SPACING));
        
        // Replace all mapped fields dynamically
        for (const [fieldName, value] of Object.entries(data)) {
            const placeholder = `{${fieldName.toUpperCase()}}`;
            const regex = new RegExp(placeholder, 'g');
            result = result.replace(regex, value || '');
        }
        
        return result;
    }

    // Generate and inject CSS styles
    function createStyles() {
        const style = document.createElement('style');
        let cssContent = '';

        // Generate button CSS
        if (BUTTON_CSS) {
            cssContent += replaceTemplateVars(BUTTON_CSS, resellerData);
            // Add position styles to button CSS
            cssContent = cssContent.replace('.trc-float-btn {', `.trc-float-btn { ${getPositionStyles(BUTTON_POSITION, BUTTON_SPACING)}`);
        } else {
            cssContent += getDefaultButtonCSS();
        }

        // Generate modal CSS
        if (MODAL_CSS) {
            cssContent += replaceTemplateVars(MODAL_CSS, resellerData);
        } else {
            cssContent += getDefaultModalCSS();
        }

        style.textContent = cssContent;
        document.head.appendChild(style);
    }

    // Default button CSS
    function getDefaultButtonCSS() {
        return `
        .trc-float-btn {
            position: fixed;
            ${getPositionStyles(BUTTON_POSITION, BUTTON_SPACING)}
            background: ${BUTTON_COLOR};
            width: 20px;
            height: 20px;
            border-radius: 0;
            border: none;
            color: ${MODAL_BACKGROUND_COLOR};
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
        }`;
    }

    // Default modal CSS
    function getDefaultModalCSS() {
        return `
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
            color: ${BUTTON_COLOR};
            background: ${MODAL_BACKGROUND_COLOR};
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
            background: ${BUTTON_COLOR};
            color: ${MODAL_BACKGROUND_COLOR};
            text-decoration: none;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }
        .trc-btn:hover {
            opacity: 0.8;
            color: ${BUTTON_COLOR};
        }
        .trc-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
        }`;
    }

    // Cookie helper functions
    function setCookie(name, value, days = 7) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    function saveResellerDataToCookie(data) {
        setCookie('trc_reseller_data', JSON.stringify(data));
    }

    function getResellerDataFromCookie() {
        const cookieData = getCookie('trc_reseller_data');
        if (cookieData) {
            try {
                return JSON.parse(cookieData);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // Fetch reseller data
    function fetchResellerData() {
        // Create styles first
        createStyles();
        
        // Create button immediately with default data
        createFloatButton();
        
        // Get URL parameters        
        const urlParams = new URLSearchParams(window.location.search);
        const resellerId = urlParams.get('id') || '';
        const cachedData = getResellerDataFromCookie();
        if (resellerId) {
            fetch(RESELLER_API_URL + resellerId)
                .then(response => response.json())
                .then(data => {
                // Update resellerData with API response
                if (data && data.data && data.data.status === 200) {
                    resellerData = mapApiResponse(data);
                    // Save to cookies for future visits
                    saveResellerDataToCookie(resellerData);
                    console.log('Fetched and cached new reseller data:', resellerData);
                } else {
                        // Show modal after 3 seconds
                        setTimeout(() => showModal(), 3000);
                    }
                })
                .catch(() => {
                    // If API fails, keep using default data
                    console.log('API call failed, using default reseller data');
                });
        }
        
        // Check if we have cached reseller data in cookies
        
        else if (cachedData && Object.keys(cachedData).length > 0) {
            // Validate cached data has required fields
            const hasRequiredFields = Object.keys(FIELD_MAPPING).some(field => 
                cachedData[field] && cachedData[field] !== ''
            );
            
            if (hasRequiredFields) {
                // Use cached data, filling in missing fields with defaults
                resellerData = { ...DEFAULT_VALUES, ...cachedData };
                console.log('Using cached reseller data from cookies:', resellerData);
                return;
            }
        }
        else {
            // Show modal after 3 seconds
            setTimeout(() => showModal(), 3000);
        }
    }

    // Create floating button
    function createFloatButton() {
        const btn = document.createElement('div');
        btn.className = 'trc-float-btn';
        btn.innerHTML = replaceTemplateVars(BUTTON_HTML, resellerData);
        btn.title = 'Contact Reseller';
        btn.onclick = showModal;
        btn.style.cursor = 'pointer';
        document.body.appendChild(btn);
    }

    // Show modal
    function showModal() {
        const modal = document.createElement('div');
        modal.className = 'trc-modal';
        
        const content = document.createElement('div');
        content.className = 'trc-modal-content';
        
        // Use configurable HTML template
        content.innerHTML = replaceTemplateVars(MODAL_HTML, resellerData);
        
        modal.appendChild(content);
        document.body.appendChild(modal);

        // Add close functionality
        const closeBtn = content.querySelector('.trc-close');
        if (closeBtn) {
            closeBtn.onclick = () => modal.remove();
        }

        // Close on outside click
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchResellerData);
    } else {
        fetchResellerData();
    }
})();
