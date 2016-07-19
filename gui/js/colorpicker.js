/**
 * Created by artur9010 on 19.07.2016.
 */

const ColorPicker = require("simple-color-picker");

var colorpicker = new ColorPicker({
    color: '#FF0000',
    el: document.getElementById("colorpicker"),
    height: 250,
    width: 250,
    background: '#454545'
});