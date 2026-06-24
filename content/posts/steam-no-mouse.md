---
title: Launching Steam games without touching the mouse
date: "2026-01-11"
tags: [steam, productivity]
readTime: "5 min read"
---

Steam-Search reads your local library from the `libraryfolders.vdf` manifest, so it works completely offline. It lists every installed game with its AppID and launches it by passing `steam://rungameid/{id}` to the system URI handler.

The plugin caches the library list so repeated queries are instant. Non-installed games can be surfaced via a toggle that queries the Steam Web API — useful for finding something to wishlist without ever opening the store.
