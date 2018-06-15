NGINX FancyIndex Theme Nginx浏览目录美化
===

基于 https://github.com/TheInsomniac/Nginx-Fancyindex-Theme 项目修改，新增了基于当前目录递归搜索

#####Usage:
 - Compile nginx with the fancyindex module.https://github.com/aperezdc/ngx-fancyindex.git
 - Include the contents of 'fancyindex.conf' in your location directive of your nginx conf.
 - 把项目克隆到nginx html目录下
  - header.html
  - footer.html
  - css\fancyindex.css
  - fonts\\*
  - images\breadcrumb.png
 - Restart your nginx server.

#####运行IndexSearch (pythyon)
本项目根目录下的IndexSearch 为后端搜索服务，需要跟nignx浏览目录服务器放部署在同一台机上
环境：python Django Nginx+ uWSGI 
安装python 3.5
pip install uwsgi
pyvenv pyvenv /usr/local/py_virtualenv/IndexSearch
创建运行uwsgi的用户

useradd uwsgi -M -s /sbin/nologin
id  uwsgi 
uid=1005(uwsgi) gid=1005(uwsgi) groups=1005(uwsgi)

cat /etc/uwsgi/uwsgi9091.ini 
```
[uwsgi]
socket = 127.0.0.1:9091
chdir = /var/webRoot/IndexSearch/
wsgi-file = IndexSearch/wsgi.py
virtualenv = /usr/local/py_virtualenv/IndexSearch/
;指定运行的用户,指定运行的用户与组，root用户不用指定uid与gid
uid = 1005
gid = 1005
master=True
vacuum=True
processes=5
max-requests=10000
pidfile = /var/run/uwsgi9091.pid
daemonize = /var/log/uwsgi/IndexSearch.log
```


#####Nginx安装配置
安装pcre
下载最新的pcre包
http://pcre.org/
#cd /usr/local/src
tar -zxvf pcre-8.42.tar.gz
cd pcre-8.42
./configure --enable-jit; make; make install
 ldconfig 

安装openssl
下载最新的openssl包
https://www.openssl.org/
cd /usr/local/src
tar -zxvf openssl-1.0.2o.tar.gz
cd openssl-1.0.2o
 ./config; make; make install
ldconfig  


cd /usr/local/src; git clone https://github.com/aperezdc/ngx-fancyindex.git
nginx安装：
./configure --prefix=/usr/local/nginx --user=nginx --group=nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre=/usr/local/src/pcre-8.42 --with-http_realip_module --with-http_image_filter_module --with-http_gzip_static_module --with-openssl=/usr/local/src/openssl-1.0.2o --with-openssl-opt="enable-tlsext" --with-stream --with-stream_ssl_module --with-http_v2_module --add-module=/usr/local/src/ngx-fancyindex

make; make install


nginx配置：
```
upstream index_search {
    server 127.0.0.1:9091 weight=10 max_fails=0;
}

server {
    listen  80;
    server_name  mirrors.bujidele.com;


    location /__mysearch.html {
        include uwsgi_params;
        uwsgi_pass index_search;
    }

    # Saltstack mirror file.
    location /saltstack/ {
        # include /usr/local/nginx/html/Nginx-Fancyindex-Theme/fancyindex.conf;
        include /usr/local/nginx/html/fancyindex/fancyindex.conf;
        root /var/mirrors;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
        charset utf-8,gbk;
    }
}

```

#####Addendums:
 - If you want your 'Parent Directory/' listing back in your file listings:
  - Read: [This Issue](https://github.com/TheInsomniac/Nginx-Fancyindex-Theme/issues/1#issuecomment-43936700)

![Image1](https://github.com/cucker0/file_store/blob/master/fancyindex/01.png)

