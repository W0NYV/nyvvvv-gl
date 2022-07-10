let defaultFrag = `#version 300 es
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform sampler2D sampler;

out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  fragColor = texture(sampler, uv);
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
