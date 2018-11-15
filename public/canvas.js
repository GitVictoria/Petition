let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let input = document.getElementById("string");
console.log("hey");

ctx.strokeStyle = "black";
ctx.beginPath();
ctx.lineWidth = 3;

let draw = function(e) {
    var x = e.offsetX;
    var y = e.offsetY;
    ctx.lineTo(x, y);
    ctx.stroke();
};

canvas.addEventListener("mousedown", e => {
    console.log("MOUSEDOWN");
    var x = e.offsetX;
    var y = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(x, y);
    canvas.addEventListener("mousemove", draw);

    document.addEventListener("mouseup", e => {
        canvas.removeEventListener("mousemove", draw);
        input.value = canvas.toDataURL();
    });
    console.log(input);
});
