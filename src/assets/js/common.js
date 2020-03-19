export function getQueryString (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

export function addcookie (name, value, expireHours = 168) {
    var exp = new Date();

    exp.setTime(exp.getTime() + 60 * 60 * 1000 * expireHours); //过期时间，默认1周   
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

export function getcookie (name) {
    var strcookie = document.cookie;
    var arrcookie = strcookie.split("; ");

    for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) return unescape(arr[1]);
    }
    return "";
}

export function delcookie (name) {
    var exp = new Date();

    exp.setTime(exp.getTime() - 1);
    var cval = getcookie(name);
    if (cval != null) document.cookie = name + "=" + cval + "; path=/;expires=" + exp.toGMTString();
}
