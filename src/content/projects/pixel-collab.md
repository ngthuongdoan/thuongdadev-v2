---
title: "PixelCollab: Realtime Whiteboard Có Vẽ Cùng Nhau Mà Không Đánh Nhau"
description: "PixelCollab là realtime collaborative whiteboard để vẽ ý tưởng cùng nhau trên canvas đồng bộ trực tiếp. Project kết hợp Next.js, React, TypeScript, WebSocket, Yjs/CRDT, presence, chat và UX tối giản để biến một cái link thành phòng họp sáng tạo không cần nghi lễ."
category: main
status: live
role: "Full-stack realtime product engineer: UI/UX, collaborative canvas, WebSocket transport, CRDT sync, presence, and interaction polish"
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
  - Room sharing bằng link giúp người dùng vào vẽ ngay, không cần một nghi thức đăng nhập dài như họp bàn quy trình
  - WebSocket transport và Yjs/CRDT sync giữ nét vẽ, presence, chat và trạng thái canvas đi cùng một nhịp realtime
  - UI được tiết chế để canvas vẫn là sân khấu chính, còn toolbar không có nhu cầu trở thành bảng điều khiển tàu vũ trụ
highlights:
  - Tách frontend whiteboard và backend transport để thể hiện rõ tư duy kiến trúc, không trộn hết mọi thứ vào một nơi rồi cầu may
  - Backend Node.js/Express dùng ws, Yjs và y-protocols cho CRDT sync, awareness broadcast, room TTL và giới hạn payload
  - Frontend Next.js/React tập trung vào canvas interaction, color tools, presence indicators, chat và luồng mọi người cùng vẽ thật mượt
order: 0
---
## Bài toán

Whiteboard online nghe thì đơn giản: một người vẽ, người kia thấy. Làm thật mới biết mỗi nét vẽ đều có đời sống nội tâm: đồng bộ ra sao, mất kết nối thì sao, ai đang ở trong phòng, có nên lưu tất cả hay chỉ truyền trạng thái, và làm sao để UI không biến thành bảng điều khiển máy giặt.

PixelCollab được xây như một realtime collaborative whiteboard có mục tiêu rất rõ: mở phòng, share link, vẽ chung. Không bắt người dùng đi qua 7 cửa onboarding chỉ để vẽ một cái hình tròn méo méo.

## Cách tôi thiết kế

Tôi tách project thành hai lớp:

- Frontend Next.js/React xử lý canvas UI, tool vẽ, màu sắc, chat, presence và trải nghiệm phòng vẽ.
- Backend Node.js/TypeScript/Express giữ vai trò realtime transport: tạo room, kiểm tra room, WebSocket endpoint, Yjs/CRDT sync và awareness.

Lý do tách ra không phải để repo trông có vẻ oai. Nó cho thấy cách tôi đặt ranh giới hệ thống: client tập trung vào interaction, server tập trung vào đồng bộ và kiểm soát phòng. Khi sản phẩm lớn lên, mình còn biết chỗ nào để thêm persistence, auth, rate limit, observability, thay vì mở file lên và nghe tiếng khó khăn của quá khứ.

## Phần kỹ thuật đáng tiền khoe

PixelCollab dùng WebSocket cho kênh realtime và Yjs/CRDT để nhiều client có thể đồng bộ trạng thái whiteboard mà không cần server hiểu từng ý nghĩa của mỗi nét vẽ. Backend chỉ làm transport layer, không diễn giải canvas semantics. Cách này giữ hệ thống gọn, dễ test, dễ thay đổi frontend, và giảm nguy cơ server trở thành "ông chủ phòng vẽ" biết quá nhiều chuyện.

Backend cũng có những chi tiết nhỏ nhưng đáng giá:

- `GET /healthz` để biết server còn thở.
- `POST /rooms` và `GET /rooms/:roomId` cho flow tạo/tham gia phòng.
- `WS /ws?roomId=<id>` cho sync realtime.
- Room TTL, sweep interval, max room count và max payload để project không "vui quá hóa vỡ trận".
- Optional auth token để có đường nâng cấp bảo vệ API/WebSocket.

Ở frontend, điểm tối ưu không nằm ở việc nhét thật nhiều nút lên màn hình. Điểm khó là giữ canvas, chat, presence và controls cùng tồn tại mà không chen ép nhau. Người dùng vào để vẽ, không vào để giải mã một bài thi UI.

## SEO mà vẫn là người thật

Nếu cần gọi đúng tên cho Google và cho nhà tuyển dụng: đây là một realtime whiteboard app, collaborative canvas, WebSocket whiteboard, CRDT collaboration demo, Next.js whiteboard project và full-stack realtime collaboration system.

Nếu gọi theo cách bình dân hơn: đây là project chứng minh tôi không chỉ biết kéo thả component cho đẹp. Tôi có thể thiết kế luồng sản phẩm, chia kiến trúc frontend/backend, xử lý đồng bộ realtime, giữ UX gọn gàng, và vẫn để lại đủ không gian để nâng cấp thành một case study nghiêm túc.

## Điều project này thể hiện về tôi

PixelCollab cho thấy cách tôi làm product engineering:

- Bắt đầu từ hành vi người dùng thật: tạo phòng, gửi link, vẽ cùng nhau.
- Chọn kiến trúc theo đúng bài toán: WebSocket cho realtime, CRDT cho sync, transport-only backend cho sự linh hoạt.
- Thiết kế UI theo mục tiêu sử dụng, không trang trí cho vui tay.
- Nhìn trước các điểm mở rộng như persistence, auth, payload limit, room lifecycle và deployment.

Nói ngắn gọn: đây là một cái bảng trắng, nhưng bên dưới không trắng. Bên dưới có realtime system, collaborative UX, và khả năng biến một ý tưởng nhỏ thành sản phẩm có cấu trúc đàng hoàng.
