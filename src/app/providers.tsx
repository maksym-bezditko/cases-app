"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { usePostHog } from "posthog-js/react";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	const [isPostHogInitialized, setIsPostHogInitialized] = useState(false);

	useEffect(() => {
		const posthogApiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

		if (posthogApiKey) {
			try {
				posthog.init(posthogApiKey, {
					api_host: posthogHost,
					person_profiles: "identified_only",
					capture_pageview: false,
					loaded: () => {
						setIsPostHogInitialized(true);
						if (process.env.NODE_ENV === "development") {
							console.info("PostHog initialized successfully");
						}
					},
					bootstrap: {
						featureFlags: {
							"new-feature-flag": "control",
						},
					},
				});
			} catch (error) {
				console.warn("PostHog initialization failed:", error);
				setIsPostHogInitialized(false);
			}
		} else if (process.env.NODE_ENV === "development") {
			console.info("PostHog API key not found. PostHog features are disabled.");
		}
	}, []);

	// If PostHog is not initialized, just render children without the provider
	if (!isPostHogInitialized) {
		return <>{children}</>;
	}

	return (
		<PHProvider client={posthog}>
			<SuspendedPostHogPageView />
			{children}
		</PHProvider>
	);
}

function PostHogPageView() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const posthog = usePostHog();

	// Track pageviews
	useEffect(() => {
		if (pathname && posthog) {
			let url = window.origin + pathname;
			if (searchParams.toString()) {
				url = url + "?" + searchParams.toString();
			}

			posthog.capture("$pageview", { $current_url: url });
		}
	}, [pathname, searchParams, posthog]);

	return null;
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
	return (
		<Suspense fallback={null}>
			<PostHogPageView />
		</Suspense>
	);
}
