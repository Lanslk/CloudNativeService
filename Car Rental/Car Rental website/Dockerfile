FROM ubuntu:latest
LABEL authors="yutenglan"

ENTRYPOINT ["top", "-b"]

FROM php:8.2-apache
# 將 PHP 與前端靜態檔案複製到 Apache 網頁根目錄
# 啟用 Apache 代理與重寫模組
RUN a2enmod proxy proxy_http rewrite

# 複製代理設定檔覆蓋預設設定
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# 複製前端靜態頁面檔案
COPY . /var/www/html/
EXPOSE 80