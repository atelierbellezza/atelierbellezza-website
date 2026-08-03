const CONSENT_VERSION = '1.0';
const COOKIE_STORAGE_KEY = 'atelierCookieConsent';

const consentDefaults = () => ({
  version: CONSENT_VERSION,
  timestamp: new Date().toISOString(),
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
});

const readStoredConsent = () => {
  try {
    const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    return {
      ...consentDefaults(),
      ...parsed,
      necessary: parsed.necessary !== false,
      preferences: Boolean(parsed.preferences),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch (error) {
    console.warn('Impossibile leggere il consenso cookie.', error);
    return null;
  }
};

const saveConsent = (consent) => {
  const payload = {
    ...consentDefaults(),
    ...consent,
    necessary: true,
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(payload));
  return payload;
};

const shouldShowBanner = () => {
  const saved = readStoredConsent();
  if (!saved) {
    return true;
  }

  return saved.version !== CONSENT_VERSION;
};

const showBanner = () => {
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.classList.add('visible');
    banner.hidden = false;
  }
};

const hideBanner = () => {
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.classList.remove('visible');
    banner.hidden = true;
  }
};

const openModal = () => {
  const modal = document.getElementById('cookie-modal');
  const dialog = document.getElementById('cookie-modal-dialog');
  const opener = document.activeElement;

  if (!modal || !dialog) {
    return;
  }

  modal.classList.add('visible');
  modal.hidden = false;
  dialog.focus();
  document.body.classList.add('cookie-modal-open');
  document.body.dataset.cookieModalOpener = opener ? opener.id || 'body' : 'body';
};

const closeModal = () => {
  const modal = document.getElementById('cookie-modal');
  if (!modal) {
    return;
  }

  modal.classList.remove('visible');
  modal.hidden = true;
  document.body.classList.remove('cookie-modal-open');

  const openerId = document.body.dataset.cookieModalOpener || '';
  const opener = openerId ? document.getElementById(openerId) : null;
  if (opener) {
    opener.focus();
  }
};

const populateForm = (consent) => {
  const form = document.getElementById('cookie-form');
  if (!form) {
    return;
  }

  const checkboxNames = ['preferences', 'analytics', 'marketing'];
  checkboxNames.forEach((name) => {
    const element = form.querySelector(`[name="${name}"]`);
    if (element) {
      element.checked = Boolean(consent[name]);
    }
  });
};

const getCurrentConsentFromForm = () => {
  const form = document.getElementById('cookie-form');
  if (!form) {
    return consentDefaults();
  }

  return {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    necessary: true,
    preferences: form.querySelector('[name="preferences"]').checked,
    analytics: form.querySelector('[name="analytics"]').checked,
    marketing: form.querySelector('[name="marketing"]').checked,
  };
};

const loadPreferenceServices = () => {
  // Inserire qui servizi di preferenza solo dopo consenso preferences
  console.info('Servizi di preferenza attivati dopo consenso.');
};

const loadAnalyticsServices = () => {
  // Inserire qui Google Analytics solo dopo consenso analytics
  console.info('Servizi di analytics attivati dopo consenso.');
};

const loadMarketingServices = () => {
  // Inserire qui contenuti esterni, widget social o servizi promozionali solo dopo consenso marketing
  console.info('Servizi marketing e contenuti esterni attivati dopo consenso.');
};

const applyConsent = (consent) => {
  const saved = saveConsent(consent);
  hideBanner();
  closeModal();

  if (saved.preferences) {
    loadPreferenceServices();
  }

  if (saved.analytics) {
    loadAnalyticsServices();
  }

  if (saved.marketing) {
    loadMarketingServices();
  }
};

const setupConsentUI = () => {
  const banner = document.getElementById('cookie-banner');
  const modal = document.getElementById('cookie-modal');
  const form = document.getElementById('cookie-form');
  const bannerReject = document.getElementById('cookie-reject');
  const bannerAcceptAll = document.getElementById('cookie-accept-all');
  const bannerCustomize = document.getElementById('cookie-customize');
  const bannerClose = document.getElementById('cookie-close');
  const modalClose = document.getElementById('cookie-modal-close');
  const modalReject = document.getElementById('cookie-modal-reject');
  const modalAcceptAll = document.getElementById('cookie-modal-accept-all');
  const reviewLinks = document.querySelectorAll('[data-cookie-review]');

  if (!banner && !modal) {
    return;
  }

  const savedConsent = readStoredConsent();
  if (shouldShowBanner()) {
    showBanner();
  } else if (savedConsent) {
    hideBanner();
    if (savedConsent.preferences) {
      loadPreferenceServices();
    }
    if (savedConsent.analytics) {
      loadAnalyticsServices();
    }
    if (savedConsent.marketing) {
      loadMarketingServices();
    }
  }

  if (form) {
    populateForm(savedConsent || consentDefaults());
  }

  const closeOnEscape = (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) {
      event.preventDefault();
      closeModal();
    }
  };

  document.addEventListener('keydown', closeOnEscape);

  if (bannerReject) {
    bannerReject.addEventListener('click', () => {
      applyConsent({
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString(),
        necessary: true,
        preferences: false,
        analytics: false,
        marketing: false,
      });
    });
  }

  if (bannerAcceptAll) {
    bannerAcceptAll.addEventListener('click', () => {
      applyConsent({
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString(),
        necessary: true,
        preferences: true,
        analytics: true,
        marketing: true,
      });
    });
  }

  if (bannerCustomize) {
    bannerCustomize.addEventListener('click', () => {
      hideBanner();
      openModal();
    });
  }

  if (bannerClose) {
    bannerClose.addEventListener('click', () => {
      applyConsent({
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString(),
        necessary: true,
        preferences: false,
        analytics: false,
        marketing: false,
      });
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalReject) {
    modalReject.addEventListener('click', () => {
      applyConsent({
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString(),
        necessary: true,
        preferences: false,
        analytics: false,
        marketing: false,
      });
    });
  }

  if (modalAcceptAll) {
    modalAcceptAll.addEventListener('click', () => {
      applyConsent({
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString(),
        necessary: true,
        preferences: true,
        analytics: true,
        marketing: true,
      });
    });
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      applyConsent(getCurrentConsentFromForm());
    });
  }

  reviewLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      populateForm(readStoredConsent() || consentDefaults());
      openModal();
    });
  });

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusTrap = (event) => {
    if (!modal || modal.hidden) {
      return;
    }

    const focusableElements = Array.from(modal.querySelectorAll(focusableSelector)).filter((element) => element.offsetParent !== null);
    if (!focusableElements.length) {
      event.preventDefault();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (modal) {
    modal.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        focusTrap(event);
      }
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupConsentUI);
} else {
  setupConsentUI();
}
