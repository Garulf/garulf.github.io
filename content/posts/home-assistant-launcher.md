---
title: Controlling Home Assistant from a keyboard launcher
date: "2026-03-02"
tags: [home-assistant, automation]
readTime: "9 min read"
---

HA-Commander connects to your Home Assistant instance using a long-lived access token and the REST API. It fetches all entities on startup and caches them, then filters by your query string. You can toggle lights, locks, scenes, and scripts without ever reaching for the mouse.

The plugin respects HA domains — searching `kitchen` returns every entity with "kitchen" in its friendly name, grouped by domain. Drop your `HA_URL` and `HA_TOKEN` into the plugin settings and it works instantly on the local network.
