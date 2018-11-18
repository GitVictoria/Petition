$(".registerType").on("mouseover", function(e) {
    $(e.target).css({
        "font-size": "50px",
        transitionProperty: "font-size",
        transitionDuration: "0.5s"
    });
    $(".registerType").on("mouseout", function(e) {
        $(e.target).css({
            "font-size": "40px",
            transitionProperty: "font-size",
            transitionDuration: "0.5s"
        });
    });
});
$(".registerType").on("click", function() {
    $(".register").show("slow");
    $(".line-in-middle").hide("slow");
    // display: "visible",
    // transitionProperty: "visibility",
    // transitionDuration: "0.5s"
});

$("button").on("mouseover", function(e) {
    $(e.target).css({
        background: "#ffffff4d",
        transitionProperty: "background",
        transitionDuration: "0.3s"
    });

    $("button").on("mouseout", function(e) {
        $(e.target).css({
            background: "none",
            transitionProperty: "background",
            transitionDuration: "0.3s"
        });
    });
});

$("input").on("mouseover", function(e) {
    $(e.target).css({
        background: "#ffffff4d",
        transitionProperty: "background",
        transitionDuration: "0.3s"
    });

    $("input").on("mouseout", function(e) {
        $(e.target).css({
            background: "none",
            transitionProperty: "background",
            transitionDuration: "0.3s"
        });
    });
});

$(".thanksButtons").on("mouseover", function(e) {
    $(e.target).css({
        background: "#ffffff4d",
        transitionProperty: "background",
        transitionDuration: "0.3s"
    });

    $(".thanksButtons").on("mouseout", function(e) {
        $(e.target).css({
            background: "none",
            transitionProperty: "background",
            transitionDuration: "0.3s"
        });
    });
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
///
//
var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = "";
    this.tick();
    this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

    var that = this;
    var delta = 300 - Math.random() * 100;

    if (this.isDeleting) {
        delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName("txt-rotate");
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute("data-rotate");
        var period = elements[i].getAttribute("data-period");
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);
};
