---
isDraft: false
title: "Free Games Notifier: side project nhỏ, bài tập CI/CD thật"
snippet: Một notifier game miễn phí được thiết kế như một pipeline vận hành thực
  tế với GitHub Actions, GitHub Pages và PR automation.
slug: free-games-notifier-ci-cd-side-project
author: jasper.doan
category: DevOps
readingDuration: 5
pubDate: 2026-06-24
coverAlt: GitHub social preview for the Free Games Notifier repository.
originalLink: https://github.com/ngthuongdoan/free-games-notifier
cover: https://opengraph.githubassets.com/1/ngthuongdoan/free-games-notifier
---

# Free Games Notifier: side project nhỏ, bài tập CI/CD thật

Có những side project bắt đầu từ một nhu cầu rất đời thường: đừng để lỡ game miễn phí.

`free-games-notifier` ban đầu nghe giống một tiện ích nhỏ. Nó fetch game miễn phí từ Epic Games Store, lấy thêm game miễn phí hoặc đang giảm giá từ Steam, render nội dung email bằng EJS, rồi gửi thông báo cho danh sách người đăng ký qua SMTP.

Nhưng phần đáng giá nhất của project này không chỉ nằm ở việc "gửi email". Phần thú vị hơn là cách nó được đóng gói thành một hệ thống tự vận hành bằng GitHub Actions: chạy theo lịch, có môi trường dev/prod, dùng secrets, gửi cảnh báo lỗi, có UI đăng ký qua GitHub Pages, có endpoint trung gian, và có workflow tự mở pull request để cập nhật subscriber registry.

Đó là lý do tôi xem project này như một bài tập CI/CD thực tế hơn là một script cron đơn giản.

## Bài toán

Nếu chỉ viết một file Node.js chạy local, bài toán khá dễ:

1. Gọi API hoặc scrape dữ liệu game.
2. Lọc kết quả theo giá.
3. Render email.
4. Gửi qua SMTP.

Nhưng khi muốn biến nó thành một service nhỏ có thể chạy hàng ngày, bài toán bắt đầu có thêm nhiều ràng buộc:

- Không hard-code email người nhận trong code.
- Không để lộ SMTP credentials.
- Có thể test thủ công mà không spam subscriber thật.
- Có cảnh báo khi job fail.
- Có đường cho người dùng mới đăng ký.
- Có review gate trước khi danh sách subscriber bị thay đổi.
- Có cách redeploy GitHub Pages khi cần mà không sửa file thủ công.

Những điểm này làm project chuyển từ "script tiện ích" sang "workflow automation".

## Kiến trúc tổng thể

Core app là Node.js CommonJS. Entry point `index.js` làm nhiệm vụ điều phối:

- đọc cấu hình và danh sách subscriber;
- lấy game miễn phí từ Epic;
- lấy game miễn phí và game giảm giá từ Steam;
- tính ngưỡng giá cao nhất cần fetch dựa trên cấu hình từng người nhận;
- render email HTML/plain text;
- gửi email với retry;
- nếu job fail thì gửi failure email cho admin list.

Danh sách người nhận nằm trong `src/data/email-lists.json`, thay vì nằm trong GitHub Secrets hay biến môi trường. Điều này giúp project tách rõ hai loại dữ liệu:

- Secrets: SMTP host, port, username, password, sender.
- Operational data: mailing lists, email subscriber, Steam price cap theo từng user.

Đây là một quyết định nhỏ nhưng đúng hướng. Secrets nên là secrets. Còn subscriber registry là dữ liệu vận hành có thể review bằng pull request.

## GitHub Actions là runtime chính

Workflow chính của project là `Free Games Notifier`. Nó chạy mỗi ngày lúc `02:00 UTC` và cũng có thể được trigger thủ công bằng `workflow_dispatch`.

Điểm đáng chú ý là manual run có input `environment` với hai chế độ:

- `prod`: gửi notification cho list production mặc định.
- `dev`: override `EMAIL_LIST_NAME=dev-users` để test mà không ảnh hưởng subscriber thật.

Đây là một pattern CI/CD rất thực dụng. Cùng một pipeline, cùng một code path, nhưng route output sang môi trường khác nhau bằng biến môi trường. Khi cần debug email template, SMTP config, hoặc logic lọc game, mình không phải clone một workflow khác hay comment code tạm thời.

Workflow cũng giới hạn manual dispatch cho repository owner. Với một job có khả năng gửi email ra ngoài, guard này quan trọng. CI/CD không chỉ là "tự động chạy", mà còn là kiểm soát ai được phép kích hoạt automation.

## Secrets và config được phân tầng

Notifier lấy SMTP credentials từ GitHub Secrets:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

Trong khi đó các cấu hình ít nhạy cảm hơn được điều khiển bằng environment variables:

- `EMAIL_LIST_NAME`
- `ADMIN_EMAIL_LIST_NAME`
- `STEAM_MAX_PRICE_VND`
- `STEAM_DISCOUNT_LIMIT`
- `REQUEST_TIMEOUT_MS`
- `RETRY_COUNT`
- `RETRY_DELAY_MS`
- `STARTUP_DELAY_MS`

Cách chia này làm project dễ vận hành hơn. Secret rotation không đụng vào code. Price threshold và retry policy có thể thay đổi theo môi trường. Mailing list có thể đổi khi chạy manual workflow.

Với tôi, đây là dấu hiệu của một người đã làm quen với automation thật: không chỉ viết được action chạy xanh, mà còn nghĩ về cách thay đổi cấu hình sau khi deploy.

## Registration flow: từ GitHub Pages đến pull request

Project có thêm một registration UI trong thư mục `docs/`, sẵn sàng host bằng GitHub Pages. Form này cho phép người dùng nhập:

- email;
- `steamMaxPriceVnd`;
- target list name.

GitHub Pages là static hosting, nên nó không thể ghi trực tiếp vào `src/data/email-lists.json`. Project xử lý bằng một flow nhiều bước:

1. User submit form từ GitHub Pages.
2. Static site gửi JSON đến registration endpoint.
3. Endpoint trigger `repository_dispatch`.
4. GitHub Actions nhận event `register-subscriber`.
5. Script validate payload và cập nhật `src/data/email-lists.json`.
6. Workflow dùng `peter-evans/create-pull-request` để mở PR.

Đây là phần tôi thích nhất trong project. Thay vì để một public form tự động ghi thẳng vào repository, mọi thay đổi subscriber đi qua pull request. Nghĩa là vẫn có audit trail, diff rõ ràng, branch tách riêng, và con người có thể review trước khi merge.

Với một side project, đây có thể là "over-engineering" nếu chỉ nhìn vào tính năng. Nhưng nếu mục tiêu là luyện và thể hiện năng lực CI/CD, thì đây là một lựa chọn rất tốt: nó biến GitHub thành control plane cho cả vận hành lẫn thay đổi dữ liệu.

## PR automation không chỉ để cho đẹp

Workflow `Subscriber Registration PR` làm vài việc quan trọng:

- validate `client_payload` trước khi checkout và chạy script;
- setup Node.js 20;
- chạy `npm ci` để đảm bảo dependency reproducible;
- gọi script `scripts/apply-subscriber-registration.js`;
- tạo pull request chỉ với file `src/data/email-lists.json`.

Script update subscriber cũng có behavior rõ ràng: tạo mới, update price cap, hoặc noop nếu không có thay đổi. Các case này được cover trong test bằng `node:test`.

Điểm này cho thấy CI/CD không đứng một mình. Workflow tốt cần code hỗ trợ tốt: validation, idempotency, testable functions, output dễ đọc. Nếu action chỉ chạy một đoạn shell dài không có test, pipeline có thể xanh nhưng hệ thống vẫn khó tin cậy.

## GitHub Pages redeploy như một thao tác vận hành

Project còn có workflow `Redeploy GitHub Pages`. Workflow này được trigger thủ công, cập nhật `docs/deploy.json`, commit marker mới, rồi push lại default branch để ép GitHub Pages rebuild.

Đây là một chi tiết nhỏ nhưng rất thực tế. Trong vận hành, đôi khi mình cần "kick" lại static deployment mà không muốn sửa nội dung thật. Một deploy marker file là cách đơn giản, dễ hiểu, có lịch sử commit, và không cần công cụ ngoài.

## Test coverage tập trung vào logic rủi ro

Test suite không cố cover mọi thứ. Nó tập trung vào các logic dễ gây bug vận hành:

- normalize recipient entry;
- tính max Steam price cap;
- lọc deal theo ngưỡng của từng user;
- render text email với price cap;
- xử lý quoted CI secret values;
- normalize registration payload;
- upsert subscriber vào mailing list.

Đây là kiểu test phù hợp với side project automation. Những phần phụ thuộc network như Epic/Steam có thể thay đổi, nhưng các rule nội bộ về subscriber, email, config và formatting cần ổn định. Test ở đúng chỗ giúp CI/CD đáng tin hơn.

## Điều project này thể hiện

`free-games-notifier` không phải một sản phẩm lớn. Nhưng nó thể hiện một mindset kỹ thuật khá rõ:

- Biết dùng GitHub Actions không chỉ để build, mà để vận hành scheduled workload.
- Biết phân tách dev/prod trong cùng một workflow.
- Biết dùng secrets đúng chỗ.
- Biết thiết kế registration flow an toàn cho static site.
- Biết dùng `repository_dispatch` để nối external service với GitHub automation.
- Biết tự động tạo PR thay vì mutate data âm thầm.
- Biết viết test cho các rule ảnh hưởng trực tiếp đến vận hành.

Nói ngắn gọn: project nhỏ, nhưng pipeline không hời hợt.

## Nếu tiếp tục phát triển

Những bước tiếp theo tôi muốn làm cho project này sẽ là:

- thêm CI workflow chạy `npm test` trên pull request;
- thêm status badge vào README;
- thêm dry-run mode để preview email output trong Actions;
- lưu snapshot email HTML để review template dễ hơn;
- thêm rate limit hoặc signature validation cho registration endpoint;
- chuẩn hóa observability: structured logs, job summary, hoặc artifact chứa report sau mỗi run.

Nhưng ngay ở trạng thái hiện tại, `free-games-notifier` đã là một side project đủ tốt để kể một câu chuyện kỹ thuật: từ một nhu cầu nhỏ, xây thành một automation pipeline có lịch chạy, môi trường test, secrets, subscriber registry, pull request workflow và fallback vận hành.

Đây là kiểu side project tôi thích đưa vào portfolio. Nó không cố giả làm enterprise system. Nó chỉ giải quyết một việc cụ thể, rồi dùng CI/CD đúng mức để việc đó chạy được ngoài đời thật.
