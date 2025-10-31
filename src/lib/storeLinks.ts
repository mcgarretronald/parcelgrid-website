export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.escrow.escrowApp';
export const APP_STORE_URL = 'https://apps.apple.com/ke/app/parcelgrid-deliver-beyond-nrbi/id6749815954';

export function openStoreForPlatform() {
  try {
    const ua = typeof navigator !== 'undefined' && navigator.userAgent ? navigator.userAgent : '';
    const uaData: any = typeof navigator !== 'undefined' ? (navigator as any).userAgentData : undefined;

    // Detect Android
    const isAndroid = /Android/i.test(ua) || (uaData && uaData.platform && /Android/i.test(uaData.platform));

    // Detect iOS (iPhone/iPad/iPod). Treat iPadOS (MacIntel + touch) as iOS
    const isIOSUserAgent = /iPhone|iPad|iPod/i.test(ua);
    const isIPadOS = typeof navigator !== 'undefined' && (navigator as any).platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1;
    const isIOS = isIOSUserAgent || (uaData && uaData.platform && /iPhone|iPad|iPod|iOS/i.test(uaData.platform)) || isIPadOS;

    if (isAndroid) {
      window.open(PLAY_STORE_URL, '_blank');
      return;
    }

    if (isIOS) {
      window.open(APP_STORE_URL, '_blank');
      return;
    }

    // Fallback: open the Play Store
    window.open(PLAY_STORE_URL, '_blank');
  } catch (e) {
    // Last resort
    window.open(PLAY_STORE_URL, '_blank');
  }
}
