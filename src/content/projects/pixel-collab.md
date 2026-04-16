---
title: "PixelCollab: Real-Time Collaborative Whiteboard"
description: PixelCollab is a multiplayer whiteboard built for fast visual
  collaboration. Users can create a room, share a link instantly, and draw
  together on a live synced canvas with presence indicators, chat, color tools,
  and a clean focus-first workspace.
category: main
status: live
role: Frontend product design, realtime collaboration UX, and interaction polish
period: "2026"
thumbnail: /uploads/thumbnails/chatgpt-image-apr-12-2026-01_26_33-pm.png
image: /uploads/chatgpt-image-apr-9-2026-10_23_28-pm.png
links:
  - label: Live demo
    url: https://whiteboard-dun-ten.vercel.app/
stack:
  - React
  - TypeScript
  - Canvas UI
  - Realtime sync
  - Presence indicators
metrics:
  - Share-a-link room creation keeps collaboration friction low from the first action
  - The canvas, chat, and presence states are designed to stay readable in one workspace
  - Minimal UI treatment keeps the product focused on flow instead of dashboard clutter
highlights:
  - Built around immediate collaboration instead of heavy onboarding
  - Combined visual drawing, participant awareness, and lightweight communication in a single surface
  - Treated motion and layout restraint as part of the product experience, not decoration
order: 0
---
## Problem

Most collaborative whiteboards feel noisy long before they feel useful. I wanted to explore a simpler starting point: create a room, invite someone instantly, and start drawing without navigating a dense control surface.

## Approach

PixelCollab is designed around immediacy. The product flow aims to keep the first meaningful action only a few seconds away:

- create a room
- share the link
- start drawing together with visible presence

The interface stays intentionally restrained so the canvas remains the primary workspace.

## What this project shows

This project is less about enterprise feature depth and more about interaction quality. It shows how I approach realtime collaboration problems through product structure, clarity, and low-friction UX.

## Next direction

The next step for this line of work is to deepen the engineering story around it: stronger state persistence, clearer concurrency boundaries, and a richer case study around realtime system trade-offs.
