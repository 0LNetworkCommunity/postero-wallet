import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import * as Device from 'expo-device';

export default function Art() {
  if (!Device.isDevice) {
    return null;
  }
  return (
    <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />
  );
}

const vertexShaderSource = `
  // an attribute will receive data from a buffer
  attribute vec4 a_position;

  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(1, 0, 0.5, 1); // return reddish-purple
  }
`;

function createShader(
  gl: ExpoWebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | undefined {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(
  gl: ExpoWebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function onContextCreate(gl: ExpoWebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = createProgram(gl, vertexShader, fragmentShader);
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  console.log("positionAttributeLocation", positionAttributeLocation);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // three 2d points
  const positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.viewport(0, 0, gl.drawingBufferWidth,gl.drawingBufferHeight);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset)

  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);

  gl.endFrameEXP();
}
