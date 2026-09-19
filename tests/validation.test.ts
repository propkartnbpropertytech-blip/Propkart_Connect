import { describe, it, expect } from 'vitest';

describe('PropKart Connect Dynamic Validation Engine', () => {
  // 1. Phone number validation (Indian 10-digit mobile)
  const isIndianMobile = (phone: string): boolean => {
    const clean = phone.replace(/\D/g, '');
    return /^(91)?[6-9]\d{9}$/.test(clean);
  };

  it('validates 10-digit Indian mobile numbers correctly', () => {
    expect(isIndianMobile('9876543210')).toBe(true);
    expect(isIndianMobile('8123456789')).toBe(true);
    expect(isIndianMobile('7000000000')).toBe(true);
    expect(isIndianMobile('6999999999')).toBe(true);
    expect(isIndianMobile('+91 9876543210')).toBe(true);
    expect(isIndianMobile('919876543210')).toBe(true);

    // Invalid phones
    expect(isIndianMobile('5876543210')).toBe(false); // starts with 5
    expect(isIndianMobile('987654321')).toBe(false);  // 9 digits
    expect(isIndianMobile('987654321000')).toBe(false); // 12 digits without 91
    expect(isIndianMobile('abcdefghij')).toBe(false);
  });

  // 2. Email validation
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  it('validates email addresses correctly', () => {
    expect(isValidEmail('owner@propkart.com')).toBe(true);
    expect(isValidEmail('test.user@example.co.in')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('missing@domain')).toBe(false);
    expect(isValidEmail('@nodomain.com')).toBe(false);
  });

  // 3. Media limits validation
  const validateMediaLimits = (photosCount: number, videosCount: number, maxPhotos = 50, maxVideos = 30) => {
    const errors: Record<string, string> = {};
    if (photosCount > maxPhotos) {
      errors.photos = `Maximum photos allowed is ${maxPhotos}`;
    }
    if (videosCount > maxVideos) {
      errors.videos = `Maximum videos allowed is ${maxVideos}`;
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  it('enforces maximum 50 photos and 30 videos limit', () => {
    // Valid counts
    expect(validateMediaLimits(10, 5).isValid).toBe(true);
    expect(validateMediaLimits(50, 30).isValid).toBe(true);

    // Exceeds limits
    const photoExcess = validateMediaLimits(51, 10);
    expect(photoExcess.isValid).toBe(false);
    expect(photoExcess.errors.photos).toContain('50');

    const videoExcess = validateMediaLimits(20, 31);
    expect(videoExcess.isValid).toBe(false);
    expect(videoExcess.errors.videos).toContain('30');
  });

  // 4. Google Maps location verification
  const isValidGoogleLocation = (url: string | undefined, hasCoords: boolean): boolean => {
    if (hasCoords) return true;
    if (!url) return false;
    return (
      url.includes('google.com/maps') ||
      url.includes('goo.gl') ||
      url.includes('maps.app.goo.gl')
    );
  };

  it('validates Google location links and coordinates', () => {
    expect(isValidGoogleLocation('https://maps.app.goo.gl/abcdef', false)).toBe(true);
    expect(isValidGoogleLocation('https://www.google.com/maps?q=23.0225,72.5714', false)).toBe(true);
    expect(isValidGoogleLocation(undefined, true)).toBe(true); // coordinates detected
    expect(isValidGoogleLocation('https://someotherwebsite.com', false)).toBe(false);
    expect(isValidGoogleLocation('', false)).toBe(false);
  });
});
