/*
 * Miguel Enrique Soria A01028033
 * 22/11/2024
 * Main file for the frontend of the city agents visualization.
 * This file uses WebGL to render the multiple agents and city components through obj files and twgl.
 */

"use strict";

import * as twgl from "twgl.js";
import GUI from "lil-gui";

import deLoreanObj from "../assets/texturedDelorean.obj?raw";
import deLoreanMtl from "../assets/texturedDelorean.mtl?raw";

import buildingObj from "../assets/building.obj?raw";
import buildingMtl from "../assets/building.mtl?raw";

import cubeObj from "../assets/cube.obj?raw";

// import fsGLSL from "../assets/shaders/fs_phong.glsl?raw";
// import vsGLSL from "../assets/shaders/vs_phong.glsl?raw";

// Define the vertex shader code, using GLSL 3.00
const vsGLSL = `#version 300 es
in vec4 a_position;

uniform mat4 u_matrix;
uniform vec4 u_color;

out vec4 v_color;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = u_color;
}
`;

// Define the fragment shader code, using GLSL 3.00
const fsGLSL = `#version 300 es
precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
  outColor = v_color;
}
`;

// carga los datos del obj a json
function loadObj(data) {
  const lines = data.split("\n");
  // lines are splite per backspace (por cada vertice, cara, color o normal)
  const pos = [[0, 0, 0]];
  const normals = [[0, 0, 0]];
  const colors = [];
  const a_position = [];
  const a_normal = [];

  lines.forEach((line) => {
    const parts = line.trim().split(/\s+/);
    const type = parts[0];

    if (type == "v") {
      // vertices
      pos.push(parts.slice(1).map(parseFloat));
    } else if (type == "vn") {
      // normales
      normals.push(parts.slice(1).map(parseFloat));
    } else if (type == "f") {
      // caras
      for (let part of parts.slice(1)) {
        const indices = part.split("/").map((n) => parseInt(n, 10));
        a_position.push(...pos[indices[0]]);
        a_normal.push(...normals[indices[2]]);
      }
    } else {
      return;
    }
  });

  return {
    // setea los parametros
    a_position: { numComponents: 3, data: a_position },
    a_normal: { numComponents: 3, data: a_normal },
  };
}

// Define the Object3D class to represent 3D objects
class Object3D {
  constructor(
    id,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    color = [1, 1, 1, 1],
  ) {
    this.id = id;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.color = color;
    this.matrix = twgl.m4.create();
  }
}

// Define the agent server URI
const agent_server_uri = "http://localhost:8585/";

// Initialize arrays to store agents and other objects
let agents = [];
const obstacles = [];
const trafficLights = [];
const destinations = [];
const roads = [];

// Initialize WebGL-related variables
let gl,
  programInfo,
  agentsBufferInfo,
  obstaclesBufferInfo,
  lightsBufferInfo,
  destinationsBufferInfo,
  roadsBufferInfo,
  agentsVao,
  obstaclesVao,
  lightsVao,
  destinationsVao,
  roadsVao;

// Define the camera position
let cameraPosition = { x: 0, y: 9, z: 9 };

// Initialize the frame count
let frameCount = 0;

// Define the data object
const data = {
  numAgents: 4,
  width: 24,
  height: 25,
};

// Main function to initialize and run the application
async function main() {
  const canvas = document.querySelector("canvas");
  gl = canvas.getContext("webgl2");

  // Create the program information using the vertex and fragment shaders
  programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

  // Generate the data for the different objects
  const agentArrays = loadObj(deLoreanObj);
  const obstacleArrays = loadObj(buildingObj);
  const lightArrays = generateSphereData(0.5, 60);
  const destinationArrays = loadObj(cubeObj);
  const roadArrays = loadObj(cubeObj);

  // Create buffer information from the data
  agentsBufferInfo = twgl.createBufferInfoFromArrays(gl, agentArrays);
  obstaclesBufferInfo = twgl.createBufferInfoFromArrays(gl, obstacleArrays);
  lightsBufferInfo = twgl.createBufferInfoFromArrays(gl, lightArrays);
  destinationsBufferInfo = twgl.createBufferInfoFromArrays(
    gl,
    destinationArrays,
  );
  roadsBufferInfo = twgl.createBufferInfoFromArrays(gl, roadArrays);

  // Create vertex array objects (VAOs) from the buffer information
  agentsVao = twgl.createVAOFromBufferInfo(gl, programInfo, agentsBufferInfo);
  obstaclesVao = twgl.createVAOFromBufferInfo(
    gl,
    programInfo,
    obstaclesBufferInfo,
  );
  lightsVao = twgl.createVAOFromBufferInfo(gl, programInfo, lightsBufferInfo);
  destinationsVao = twgl.createVAOFromBufferInfo(
    gl,
    programInfo,
    destinationsBufferInfo,
  );
  roadsVao = twgl.createVAOFromBufferInfo(gl, programInfo, roadsBufferInfo);

  // Set up the user interface
  setupUI();

  // Initialize the agents model
  await initAgentsModel();

  // Get the agents and other objects
  await getAgents();
  await getObstacles();
  await getDestinations();
  await getRoads();
  await getLights();

  // Draw the scene
  await drawScene();
}

/*
 * Initializes the agents model by sending a POST request to the agent server.
 */
async function initAgentsModel() {
  try {
    // Send a POST request to the agent server to initialize the model
    let response = await fetch(agent_server_uri + "init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Check if the response was successful
    if (response.ok) {
      // Parse the response as JSON and log the message
      let result = await response.json();
      console.log(result.message);
    }
  } catch (error) {
    // Log any errors that occur during the request
    console.log(error);
  }
}

/*
 * Retrieves the current positions of all agents (cars) from the agent server.
 */
async function getAgents() {
  try {
    // Send a GET request to the agent server to retrieve the agent positions
    let response = await fetch(agent_server_uri + "getAgents");

    // Check if the response was successful
    if (response.ok) {
      // Parse the response as JSON
      let result = await response.json();

      // Log the agent positions
      console.log(result.positions);

      // Track the received agent IDs
      const receivedIds = result.positions.map((agent) => agent.id);

      // Remove agents that are no longer in the response
      agents = agents.filter((object3d) => receivedIds.includes(object3d.id));

      // Add new agents or update existing ones
      for (const agent of result.positions) {
        const existingAgent = agents.find(
          (object3d) => object3d.id === agent.id,
        );

        if (!existingAgent) {
          // Create a new agent and add it to the array
          const newAgent = new Object3D(
            agent.id,
            [agent.x, agent.y, agent.z],
            [0, 0, 0],
            [0.6, 0.8, 0.6],
            [1, 0, 1, 1],
          );
          agents.push(newAgent);
        } else {
          // Update the existing agent's position
          existingAgent.position = [agent.x, agent.y, agent.z];
        }
      }

      // Log the updated agents array
      console.log("Agents:", agents);
    } else {
      console.error("Failed to fetch agents:", response.statusText);
    }
  } catch (error) {
    // Log any errors that occur during the request
    console.error("Error fetching agents:", error);
  }
}

/*
 * Retrieves the current positions of all obstacles (buildings) from the agent server.
 */
async function getObstacles() {
  try {
    // Send a GET request to the agent server to retrieve the obstacle positions
    let response = await fetch(agent_server_uri + "getObstacles");

    // Check if the response was successful
    if (response.ok) {
      // Parse the response as JSON
      let result = await response.json();

      // Create new obstacles and add them to the obstacles array
      for (const obstacle of result.positions) {
        const newObstacle = new Object3D(
          obstacle.id,
          [obstacle.x, obstacle.y, obstacle.z],
          [0, 0, 0],
          [0.6, 0.8, 0.6],
          [0.5, 0.5, 0.8, 1],
        ); // Gray color
        obstacles.push(newObstacle);
      }
      // Log the obstacles array
      console.log("Obstacles:", obstacles);
    }
  } catch (error) {
    // Log any errors that occur during the request
    console.log(error);
  }
}

/*
 * Retrieves the current positions of all traffic lights from the agent server.
 */
async function getLights() {
  try {
    // Send a GET request to the agent server to retrieve the traffic light positions
    let response = await fetch(agent_server_uri + "getLights");

    // Check if the response was successful
    if (response.ok) {
      // Parse the response as JSON
      let result = await response.json();

      // Log the traffic light positions
      console.log(result.positions);

      // Check if the trafficLights array is empty
      if (trafficLights.length == 0) {
        // Create new traffic lights and add them to the trafficLights array
        for (const light of result.positions) {
          const newLight = new Object3D(
            light.id,
            [light.x, light.y, light.z],
            [0, 0, 0],
            [0.5, 0.5, 0.5],
            light.state ? [0, 1, 0, 1] : [1, 0, 0, 1], // Green if true, red if false
          );
          trafficLights.push(newLight);

          // create a road under the light
          const newRoad = new Object3D(
            light.id,
            [light.x, light.y - 1.001, light.z],
            [0, 0, 0],
            [1, 0.2, 1],
            [0.3, 0.3, 0.3, 1],
          ); // Dark gray color
          roads.push(newRoad);
        }
        // Log the traffic lights array
        console.log("Traffic Lights:", trafficLights);
      } else {
        // Update the positions and states of existing traffic lights
        for (const light of result.positions) {
          const current_light = trafficLights.find(
            (object3d) => object3d.id == light.id,
          );

          // Check if the traffic light exists in the trafficLights array
          if (current_light != undefined) {
            // Update the traffic light's state and color
            current_light.state = light.state;
            current_light.color = light.state ? [0, 1, 0, 1] : [1, 0, 0, 1]; // Green if true, red if false
          }
        }
      }
    }
  } catch (error) {
    // Log any errors that occur during the request
    console.log(error);
  }
}

/*
 * Retrieves the current positions of all destinations from the agent server.
 */
async function getDestinations() {
  try {
    // Send a GET request to the agent server to retrieve the destination positions
    let response = await fetch(agent_server_uri + "getDestinations");

    // Check if the response was successful
    if (response.ok) {
      // Parse the response as JSON
      let result = await response.json();

      // Create new destinations and add them to the destinations array
      for (const dest of result.positions) {
        const newDestination = new Object3D(
          dest.id,
          [dest.x, dest.y, dest.z],
          [0, 0, 0],
          [1, 0.2, 1],
          [0, 0, 1, 1],
        ); // Blue color
        destinations.push(newDestination);
      }
      // Log the destinations array
      console.log("Destinations:", destinations);
    }
  } catch (error) {
    // Log any errors that occur during the request
    console.log(error);
  }
}

/*
 * Retrieves the current positions of all roads from the agent server.
 */
async function getRoads() {
  try {
    // Send a GET request to the agent server to retrieve the road positions
    let response = await fetch(agent_server_uri + "getRoads");

    // Check if the response was successful
    if (response.ok) {
      // Parse the response as JSON
      let result = await response.json();

      // Create new roads and add them to the roads array
      for (const road of result.positions) {
        const newRoad = new Object3D(
          road.id,
          [road.x, road.y, road.z],
          [0, 0, 0],
          [1, 0.2, 1],
          [0.3, 0.3, 0.3, 1],
        ); // Dark gray color
        roads.push(newRoad);
      }
      // Log the roads array
      console.log("Roads:", roads);
    }
  } catch (error) {
    // Log any errors that occur during the request
    console.log(error);
  }
}

/*
 * Updates the agent positions and traffic light states by sending a request to the agent server.
 */
async function update() {
  try {
    // Send a request to the agent server to update the agent positions and traffic lights
    let response = await fetch(agent_server_uri + "update");

    // Check if the response was successful
    if (response.ok) {
      // Retrieve the updated agent positions and traffic light states
      await getAgents();
      await getLights();
      // Log a message indicating that the agents and traffic lights have been updated
      console.log("Updated agents and traffic lights");
    }
  } catch (error) {
    // Log any errors that occur during the request
    console.log(error);
  }
}

/*
 * Draws the scene by rendering all objects.
 */
async function drawScene() {
  // Resize the canvas to match the display size
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  // Set the viewport to match the canvas size
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Set the clear color and enable depth testing
  gl.clearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);

  // Clear the color and depth buffers
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Use the program
  gl.useProgram(programInfo.program);

  // Set up the view-projection matrix
  const viewProjectionMatrix = setupWorldView(gl);

  // Draw the objects in the desired order
  drawObjects(roads, roadsVao, roadsBufferInfo, viewProjectionMatrix);
  drawObjects(
    destinations,
    destinationsVao,
    destinationsBufferInfo,
    viewProjectionMatrix,
  );
  drawObjects(
    obstacles,
    obstaclesVao,
    obstaclesBufferInfo,
    viewProjectionMatrix,
  );
  drawObjects(agents, agentsVao, agentsBufferInfo, viewProjectionMatrix);
  drawObjects(trafficLights, lightsVao, lightsBufferInfo, viewProjectionMatrix);

  // Increment the frame count
  frameCount++;

  // Update the scene every 30 frames
  if (frameCount % 30 == 0) {
    frameCount = 0;
    await update();
  }

  // Request the next frame
  requestAnimationFrame(() => drawScene());
}

/*
 * Draws an array of objects.
 */
function drawObjects(objectsArray, vao, bufferInfo, viewProjectionMatrix) {
  // Bind the vertex array object
  gl.bindVertexArray(vao);

  // Iterate over the objects
  for (const obj of objectsArray) {
    // Create the object's transformation matrix
    const obj_trans = twgl.v3.create(...obj.position);
    const obj_scale = twgl.v3.create(...obj.scale);

    // Calculate the object's matrix
    obj.matrix = twgl.m4.translate(viewProjectionMatrix, obj_trans);
    obj.matrix = twgl.m4.rotateX(obj.matrix, obj.rotation[0]);
    obj.matrix = twgl.m4.rotateY(obj.matrix, obj.rotation[1]);
    obj.matrix = twgl.m4.rotateZ(obj.matrix, obj.rotation[2]);
    obj.matrix = twgl.m4.scale(obj.matrix, obj_scale);

    // Set the uniforms for the object
    let uniforms = {
      u_matrix: obj.matrix,
      u_color: obj.color,
    };

    // Set the uniforms and draw the object
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);
  }
}

/*
 * Sets up the world view by creating the view-projection matrix.
 */
function setupWorldView(gl) {
  // Set the field of view (FOV) in radians
  const fov = (45 * Math.PI) / 180;

  // Calculate the aspect ratio of the canvas
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  // Create the projection matrix
  const projectionMatrix = twgl.m4.perspective(fov, aspect, 1, 200);

  // Set the target position
  const target = [data.width / 2, 0, data.height / 2];

  // Set the up vector
  const up = [0, 1, 0];

  // Calculate the camera position
  const camPos = twgl.v3.create(
    cameraPosition.x + data.width / 2,
    cameraPosition.y,
    cameraPosition.z + data.height / 2,
  );

  // Create the camera matrix
  const cameraMatrix = twgl.m4.lookAt(camPos, target, up);

  // Calculate the view matrix
  const viewMatrix = twgl.m4.inverse(cameraMatrix);

  // Calculate the view-projection matrix
  const viewProjectionMatrix = twgl.m4.multiply(projectionMatrix, viewMatrix);

  // Return the view-projection matrix
  return viewProjectionMatrix;
}

/*
 * Sets up the user interface (UI) for the camera position.
 */
function setupUI() {
  // Create a new GUI instance
  const gui = new GUI();

  // Create a folder for the camera position
  const posFolder = gui.addFolder("Position:");

  // Add a slider for the x-axis
  posFolder.add(cameraPosition, "x", -50, 50).onChange((value) => {
    // Update the camera position when the slider value changes
    cameraPosition.x = value;
  });

  // Add a slider for the y-axis
  posFolder.add(cameraPosition, "y", -50, 50).onChange((value) => {
    // Update the camera position when the slider value changes
    cameraPosition.y = value;
  });

  // Add a slider for the z-axis
  posFolder.add(cameraPosition, "z", -50, 50).onChange((value) => {
    // Update the camera position when the slider value changes
    cameraPosition.z = value;
  });
}

// function for sphere
function generateSphereData(radius, resolution) {
  const positions = [];
  const indices = [];

  // Iterate over latitudes and longitudes
  for (let latNumber = 0; latNumber <= resolution; latNumber++) {
    const theta = (latNumber * Math.PI) / resolution; // Latitude angle
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let longNumber = 0; longNumber <= resolution; longNumber++) {
      const phi = (longNumber * 2 * Math.PI) / resolution; // Longitude angle
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;

      positions.push(radius * x, radius * y, radius * z);
    }
  }

  // Create indices for triangles
  for (let latNumber = 0; latNumber < resolution; latNumber++) {
    for (let longNumber = 0; longNumber < resolution; longNumber++) {
      const first = latNumber * (resolution + 1) + longNumber;
      const second = first + resolution + 1;

      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  return {
    a_position: { numComponents: 3, data: positions },
    indices: { numComponents: 3, data: indices },
  };
}

main();
