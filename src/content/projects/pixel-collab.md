---
title: "PixelCollab: Realtime Whiteboard"
description: PixelCollab is a realtime collaborative whiteboard where users can
  create a room, share a link, and draw together instantly
category: main
status: live
role: "Full-stack realtime product engineer: UI/UX, collaborative canvas,
  WebSocket transport, CRDT sync, presence, and interaction polish"
period: "2026"
thumbnail: /uploads/thumbnails/chatgpt-image-apr-12-2026-01_26_33-pm.webp
image: /uploads/chatgpt-image-apr-9-2026-10_23_28-pm.png
links:
  - label: Live demo
    url: https://whiteboard-dun-ten.vercel.app/
  - label: Frontend source
    url: https://github.com/ngthuongdoan/whiteboard
  - label: Backend source
    url: https://github.com/ngthuongdoan/whiteboard-be
stack:
  - Next.js
  - React
  - TypeScript
  - Canvas
  - WebSocket
  - Yjs / CRDT
  - Express
  - Zustand
  - Presence
  - Chat
metrics:
  - Room sharing bằng link giúp người dùng vào vẽ ngay, không cần một nghi thức
    đăng nhập dài như họp bàn quy trình
  - WebSocket transport và Yjs/CRDT sync giữ nét vẽ, presence, chat và trạng
    thái canvas đi cùng một nhịp realtime
  - UI được tiết chế để canvas vẫn là sân khấu chính, còn toolbar không có nhu
    cầu trở thành bảng điều khiển tàu vũ trụ
highlights:
  - Tách frontend whiteboard và backend transport để thể hiện rõ tư duy kiến
    trúc, không trộn hết mọi thứ vào một nơi rồi cầu may
  - Backend Node.js/Express dùng ws, Yjs và y-protocols cho CRDT sync, awareness
    broadcast, room TTL và giới hạn payload
  - Frontend Next.js/React tập trung vào canvas interaction, color tools,
    presence indicators, chat và luồng mọi người cùng vẽ thật mượt
order: 0
---
The project focuses on the core experience of multiplayer canvas interaction: synchronized drawing, room-based collaboration, user presence, chat, and a minimal interface that keeps the canvas as the main workspace. Instead of adding heavy onboarding or unnecessary product layers, PixelCollab keeps the flow direct and lightweight.

## Overview

PixelCollab is built around a simple collaboration flow:

1. Create a room
2. Share the room link
3. Join from another browser or device
4. Draw together in realtime

Behind that simple flow, the project handles several product and engineering concerns: realtime communication, collaborative state synchronization, drawing interaction, user awareness, room lifecycle, and basic backend protection.

The goal was not to build a design tool with every possible feature. The goal was to build a focused realtime collaboration experience and structure it in a way that can evolve beyond a demo.

## Core Features

* Realtime collaborative drawing
* Room-based whiteboard sessions
* Shareable room links
* Canvas drawing tools
* User presence and awareness
* Realtime chat inside a room
* Basic room lifecycle control
* Backend payload and connection protection
* Lightweight UI focused on the whiteboard experience

## Technical Approach

The application is split into two clear parts: a frontend whiteboard experience and a backend realtime transport layer.

The frontend owns the user interaction model: drawing tools, canvas behavior, room UI, chat, presence indicators, and local interaction state. It is built with Next.js, React, TypeScript, Canvas, and Zustand.

The backend focuses on synchronization and room control. It is built with Node.js, TypeScript, Express, WebSocket, and Yjs/CRDT. It manages room creation, realtime updates, awareness events, lifecycle limits, and basic safety constraints.

This separation keeps the system easier to reason about. The client can focus on the drawing experience, while the server handles the shared collaboration layer without becoming tightly coupled to every UI detail.

## Architecture

PixelCollab uses a room-based realtime model.

Each room acts as an isolated collaboration space. Users connected to the same room can draw, chat, and see presence updates from each other. WebSocket is used for low-latency communication, while Yjs/CRDT helps keep collaborative state consistent across clients.

At a high level:

* The client creates or joins a room.
* The WebSocket connection is established for that room.
* Drawing and awareness updates are synced between connected users.
* Room-level limits and lifecycle rules are handled on the backend.
* The frontend renders the latest shared state on the canvas.

This model keeps collaboration fast while leaving room for future improvements such as persistence, authentication, rate limiting, observability, and more advanced permission control.

## What This Project Demonstrates

PixelCollab demonstrates my approach to building interactive full-stack products: start from a simple user flow, define clear system boundaries, and choose the right technical model for the collaboration problem.

The project combines frontend interaction design with realtime backend architecture. It uses WebSocket for low-latency communication and Yjs/CRDT for collaborative state synchronization, while keeping the backend focused on transport, room lifecycle, and safety limits instead of tightly coupling it to canvas-specific UI logic.

The result is a focused realtime product that is easy to understand, practical to use, and structured enough to evolve beyond a demo.

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Canvas
* Zustand

### Backend

* Node.js
* TypeScript
* Express
* WebSocket
* Yjs / CRDT

## Possible Improvements

PixelCollab is intentionally scoped, but the architecture leaves a clear path for future improvements:

* Persistent whiteboard sessions
* Authentication and private rooms
* Role-based permissions
* Exporting canvas content
* More drawing tools
* Better undo/redo support
* Room history
* Rate limiting and abuse protection
* Observability and production monitoring
* Deployment hardening

## Final Note

PixelCollab is a small product surface, but it touches several real engineering concerns: realtime communication, collaborative state synchronization, frontend interaction design, system boundaries, and production-minded backend constraints.

It is a practical project for exploring how collaborative software works beyond static CRUD flows.
