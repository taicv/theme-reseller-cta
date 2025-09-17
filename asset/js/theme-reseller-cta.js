(function() {
    'use strict';

    // Get configuration from PHP
    const config = window.trcConfig || {};
    const RESELLER_API_URL = config.apiUrl || 'https://thewebgo.com//wp-json/api/v1/reseller/';
    const DEFAULT_WEBSITE = config.defaultWebsite || 'https://thewebgo.com';
    const DEFAULT_PHONE = config.defaultPhone || '0988 888 888';
    const DEFAULT_NAME = config.defaultName || 'thewebgo.com';
    const BUTTON_POSITION = config.buttonPosition || 'bottom-right';
    const BUTTON_COLOR = config.buttonColor || '#ffffff';
    const BUTTON_SPACING = config.buttonSpacing || '10';
    const ENABLE_BUTTON = config.enableButton !== false;
    const MODAL_BACKGROUND_COLOR = config.modalBackgroundColor || '#1e73be';
    const DEFAULT_MESSAGE = config.defaultMessage || 'Bạn đang xem demo từ ';
    const BUTTON_HTML = config.buttonHtml || '[i]';
    const MODAL_HTML = config.modalHtml || '<span class="trc-close">×</span><p>{MESSAGE} {NICKNAME}</p><a class="trc-btn" href="tel:{PHONE}">📞 {PHONE}</a><a class="trc-btn" href="{URL}" target="_blank">🌐 WEBSITE</a>';
    const BUTTON_CSS = config.buttonCss || '';
    const MODAL_CSS = config.modalCss || '';

    // Initialize with default values
    let resellerData = {
        nickname: DEFAULT_NAME,
        billing_phone: DEFAULT_PHONE,
        url: DEFAULT_WEBSITE
    };

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
        return template
            .replace(/\{BUTTON_COLOR\}/g, BUTTON_COLOR)
            .replace(/\{MODAL_BACKGROUND_COLOR\}/g, MODAL_BACKGROUND_COLOR)
            .replace(/\{NICKNAME\}/g, data.nickname || DEFAULT_NAME)
            .replace(/\{PHONE\}/g, data.billing_phone || DEFAULT_PHONE)
            .replace(/\{URL\}/g, data.url || DEFAULT_WEBSITE)
            .replace(/\{MESSAGE\}/g, DEFAULT_MESSAGE)
            .replace(/\{BUTTON_SPACING\}/g, getPositionStyles(BUTTON_POSITION, BUTTON_SPACING));
    }

    // Create styles
    const style = document.createElement('style');
    let cssContent = '';

    // Use custom CSS if provided, otherwise use default styles
    if (BUTTON_CSS) {
        cssContent += replaceTemplateVars(BUTTON_CSS, resellerData);
        // Add position styles to button CSS
        cssContent = cssContent.replace('.trc-float-btn {', `.trc-float-btn { ${getPositionStyles(BUTTON_POSITION, BUTTON_SPACING)}`);
    } else {
        cssContent += `
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

    if (MODAL_CSS) {
        cssContent += replaceTemplateVars(MODAL_CSS, resellerData);
    } else {
        cssContent += `
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

    style.textContent = cssContent;
    document.head.appendChild(style);

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
                    if (data && data.data.status === 200) {
                        resellerData = {
                            nickname: data.data.reseller.nickname || resellerData.nickname,
                            billing_phone: data.data.reseller.billing_phone || resellerData.billing_phone,
                            url: data.data.reseller.url || resellerData.url
                        };
                        // Save to cookies for future visits
                        saveResellerDataToCookie(resellerData);
                        console.log('Fetched and cached new reseller data');
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
        
        else if (cachedData && cachedData.nickname && cachedData.billing_phone && cachedData.url) {
            // Use cached data
            resellerData = {
                nickname: cachedData.nickname,
                billing_phone: cachedData.billing_phone,
                url: cachedData.url
            };
            console.log('Using cached reseller data from cookies');
            return;
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
