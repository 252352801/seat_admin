FROM nginx:1.11

RUN echo "Asia/shanghai" > /etc/timezone \
 && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
 && sed -i "s/#gzip  on;/gzip on;\n gzip_min_length 5k;\n gzip_buffers 4 16k;\n gzip_comp_level 3;\n gzip_vary on;\n gzip_types text\/plain text\/css application\/xml application\/javascript text\/javascript image\/jpeg image\/gif image\/png;\n/g" /etc/nginx/nginx.conf
ADD ./html /usr/share/nginx/html/admin