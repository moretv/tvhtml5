// JavaScript Document
var manimate = function (h) {
    var a = document.getElementById(h), o = 0, e = {}, l = 10, k = function (b, c, g, d) {
        return-g * (b /= d) * (b - 2) + c
    }, n = function (b, c) {
        var g, d = /^([+-\\*\/]=)([-]?[\d.]+)/;
        if (d.test(b)) {
            d = b.match(d);
            d[2] = parseFloat(d[2]);
            switch (d[1]) {
                case "+=":
                    g = d[2];
                    break;
                case "-=":
                    g = -d[2];
                    break;
                case "*=":
                    g = c * d[2] - c;
                    break;
                case "/=":
                    g = c / d[2] - c;
                    break
            }
            return g
        }
        return parseFloat(b) - c
    };
    a.animate = a.animate || [];
    manimate[h] = {};
    manimate[h].stop = true;
    e.entrance = function (b, c, g) {
        setTimeout(function () {
            b(c[0], c[1], c[2])
        }, g || 0)
    };
    e.stop = function () {
        manimate[h].stop =false;
        a.animate.length = 0;
        document.getElementById(h).animate.length = 0;
        return e
    };
    e.queue = function () {
        if (a.animate && ++o == a.animate[0].length) {
            o = 0;
            a.animate[0].callback && a.animate[0].callback.apply(a);
            if (a.animate.length > 1) {
                a.animate[0].callback = a.animate[1].callback;
                a.animate = document.getElementById(h).animate || [];
                a.animate.shift();
                document.getElementById(h).animate = a.animate;
                for (var b = a.animate[0], c = 0; c < b.length; c++)b[c][0] === "opacity" ? e.entrance(e.alpha, [b[c][1], b[c][2]], l) : e.entrance(e.execution, [b[c][0],
                    b[c][1], b[c][2]], l)
            } else {
                a.animate.length = 0;
                document.getElementById(h).animate.length = 0
            }
        }
    };
    e.delay = function (b) {
        l = b;
        return e
    };
    e.execution = function (b, c, g) {
        var p = '';
        var d = (new Date).getTime(), f = g || 500,
            j = parseFloat(a.style[b] != undefined || a[b]) || 0,
            i = n(c, j);
        if(c.toString().indexOf('px') != -1){
            p = 'px';
        }
        if(c.toString().indexOf('em') != -1){
            p = 'em';
        }
        (function () {
            var m = (new Date).getTime() - d;
            if (m > f) {
                m = f;
                if(a.style[b] != undefined){
                    a.style[b] = parseInt(k(m, j, i, f)) + p;
                }else{
                    a[b] = parseInt(k(m, j, i, f)) + p;
                }
                e.queue();
                return e
            }
            if(a.style[b] != undefined){
                a.style[b] = parseInt(k(m, j, i, f)) + p;
            }  else{
                a[b] = parseInt(k(m, j, i, f)) + p;
            }
            manimate[h].stop && setTimeout(arguments.callee, 10)
        })()
    };
    e.animate = function (b, c, g) {
        var d = a.animate.length;
        a.animate[d] =
            [];
        a.animate[d].callback = g;
        for (var f in b) {
            a.animate[d].push([f, b[f], c]);
            if (d == 0)f == "opacity" ? e.entrance(e.alpha, [b[f], c], l) : e.entrance(e.execution, [f, b[f], c], l)
        }
        document.getElementById(h).animate = a.animate;
        return e
    };
    e.alpha = function (b, c) {
        var g = (new Date).getTime(), d = c || 500, f, j;
        if (document.defaultView) {
            f = document.defaultView.getComputedStyle(a, null).opacity || 1;
            j = n(b, f) * 100;
            (function () {
                var i = (new Date).getTime() - g;
                if (i > d) {
                    i = d;
                    a.style.opacity = k(i, 100 * f, j, d) / 100;
                    e.queue();
                    return e
                }
                a.style.opacity = k(i,
                    100 * f, j, d) / 100;
                manimate[h].stop && setTimeout(arguments.callee, 10)
            })()
        } else {
            f = a.currentStyle.filter ? a.currentStyle.filter.match(/^alpha\(opacity=([\d\.]+)\)$/)[1] / 100 : 1;
            j = n(b, f) * 100;
            (function () {
                var i = (new Date).getTime() - g;
                if (i > d) {
                    i = d;
                    a.style.filter = "alpha(opacity=" + k(i, 100 * f, j, d) + ")";
                    e.queue();
                    return e
                }
                a.style.filter = "alpha(opacity=" + k(i, 100 * f, j, d) + ")";
                manimate[h].stop && setTimeout(arguments.callee, 10)
            })()
        }
    };
    return e
};