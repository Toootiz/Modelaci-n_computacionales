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
import sphereObj from "../assets/sphere.obj?raw";
import trafficLightObj from "../assets/traffic_lights.obj?raw";

import vsGLSL from "../assets/shaders/vs_phong.glsl?raw";
import fsGLSL from "../assets/shaders/fs_phong.glsl?raw";

// Configuración de la luz y la cámara
const settings = {
  cameraPosition: {
    x: 0,
    y: 35,
    z: 9,
  },
  lightPosition: {
    x: 10,
    y: 7.5,
    z: 10,
  },
  ambientLight: [0.3, 0.3, 0.3, 1.0],
  diffuseLight: [0.8, 0.8, 0.8, 1.0],
  specularLight: [0.1, 0.1, 0.1, 1.0],
};

let frameCount = 0;

// carga los datos del obj a json
function loadObj(data) {
  const lines = data.split("\n");
  const positions = [];
  const normals = [];

  const tempPositions = [];
  const tempNormals = [];

  lines.forEach((line) => {
    const parts = line.trim().split(/\s+/);
    const type = parts[0];

    if (type === "v") {
      tempPositions.push(parts.slice(1).map(parseFloat));
    } else if (type === "vn") {
      tempNormals.push(parts.slice(1).map(parseFloat));
    } else if (type === "f") {
      const faceVertices = parts.slice(1);
      faceVertices.forEach((vertex) => {
        const [vIdx, , nIdx] = vertex
          .split("/")
          .map((idx) => parseInt(idx) - 1);
        positions.push(...tempPositions[vIdx]);
        normals.push(...tempNormals[nIdx]);
      });
    }
  });

  return {
    a_position: { numComponents: 3, data: positions },
    a_normal: { numComponents: 3, data: normals },
  };
}

// Define the Object3D class to represent 3D objects
class Object3D {
  constructor(
    id,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    ambientColor = [0.2, 0.2, 0.2, 1],
    diffuseColor = [0.8, 0.8, 0.8, 1],
    specularColor = [1.0, 1.0, 1.0, 1],
    shininess = 50,
  ) {
    this.id = id;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.ambientColor = ambientColor;
    this.diffuseColor = diffuseColor;
    this.specularColor = specularColor;
    this.shininess = shininess;
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
const dynamycTrafficLights = [];

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
  const lightArrays = loadObj(trafficLightObj);
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
    // Enviar una solicitud GET al servidor de agentes para obtener las posiciones
    let response = await fetch(agent_server_uri + "getAgents");
    let rotation = [0, 0, 0];

    // Verificar si la respuesta fue exitosa
    if (response.ok) {
      // Analizar la respuesta como JSON
      let result = await response.json();

      // Registrar las posiciones de los agentes
      console.log(result.positions);

      // Obtener los IDs de los agentes recibidos
      const receivedIds = result.positions.map((agent) => agent.id);

      // Eliminar agentes que ya no están en la respuesta
      agents = agents.filter((object3d) => receivedIds.includes(object3d.id));

      // Agregar nuevos agentes o actualizar los existentes
      for (const agent of result.positions) {
        const existingAgent = agents.find(
          (object3d) => object3d.id === agent.id,
        );

        // Determinar la rotación según la dirección del agente
        if (agent.direction == "Down") {
          rotation = [0, 0, 0];
        } else if (agent.direction == "Down") {
          rotation = [0, Math.PI, 0];
        } else if (agent.direction == "Left") {
          rotation = [0, -Math.PI / 2, 0];
        } else if (agent.direction == "Right") {
          rotation = [0, Math.PI / 2, 0];
        } else {
          rotation = [0, 0, 0];
        }

        if (!existingAgent) {
          // Generar un color aleatorio para el nuevo agente
          const randomColor = [
            Math.random(),
            Math.random(),
            Math.random(),
            1, // Alpha value
          ];

          // Crear un nuevo agente y agregarlo al array
          const newAgent = new Object3D(
            agent.id,
            [agent.x, agent.y, agent.z],
            rotation,
            [0.6, 0.8, 0.4],
            [0.1, 0.1, 0.1, 1], // ambientColor
            randomColor, // diffuseColor (color aleatorio)
            [1.0, 1.0, 1.0, 1], // specularColor
            50, // shininess
          );
          agents.push(newAgent);
        } else {
          // Actualizar la posición y rotación del agente existente
          existingAgent.position = [agent.x, agent.y, agent.z];
          existingAgent.rotation = rotation;
          // No cambiar los colores de los agentes existentes
        }
      }

      // Registrar el array de agentes actualizado
      console.log("Agents:", agents);
    } else {
      console.error("Failed to fetch agents:", response.statusText);
    }
  } catch (error) {
    // Registrar cualquier error que ocurra durante la solicitud
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

      if (obstacles.length == 0) {
        // Create new obstacles and add them to the obstacles array
        for (const obstacle of result.positions) {
          const newObstacle = new Object3D(
            obstacle.id,
            [obstacle.x, obstacle.y, obstacle.z],
            [0, 0, 0],
            [0.6, 0.8, 0.6],
            [0.2, 0.2, 0.2, 1], // ambientColor
            [0.5, 0.5, 0.8, 1], // diffuseColor
            [0.3, 0.3, 0.3, 1], // specularColor
            160, // shininess
          ); // Gray color
          obstacles.push(newObstacle);

          // create a new road under the buildings
          const newRoad = new Object3D(
            obstacle.id,
            [obstacle.x, obstacle.y - 1.001, obstacle.z],
            [0, 0, 0],
            [1, 0.2, 1],
            [0.1, 0.1, 0.1, 1], // ambientColor
            [0.3, 0.3, 0.3, 1], // diffuseColor
            [0.3, 0.3, 0.3, 1], // specularColor
            400, // shininess
          ); // Dark gray color
          roads.push(newRoad);
        }
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
          const color = light.state
            ? [0.0, 1.0, 0.0, 0.5]
            : [1.0, 0.0, 0.0, 0.5]; // Green or Red

          const newLight = new Object3D(
            light.id,
            [light.x, light.y, light.z],
            [0, 0, 0],
            [0.5, 0.5, 0.5],
            [0.1, 0.1, 0.1, 1], // ambientColor
            color, // diffuseColor
            [1.0, 1.0, 1.0, 1], // specularColor
            30, // shininess
          );
          trafficLights.push(newLight);

          // create a road under the light
          const newRoad = new Object3D(
            light.id,
            [light.x, light.y - 1.001, light.z],
            [0, 0, 0],
            [1, 0.2, 1],
            [0.1, 0.1, 0.1, 1], // ambientColor
            [0.3, 0.3, 0.3, 1], // diffuseColor
            [0.3, 0.3, 0.3, 1], // specularColor
            400, // shininess
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
            current_light.diffuseColor = light.state
              ? [0.0, 1.0, 0.0, 0.2]
              : [1.0, 0.0, 0.0, 0.2]; // Green or Red
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
          [0.1, 0.1, 0.1, 1], // ambientColor
          [0.0, 1, 1.0, 1], // diffuseColor (Blue)
          [0.3, 0.3, 0.3, 1], // specularColor
          10, // shininess
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
          [0.1, 0.1, 0.1, 1], // ambientColor
          [0.3, 0.3, 0.3, 1], // diffuseColor
          [0.3, 0.3, 0.3, 1], // specularColor
          400, // shininess
        ); // Dark gray color
        roads.push(newRoad);
      }
      // Log the roads array
      console.log("Roads:", roads);
      // console.log("Response", result.positions);
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
  // Resize and clear the canvas
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);

  // Global uniforms (scene)
  const globalUniforms = {
    u_viewWorldPosition: [
      settings.cameraPosition.x + data.width / 2,
      settings.cameraPosition.y,
      settings.cameraPosition.z + data.height / 2,
    ],
    u_ambientLight: settings.ambientLight,
  };

  // Prepare arrays for multiple light sources
  const MAX_LIGHTS = 28;
  const lightPositions = [];
  const lightDiffuseColors = [];
  const lightSpecularColors = [];

  // Include the main light
  lightPositions.push([
    settings.lightPosition.x,
    settings.lightPosition.y,
    settings.lightPosition.z,
  ]);
  lightDiffuseColors.push(settings.diffuseLight);
  lightSpecularColors.push(settings.specularLight);

  // Include traffic light sources
  for (const light of trafficLights) {
    lightPositions.push(light.position);
    lightDiffuseColors.push(light.diffuseColor);
    lightSpecularColors.push([0, 0, 0, 1.0]); // Default specular color
  }

  // Ensure we don't exceed MAX_LIGHTS
  if (lightPositions.length > MAX_LIGHTS) {
    lightPositions.length = MAX_LIGHTS;
    lightDiffuseColors.length = MAX_LIGHTS;
    lightSpecularColors.length = MAX_LIGHTS;
  }

  const numLights = lightPositions.length;

  // Flatten arrays (turn into 1 dimensional array)
  const flattenedLightPositions = lightPositions.flat();
  const flattenedLightDiffuseColors = lightDiffuseColors.flat();
  const flattenedLightSpecularColors = lightSpecularColors.flat();

  // Create lights uniforms
  const lightsUniforms = {
    u_numLights: numLights,
    u_lightWorldPositions: flattenedLightPositions,
    u_lightDiffuseColors: flattenedLightDiffuseColors,
    u_lightSpecularColors: flattenedLightSpecularColors,
  };

  // Combine all uniforms
  const allUniforms = {
    ...globalUniforms,
    ...lightsUniforms,
  };
  twgl.setUniforms(programInfo, allUniforms);

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

  frameCount++;

  if (frameCount % 20 == 0) {
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

    // Calculate the object's world matrix
    let worldMatrix = twgl.m4.identity();
    worldMatrix = twgl.m4.translate(worldMatrix, obj_trans);
    worldMatrix = twgl.m4.rotateX(worldMatrix, obj.rotation[0]);
    worldMatrix = twgl.m4.rotateY(worldMatrix, obj.rotation[1]);
    worldMatrix = twgl.m4.rotateZ(worldMatrix, obj.rotation[2]);
    worldMatrix = twgl.m4.scale(worldMatrix, obj_scale);

    // Calculate the world-view-projection matrix
    const worldViewProjectionMatrix = twgl.m4.multiply(
      viewProjectionMatrix,
      worldMatrix,
    );

    // Calculate the inverse transpose of the world matrix for normals
    const worldInverseTransposeMatrix = twgl.m4.transpose(
      twgl.m4.inverse(worldMatrix),
    );

    // Set the uniforms for the object
    const uniforms = {
      u_world: worldMatrix,
      u_worldInverseTransform: worldInverseTransposeMatrix,
      u_worldViewProjection: worldViewProjectionMatrix,
      u_ambientColor: obj.ambientColor,
      u_diffuseColor: obj.diffuseColor,
      u_specularColor: obj.specularColor,
      u_shininess: obj.shininess,
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
    settings.cameraPosition.x + data.width / 2,
    settings.cameraPosition.y,
    settings.cameraPosition.z + data.height / 2,
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
 * Sets up the user interface (UI) for the camera and light settings.
 */
function setupUI() {
  // Create a new GUI instance
  const gui = new GUI();

  // Create a folder for the camera position
  const posFolder = gui.addFolder("Camera Position:");
  posFolder.add(settings.cameraPosition, "x", -50, 50);
  posFolder.add(settings.cameraPosition, "y", -50, 50);
  posFolder.add(settings.cameraPosition, "z", -50, 50);

  // Add controls for the light position
  const lightFolder = gui.addFolder("Light Position:");
  lightFolder.add(settings.lightPosition, "x", -50, 50);
  lightFolder.add(settings.lightPosition, "y", -50, 50);
  lightFolder.add(settings.lightPosition, "z", -50, 50);

  // Add controls for the light colors
  const lightColorFolder = gui.addFolder("Light Colors:");
  lightColorFolder.addColor(settings, "ambientLight");
  lightColorFolder.addColor(settings, "diffuseLight");
  lightColorFolder.addColor(settings, "specularLight");
}

main();
