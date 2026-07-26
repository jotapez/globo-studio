import mixpanel from 'mixpanel-browser';

/**
 * Mixpanel project token — not a secret, same as the Contentsquare/Vercel
 * Analytics IDs already hardcoded elsewhere in this codebase.
 */
const MIXPANEL_TOKEN = '76720e863d1907710bd91224cddb06f6';

/**
 * Call once on app mount (client-only). Config matches the project's
 * dashboard install snippet: autocapture (clicks/pageviews/forms), 100%
 * session recording, and EU data residency (api-eu.mixpanel.com).
 */
export function initMixpanel() {
  mixpanel.init(MIXPANEL_TOKEN, {
    autocapture: true,
    record_sessions_percent: 100,
    api_host: 'https://api-eu.mixpanel.com',
    persistence: 'localStorage',
  });
}

type ContactChannel = 'email' | 'phone' | 'linkedin' | 'onlyme';

/** The site's "conversion" event — a visitor reaching out. */
export function trackContactClick(channel: ContactChannel) {
  mixpanel.track('contact_link_clicked', { channel });
}

/** The Value Moment — a visitor opening a case study or personal project. */
export function trackProjectOpened(project: string, destination: 'internal' | 'external') {
  mixpanel.track('project_opened', { project, destination });
}
