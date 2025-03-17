import { PostHog } from "posthog-node";

export const client = new PostHog(
	process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
	{
		host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
	},
);
