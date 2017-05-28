var microcomponent = require('microcomponent')
var Camera = require('regl-camera')
var html = require('choo/html')
var glsl = require('glslify')
var bunny = require('bunny')
var choo = require('choo')
var Regl = require('regl')

var bunnyComponent = BunnyComponent()

var app = choo()
app.route('/', function (state, emit) {
  return html`
    <body>
      ${bunnyComponent.render()}
    </body>
  `
})

function BunnyComponent () {
  var component = microcomponent('bunny')
  component.on('render', function () {
    return html`
      <canvas></canvas>
    `
  })

  var regl = Regl({ canvas: component.element })
  var camera = Camera(regl, {
    distance: 30
  })
  var draw = regl({
    frag: glsl`
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1, 1, 1, 1);
      }
    `,
    vert: glsl`
      precision mediump float;
      uniform mat4 projection, view;
      attribute vec3 position;
      void main() {
        gl_Position = projection * view * vec4(position, 1);
      }
    `,
    attributes: {
      position: bunny.positions
    },
    elements: bunny.cells
  })

  regl.frame(function (props) {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1
    })

    camera(function () {
      draw()
    })
  })

  return component
}
