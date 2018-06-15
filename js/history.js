function AddSearch() {

    var div = document.createElement('div');
    var input = document.createElement('input');

    input.name = 'filter';
    input.id = 'search';
    input.placeholder = 'Type to search...';

    div.appendChild(input);

    document.querySelector('h1').after(div);

    //var listItems = [].slice.call(document.querySelectorAll('#list tbody tr'));

    /*
     input.addEventListener('keyup', function () {
     var i,
     e = "^(?=.*\\b" + this.value.trim().split(/\s+/).join("\\b)(?=.*\\b") + ").*$",
     n = RegExp(e, "i");
     listItems.forEach(function(item) {
     item.removeAttribute('hidden');
     });
     listItems.filter(function(item) {
     i = item.querySelector('td').textContent.replace(/\s+/g, " ");
     return !n.test(i);
     }).forEach(function(item) {
     item.hidden = true;
     });
     });
     */
}

function Search() {
    var _pathname = window.document.location.pathname;
    var _search_key = document.getElementsByName('filter')[0].value;
    document.getElementsByName('filter')[0].value = '';
    //步骤一:创建异步对象
    var ajax = new XMLHttpRequest();
    //步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
    var url = "/__mysearch.html?" + "pathname=" + _pathname + "&search_key=" + _search_key;
    //console.log(url);
    ajax.open('get', url);
    //步骤三:发送请求
    ajax.send();
    //步骤四:注册事件 onreadystatechange 状态改变就会调用
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            //步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
            //console.log(ajax.responseText);//输入相应的内容
            ele = document.getElementsByTagName("tbody")[0];
            ele.innerHTML = ajax.responseText;
        }
    }
}

function EnterdSearch() {
    // 回车搜索DNS记录
    document.onkeydown = function (e) {
        var _event = e || window.event;
        if (_event.keyCode == 13) {
            switch (document.activeElement.name) {
                case 'filter':
                    Search();
                    break;
            }
        }
    }
}


if (!!(window.history && history.pushState)) {

    var addEvent = (function () {
        if (document.addEventListener) {
            return function (el, type, fn) {
                if (el && el.nodeName || el === window) {
                    el.addEventListener(type, fn, false);
                } else if (el && el.length) {
                    for (var i = 0; i < el.length; i++) {
                        addEvent(el[i], type, fn);
                    }
                }
            };
        } else {
            return function (el, type, fn) {
                if (el && el.nodeName || el === window) {
                    el.attachEvent('on' + type, function () {
                        return fn.call(el, window.event);
                    });
                } else if (el && el.length) {
                    for (var i = 0; i < el.length; i++) {
                        addEvent(el[i], type, fn);
                    }
                }
            };
        }
    })();

    var updateCrumbs = function () {
        window.document.title = window.location.pathname;
        setTimeout(function () {
            var loc = window.location.pathname;
            var segments = loc.split('/');
            var breadcrumbs = '';
            var currentPath = '/';
            for (var i = 0; i < segments.length; i++) {
                if (segments[i] !== '') {
                    currentPath += segments[i] + '/';
                    breadcrumbs += '<a href="' + currentPath + '">' + window.unescape(segments[i]) + '<\/a>';
                } else if (segments.length - 1 !== i) {
                    currentPath += '';
                    breadcrumbs += '<a href="' + currentPath + '">Root<\/a>';
                }
            }
            document.getElementById('breadcrumbs').innerHTML = breadcrumbs;
        }, 500);
    };

    var swapPage = function (href) {
        var req = false;
        if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            req = new ActiveXObject('Microsoft.XMLHTTP');
        }
        req.open('GET', href, false);
        req.send(null);

        if (req.status == 200) {
            var target = document.getElementsByClassName('box-content')[0];
            var div = document.createElement('div');
            div.innerHTML = req.responseText;
            var elements = div.getElementsByClassName('box-content')[0];
            target.innerHTML = elements.innerHTML;
            initHistory();
            AddSearch();
            return true;
            // Terrible error catching implemented! Basically, if the ajax request fails
            // we'll just refresh the entire page with the new URL.
        } else {
            window.location.replace(href);
        }
        return false;
    };

    var initHistory = function () {
        var list = document.getElementById('list');

        addEvent(list, 'click', function (event) {
            if (event.target.nodeName == 'A' && event.target.innerHTML.indexOf('/') !== -1) {
                event.preventDefault();
                swapPage(event.target.href);
                var title = event.target.innerHTML;
                history.pushState({page: title}, title, event.target.href);
                updateCrumbs();
            }
        });
    };

    addEvent(window, 'popstate', function (e) {
        swapPage(window.location.pathname);
        updateCrumbs();
    });

    initHistory();
}

AddSearch();
EnterdSearch();

