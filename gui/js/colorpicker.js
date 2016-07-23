/**
 * Created by artur9010 on 19.07.2016.
 */
const ColorPicker = require("simple-color-picker");

var colorpicker = new ColorPicker({
    color: '#FF0000',
    el: document.getElementById("colorpicker"),
    height: 250,
    width: 249,
    background: '#F5F5F4'
});

function rgb2hex(orig) {
    var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
}

waff.qq(".color-block").forEach(function (el) {
    waff.q(el).on("click", function(e){
        alert("test");
        colorpicker.setColor(waff.q(this).css("background-color"));
    });
})