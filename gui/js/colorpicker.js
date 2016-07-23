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

waff.qq(".color-block").forEach(function (el) {
    el.on("click", function(e){
        console.log(this.css("background-color"));
        console.log(this);
        colorpicker.setColor(this.css("background-color"));
    });
});