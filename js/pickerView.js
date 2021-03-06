"use strict"; (function(c) {
    var b = function(d) {
        this.pickerOpts = d;
        this.prefix = "_picker-" + new Date().getTime();
        this.itemHeight = 40;
        this.pos = {
            startY: 0,
            moveY: 0,
            endY: 0,
            curY: 0,
            itemStartY: 0
        };
        this.createPickerDom();
        this.container = document.querySelector("." + this.prefix);
        this.mask = this.container.querySelector("._picker-mask");
        this.cols = this.container.querySelectorAll("._picker-col");
        this.col_list = this.container.querySelectorAll("._picker-data-list");
        this.btnCancel = this.container.querySelector("._picker-btn-cancel");
        this.btnConfirm = this.container.querySelector("._picker-btn-confirm");
        if (this.pickerOpts.selector) {
            this.selector = document.getElementById(this.pickerOpts.selector)
        }
        this.bind()
    };
    b.prototype = {
        show: function() {
            this.container.className = "_picker-container " + this.prefix
        },
        bind: function() {
            var f = this;
            var e = function() {
                if (typeof f.pickerOpts.onCancel === "function") {
                    f.pickerOpts.onCancel()
                }
                f.container.className = "_picker-container hide"
            };
            this.mask.addEventListener("touchend", e, false);
            this.btnCancel.addEventListener("touchend", e, false);
            this.btnConfirm.addEventListener("touchend",
            function() {
                if (typeof f.pickerOpts.onConfirm === "function") {
                    var g = [];
                    for (var h = 0; h < f.pickerOpts.cols.length; h++) {
                        var j = f.pickerOpts.cols[h].curVal !== undefined ? f.pickerOpts.cols[h].curVal: f.pickerOpts.cols[h].values[0];
                        g.push(f.pickerOpts.type === "date" ? parseInt(j.substr(0, j.length - 1)) : j)
                    }
                    f.pickerOpts.onConfirm(g)
                }
                f.container.className = "_picker-container hide"
            },
            false);
            this.selector && this.selector.addEventListener("touchend",
            function() {
                f.show()
            },
            false);
            for (var d = 0; d < this.cols.length; d++) {
                this.cols[d].addEventListener("touchstart", f.touchEventCallBack(d, "touchstart", f.pos), false);
                this.cols[d].addEventListener("touchmove", f.touchEventCallBack(d, "touchmove", f.pos), false);
                this.cols[d].addEventListener("touchend", f.touchEventCallBack(d, "touchend", f.pos), false)
            }
        },
        touchEventCallBack: function(d, e, g) {
            var f = this;
            return function(l) {
                l.preventDefault();
                switch (e) {
                case "touchstart":
                    g.startY = l.touches[0].clientY;
                    g.curY = g.itemStartY = (1 - f.pickerOpts.cols[d].curIndex) * f.itemHeight;
                    f.col_list[d].classList.remove("animate");
                    break;
                case "touchmove":
                    g.moveY = l.changedTouches[0].clientY;
                    g.curY = g.itemStartY + (g.moveY - g.startY);
                    f.col_list[d].setAttribute("style", "-webkit-transform:translate3d(0, " + g.curY + "px, 0);transform:translate3d(0, " + g.curY + "px, 0)");
                    break;
                case "touchend":
                    g.endY = l.changedTouches[0].clientY;
                    var i = Math.round((g.startY - g.endY) / f.itemHeight) + f.pickerOpts.cols[d].curIndex;
                    var h = f.pickerOpts.cols[d].values.length;
                    if (i < 0) {
                        i = 0
                    } else {
                        if (i >= h) {
                            i = h - 1
                        }
                    }
                    f.pickerOpts.cols[d].curIndex = i;
                    f.pickerOpts.cols[d].curVal = f.pickerOpts.cols[d].values[i];
                    f.col_list[d].classList.add("animate");
                    f.col_list[d].setAttribute("style", "-webkit-transform:translate3d(0, " + (1 - i) * f.itemHeight + "px, 0);transform:translate3d(0, " + (1 - i) * f.itemHeight + "px, 0);");
                    if (f.pickerOpts.type === "date" && (d === 1 || d === 0 && f.pickerOpts.cols[1].curVal === "2月")) {
                        var j = f.pickerOpts.cols[0].curVal;
                        var k = f.pickerOpts.cols[1].curVal;
                        f.updateCol(2, {
                            values: a(j.substr(0, j.length - 1), k.substr(0, k.length - 1))
                        })
                    }
                    if (typeof f.pickerOpts.onSelected === "function") {
                        var m = f.pickerOpts.cols[d].curVal;
                        f.pickerOpts.onSelected(d, f.pickerOpts.cols[d].curIndex, f.pickerOpts.type === "date" ? parseInt(m.substr(0, m.length - 1)) : m)
                    }
                    break
                }
            }
        },
        createPickerDom: function() {
            var f = this.pickerOpts;
            var d = "";
            for (var e = 0; e < f.cols.length; e++) {
                this.initCol(f.cols[e]);
                d += '<div class="_picker-col">' + this.setOptions(f.cols[e]) + "</div>"
            }
            var g = '<div class="_picker-container hide ' + this.prefix + '">' + '<div class="_picker-mask"></div>' + '<div class="_picker-wrapper">' + '<div class="_picker-head">' + '<h3 class="_picker-title">' + (f.title || "") + "</h3>" + '<a class="_picker-btn-cancel" href="javascript:;">Cancel</a>' + '<a class="_picker-btn-confirm" href="javascript:;">Confirm</a>' + "</div>" + '<div class="_picker-content">' + d + "</div>" + "</div>" + "</div>";
            var h = document.createElement("div");
            h.innerHTML = g;
            document.body.appendChild(h)
        },
        setOptions: function(d) {
            this.initCol(d);
            var f = '<ul class="_picker-data-list" style="-webkit-transform:translate3d(0, ' + (1 - d.curIndex) * this.itemHeight + "px, 0);transform:translate3d(0, " + (1 - d.curIndex) * this.itemHeight + 'px, 0)">';
            for (var e = 0; e < d.values.length; e++) {
                f += "<li>" + d.values[e] + "</li>"
            }
            return f + "</ul>"
        },
        initCol: function(e) {
            if (!e.values.length) {
                return
            }
            if (e.curVal) {
                var d = e.values.indexOf(e.curVal);
                if (d === -1) {
                    e.curVal = e.values[0];
                    e.curIndex = 0
                } else {
                    e.curIndex = d
                }
            } else {
                e.curVal = e.values[0];
                e.curIndex = 0
            }
        },
        updateCol: function(e, d) {
            this.cols[e].innerHTML = this.setOptions(d);
            this.pickerOpts.cols[e] = d;
            this.col_list = document.querySelectorAll("." + this.prefix + " ._picker-data-list")
        }
    };
    c.PickerView = b
} (window));
if (typeof define === "function" && define.amd) {
    define("pickerView", [],
    function() {
        return PickerView
    })
} else {
    if (typeof module !== "undefined" && module.exports) {
        module.exports = PickerView
    }
};