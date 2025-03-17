"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

// This file provides utility functions for working with PostHog
// The actual initialization is done in the providers.tsx file

// Check if PostHog is initialized by checking if the API key is loaded
export const isPostHogAvailable = (): boolean => {
	if (typeof window === "undefined") return false;
	return posthog && posthog.isFeatureEnabled !== undefined;
};

// Safely capture an event
export const captureEvent = (eventName: string, properties = {}): void => {
	if (isPostHogAvailable()) {
		posthog.capture(eventName, properties);
	}
};

// Use this to reset identification if needed (e.g., on logout)
export const resetPostHogIdentity = (): void => {
	if (isPostHogAvailable()) {
		posthog.reset();
	}
};

// Use this to identify a user
export const identifyUser = (userId: string, userProperties = {}): void => {
	if (isPostHogAvailable()) {
		posthog.identify(userId, userProperties);
	}
};

// Helper for checking feature flags directly (alternative to the React hook)
export const getFeatureFlagValue = (
	flagName: string,
	defaultValue: string | boolean = "control"
): string | boolean => {
	if (!isPostHogAvailable()) {
		return defaultValue;
	}

	const value = posthog.getFeatureFlag(flagName);
	return value !== undefined ? value : defaultValue;
};

export { posthog, PostHogProvider };
