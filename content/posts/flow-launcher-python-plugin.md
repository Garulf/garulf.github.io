---
title: Writing your first Flow Launcher plugin in Python
date: "2026-05-18"
tags: [flow-launcher, python]
readTime: "7 min read"
---

Flow Launcher uses a JSON-RPC protocol to communicate with plugins. The `pyFlowLauncher` library wraps this entirely, letting you write a working plugin in around 30 lines. Start with `from pyflowlauncher import Plugin, Result` and define a `query` method that returns a list of Results.

Each Result needs a Title, Subtitle, and optional IcoPath. Set a JsonRPCAction to run a shell command or call back into your Python code. Once you have a `plugin.json` manifest and drop the folder into Flow's plugin directory, it appears immediately — no restart needed.
