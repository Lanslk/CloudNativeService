FROM ubuntu:latest
LABEL authors="yutenglan"

ENTRYPOINT ["top", "-b"]

FROM php:8.2-apache
# 將 PHP 與前端靜態檔案複製到 Apache 網頁根目錄
COPY . /var/www/html/
EXPOSE 80