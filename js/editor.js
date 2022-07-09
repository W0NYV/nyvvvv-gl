let defaultFrag = `#version 300 es
precision highp float;

uniform vec2 resolution;
uniform float time;

out vec4 fragColor;

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  fragColor = vec4(p, 0.0, 1.0);
}`;

let editor = ace.edit("editor");
// editor.setTheme("ace/theme/monokai");
editor.$blockScrolling = Infinity;
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
editor.getSession().setTabSize(2);
editor.getSession().setMode("ace/mode/glsl");
editor.setValue(defaultFrag);

editor.getSession().on('change', function() {
    execution();
});
