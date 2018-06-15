from django.shortcuts import render
import subprocess, os, time

# Create your views here.

root_dir = "/var/mirrors"

def auto_exact_size(num):
    """
    自动选择显示单位：TB, GB, MB, KB
    :param num: 传入的为Bytes单位数据
    :return:
    """
    num = int(num)
    if num >= 10**3 * (1<<30):
        num ='%.1f' %(num / (1<<40))
        ret = "%s TB" %(num)
    elif num >= 10**3 * (1<<20):
        num ='%.1f' %(num / (1<<30))
        ret = "%s GB" %(num)
    elif num >= 10**3 * (1<<10):
        num ='%.1f' %(num / (1<<20))
        ret = "%s MB" %(num)
    elif num >= 10**3:
        num ='%.1f' %(num / (1<<10))
        ret = "%s KB" %(num)
    else:
        ret = "%s B" %(num)
    return ret

def search(req):
    """
    搜索文件或目录
    :param req:
    :return:
    """
    data = [{'link':'-', 'title':'-', 'display':'-','size':'-', 'date':'-' }]  # 第一个tr被css样式隐藏了
    if req.method == 'GET':
        pathname = req.GET.get('pathname')
        search_key = req.GET.get('search_key')
        tag_dir = "%s%s" %(root_dir, pathname)
        # print("tag_dir====>", tag_dir)
        tag_dir = os.path.abspath(tag_dir)
        if tag_dir.startswith(root_dir) and search_key != '':
            cmd = "find %s %s |grep %s" %(tag_dir, search_key, search_key)
            P = subprocess.Popen(cmd, shell=True, stdin=subprocess.PIPE, stdout= subprocess.PIPE, stderr=subprocess.PIPE)
            for i in P.stdout.readlines():
                i = i.decode().split('\n')[0]
                obj_info = {}
                obj_attribute = os.stat(i)
                time_local = time.localtime(obj_attribute.st_mtime)
                dt = time.strftime("%Y-%b-%d %H:%M",time_local)
                obj_info['link'] = i.split(root_dir)[-1]
                obj_info['title'] = i.split('/')[-1]
                if os.path.isdir(i):
                    obj_info['display'] = "%s/" %(obj_info['title'])
                else:
                    obj_info['display'] = obj_info['title']
                obj_info['size'] = auto_exact_size(obj_attribute.st_size)
                obj_info['date'] = dt
                data.append(obj_info)

    print(data)
    return render(req, 'mysearch/tmp.html', {'data':data})
