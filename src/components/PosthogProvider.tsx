"use client"

import { useEffect } from "react"
import posthog, { type PostHogConfig } from "posthog-js"

type PosthogProviderProps = {
  apiKey: string
  apiHost?: string
  defaults?: string
  personProfiles?: "identified_only" | "always"
}

export default function PosthogProvider({
  apiKey,
  apiHost = "https://us.i.posthog.com",
  defaults,
  personProfiles = "identified_only",
}: PosthogProviderProps) {
  useEffect(() => {
    if (typeof window === "undefined" || !apiKey) return

    const config: Partial<PostHogConfig> & { person_profiles?: "identified_only" | "always" } = {
      api_host: apiHost,
      capture_pageview: true,
      session_recording: {
        // Follow current project preference: do not mask inputs
        maskAllInputs: false,
      },
      person_profiles: personProfiles,
    }

    posthog.init(apiKey, config)

    // Ensure session recording starts even if not auto-enabled
    posthog.startSessionRecording?.()
  }, [apiKey, apiHost, defaults, personProfiles])

  return null
}