// add delayed functionality here
import { loadScript } from './aem.js';

function isMartechEnabled() {
  const params = new URLSearchParams(window.location.search);
  return params.get('martech') !== 'off';
}

// CookieInformation consent management platform (same CMP as www.vyepti.com)
async function loadConsentManager() {
  if (!isMartechEnabled()) return;

  window.cookieInformationCustomConfig = {
    acceptFrequency: 365,
    declineFrequency: 365,
  };

  await loadScript('https://policy.app.cookieinformation.com/uc.js', {
    id: 'CookieConsent',
    'data-culture': 'EN',
    type: 'text/javascript',
  });
}

async function loadAdobeLaunch() {
  if (!isMartechEnabled()) return;

  await loadScript('https://assets.adobedtm.com/launch-EN52d364e2cb91451b916069ca6746a914.min.js', {
    async: '',
  });
}

async function loadMouseflow() {
  if (!isMartechEnabled()) return;

  await loadScript('https://cdn.mouseflow.com/projects/841678da-3c2f-48b2-ab9a-b907cfea11bf.js');
}

async function loadDelayedScripts() {
  await loadConsentManager();
  await loadAdobeLaunch();
  await loadMouseflow();
}

loadDelayedScripts();
