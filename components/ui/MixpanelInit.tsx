'use client';

import { useEffect } from 'react';
import { initMixpanel } from '@/lib/mixpanel';

/** Mounted once in the root layout — initializes Mixpanel on first client render. */
export function MixpanelInit() {
  useEffect(() => { initMixpanel(); }, []);
  return null;
}
