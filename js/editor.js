let defaultFrag = `#version 300 es
precision highp float;

uniform vec2 resolution;
uniform float time;

out vec4 fragColor;

void main(){
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.$blockScrolling = Infinity;
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
editor.getSession().setMode("ace/mode/glsl");
editor.setValue(defaultFrag);

editor.getSession().on('change', function() {
    execution();
});
