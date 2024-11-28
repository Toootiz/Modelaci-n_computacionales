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

const UPDATE_INTERVAL = 0.05; // Intervalo de actualización en segundos

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

// Define la clase Object3D para representar objetos 3D
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

    // Para la interpolación de delta time
    this.previousPosition = [...position];
    this.targetPosition = [...position];
    this.interpolationFactor = 1;
  }
}

// Define la URI del servidor de agentes
const agent_server_uri = "http://localhost:8585/";

// Inicializa arrays para almacenar agentes y otros objetos
let agents = [];
const obstacles = [];
const trafficLights = [];
const destinations = [];
const roads = [];

// Inicializa variables relacionadas con WebGL
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

// Define el objeto de datos
const data = {
  numAgents: 4,
  width: 24,
  height: 25,
};

// Variables para controlar el tiempo
let lastFrameTime = performance.now();
let lastUpdateTime = performance.now();

// Función principal para inicializar y ejecutar la aplicación
async function main() {
  const canvas = document.querySelector("canvas");
  gl = canvas.getContext("webgl2");

  // Crea la información del programa usando los shaders de vértice y fragmento
  programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

  // Genera los datos para los diferentes objetos
  const agentArrays = loadObj(deLoreanObj);
  const obstacleArrays = loadObj(buildingObj);
  const lightArrays = loadObj(trafficLightObj);
  const destinationArrays = loadObj(cubeObj);
  const roadArrays = loadObj(cubeObj);

  // Crea la información del buffer a partir de los datos
  agentsBufferInfo = twgl.createBufferInfoFromArrays(gl, agentArrays);
  obstaclesBufferInfo = twgl.createBufferInfoFromArrays(gl, obstacleArrays);
  lightsBufferInfo = twgl.createBufferInfoFromArrays(gl, lightArrays);
  destinationsBufferInfo = twgl.createBufferInfoFromArrays(
    gl,
    destinationArrays,
  );
  roadsBufferInfo = twgl.createBufferInfoFromArrays(gl, roadArrays);

  // Crea objetos de arreglo de vértices (VAOs) a partir de la información del buffer
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

  // Configura la interfaz de usuario
  setupUI();

  // Inicializa el modelo de agentes
  await initAgentsModel();

  // Obtiene los agentes y otros objetos
  await getAgents();
  await getObstacles();
  await getDestinations();
  await getRoads();
  await getLights();

  // Dibuja la escena
  await drawScene();
}

/*
 * Inicializa el modelo de agentes enviando una solicitud POST al servidor de agentes.
 */
async function initAgentsModel() {
  try {
    // Envía una solicitud POST al servidor de agentes para inicializar el modelo
    let response = await fetch(agent_server_uri + "init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Verifica si la respuesta fue exitosa
    if (response.ok) {
      // Analiza la respuesta como JSON y registra el mensaje
      let result = await response.json();
      console.log(result.message);
    }
  } catch (error) {
    // Registra cualquier error que ocurra durante la solicitud
    console.log(error);
  }
}

/*
 * Obtiene las posiciones actuales de todos los agentes (coches) del servidor de agentes.
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
        } else if (agent.direction == "Up") {
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
            1, // Valor alfa
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

          // Establecer previousPosition y targetPosition al mismo valor
          newAgent.previousPosition = [agent.x, agent.y, agent.z];
          newAgent.targetPosition = [agent.x, agent.y, agent.z];
          newAgent.interpolationFactor = 1;

          agents.push(newAgent);
        } else {
          // Actualizar la posición y rotación del agente existente
          existingAgent.previousPosition = existingAgent.position.slice();
          existingAgent.targetPosition = [agent.x, agent.y, agent.z];
          existingAgent.interpolationFactor = 0;
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
            [obstacle.x, obstacle.y - 0.001, obstacle.z],
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
 * Actualiza las posiciones de los agentes y los estados de los semáforos enviando una solicitud al servidor de agentes.
 */
async function update() {
  try {
    // Envía una solicitud al servidor de agentes para actualizar las posiciones y semáforos
    let response = await fetch(agent_server_uri + "update");

    // Verifica si la respuesta fue exitosa
    if (response.ok) {
      // Recupera las posiciones actualizadas de los agentes y los estados de los semáforos
      await getAgents();
      await getLights();
      // Registra un mensaje indicando que los agentes y semáforos han sido actualizados
      console.log("Updated agents and traffic lights");
    }
  } catch (error) {
    // Registra cualquier error que ocurra durante la solicitud
    console.log(error);
  }
}

/*
 * Dibuja la escena renderizando todos los objetos.
 */
async function drawScene() {
  // Calcula delta time
  let now = performance.now();
  let deltaTime = (now - lastFrameTime) / 1000; // en segundos
  lastFrameTime = now;

  // Actualiza la interpolación de los agentes
  for (const agent of agents) {
    // Actualiza el factor de interpolación
    agent.interpolationFactor += deltaTime / UPDATE_INTERVAL;
    if (agent.interpolationFactor > 1) {
      agent.interpolationFactor = 1;
    }
    // Interpola la posición
    agent.position = [
      agent.previousPosition[0] +
        (agent.targetPosition[0] - agent.previousPosition[0]) *
          agent.interpolationFactor,
      agent.previousPosition[1] +
        (agent.targetPosition[1] - agent.previousPosition[1]) *
          agent.interpolationFactor,
      agent.previousPosition[2] +
        (agent.targetPosition[2] - agent.previousPosition[2]) *
          agent.interpolationFactor,
    ];
  }

  // Verifica si es momento de actualizar
  if ((now - lastUpdateTime) / 1000 >= UPDATE_INTERVAL) {
    lastUpdateTime = now;
    await update();
  }

  // Redimensiona y limpia el canvas
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);

  // Uniformes globales (escena)
  const globalUniforms = {
    u_viewWorldPosition: [
      settings.cameraPosition.x + data.width / 2,
      settings.cameraPosition.y,
      settings.cameraPosition.z + data.height / 2,
    ],
    u_ambientLight: settings.ambientLight,
  };

  // Preparar arrays para múltiples fuentes de luz
  const MAX_LIGHTS = 28;
  const lightPositions = [];
  const lightDiffuseColors = [];
  const lightSpecularColors = [];

  // Incluir la luz principal
  lightPositions.push([
    settings.lightPosition.x,
    settings.lightPosition.y,
    settings.lightPosition.z,
  ]);
  lightDiffuseColors.push(settings.diffuseLight);
  lightSpecularColors.push(settings.specularLight);

  // Incluir fuentes de luz de los semáforos
  for (const light of trafficLights) {
    lightPositions.push(light.position);
    lightDiffuseColors.push(light.diffuseColor);
    lightSpecularColors.push([0, 0, 0, 1.0]); // Color especular por defecto
  }

  // Asegurarse de no exceder MAX_LIGHTS
  if (lightPositions.length > MAX_LIGHTS) {
    lightPositions.length = MAX_LIGHTS;
    lightDiffuseColors.length = MAX_LIGHTS;
    lightSpecularColors.length = MAX_LIGHTS;
  }

  const numLights = lightPositions.length;

  // Aplanar arrays (convertir en array de 1 dimensión)
  const flattenedLightPositions = lightPositions.flat();
  const flattenedLightDiffuseColors = lightDiffuseColors.flat();
  const flattenedLightSpecularColors = lightSpecularColors.flat();

  // Crear uniformes de luces
  const lightsUniforms = {
    u_numLights: numLights,
    u_lightWorldPositions: flattenedLightPositions,
    u_lightDiffuseColors: flattenedLightDiffuseColors,
    u_lightSpecularColors: flattenedLightSpecularColors,
  };

  // Combinar todos los uniformes
  const allUniforms = {
    ...globalUniforms,
    ...lightsUniforms,
  };
  twgl.setUniforms(programInfo, allUniforms);

  // Configurar la matriz de vista-proyección
  const viewProjectionMatrix = setupWorldView(gl);

  // Dibujar los objetos en el orden deseado
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

  // Solicita el siguiente fotograma
  requestAnimationFrame(() => drawScene());
}

/*
 * Dibuja un array de objetos.
 */
function drawObjects(objectsArray, vao, bufferInfo, viewProjectionMatrix) {
  // Vincula el objeto de arreglo de vértices
  gl.bindVertexArray(vao);

  // Itera sobre los objetos
  for (const obj of objectsArray) {
    // Crea la matriz de transformación del objeto
    const obj_trans = twgl.v3.create(...obj.position);
    const obj_scale = twgl.v3.create(...obj.scale);

    // Calcula la matriz mundial del objeto
    let worldMatrix = twgl.m4.identity();
    worldMatrix = twgl.m4.translate(worldMatrix, obj_trans);
    worldMatrix = twgl.m4.rotateX(worldMatrix, obj.rotation[0]);
    worldMatrix = twgl.m4.rotateY(worldMatrix, obj.rotation[1]);
    worldMatrix = twgl.m4.rotateZ(worldMatrix, obj.rotation[2]);
    worldMatrix = twgl.m4.scale(worldMatrix, obj_scale);

    // Calcula la matriz de vista-proyección mundial
    const worldViewProjectionMatrix = twgl.m4.multiply(
      viewProjectionMatrix,
      worldMatrix,
    );

    // Calcula la inversa transpuesta de la matriz mundial para las normales
    const worldInverseTransposeMatrix = twgl.m4.transpose(
      twgl.m4.inverse(worldMatrix),
    );

    // Establece los uniformes para el objeto
    const uniforms = {
      u_world: worldMatrix,
      u_worldInverseTransform: worldInverseTransposeMatrix,
      u_worldViewProjection: worldViewProjectionMatrix,
      u_ambientColor: obj.ambientColor,
      u_diffuseColor: obj.diffuseColor,
      u_specularColor: obj.specularColor,
      u_shininess: obj.shininess,
    };

    // Establece los uniformes y dibuja el objeto
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);
  }
}

/*
 * Configura la vista del mundo creando la matriz de vista-proyección.
 */
function setupWorldView(gl) {
  // Establece el campo de visión (FOV) en radianes
  const fov = (45 * Math.PI) / 180;

  // Calcula la relación de aspecto del canvas
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  // Crea la matriz de proyección
  const projectionMatrix = twgl.m4.perspective(fov, aspect, 1, 200);

  // Establece la posición objetivo
  const target = [data.width / 2, 0, data.height / 2];

  // Establece el vector hacia arriba
  const up = [0, 1, 0];

  // Calcula la posición de la cámara
  const camPos = twgl.v3.create(
    settings.cameraPosition.x + data.width / 2,
    settings.cameraPosition.y,
    settings.cameraPosition.z + data.height / 2,
  );

  // Crea la matriz de cámara
  const cameraMatrix = twgl.m4.lookAt(camPos, target, up);

  // Calcula la matriz de vista
  const viewMatrix = twgl.m4.inverse(cameraMatrix);

  // Calcula la matriz de vista-proyección
  const viewProjectionMatrix = twgl.m4.multiply(projectionMatrix, viewMatrix);

  // Retorna la matriz de vista-proyección
  return viewProjectionMatrix;
}

/*
 * Configura la interfaz de usuario (UI) para los ajustes de cámara y luz.
 */
function setupUI() {
  // Crea una nueva instancia de GUI
  const gui = new GUI();

  // Crea una carpeta para la posición de la cámara
  const posFolder = gui.addFolder("Camera Position:");
  posFolder.add(settings.cameraPosition, "x", -50, 50);
  posFolder.add(settings.cameraPosition, "y", -50, 50);
  posFolder.add(settings.cameraPosition, "z", -50, 50);

  // Agrega controles para la posición de la luz
  const lightFolder = gui.addFolder("Light Position:");
  lightFolder.add(settings.lightPosition, "x", -50, 50);
  lightFolder.add(settings.lightPosition, "y", -50, 50);
  lightFolder.add(settings.lightPosition, "z", -50, 50);

  // Agrega controles para los colores de la luz
  const lightColorFolder = gui.addFolder("Light Colors:");
  lightColorFolder.addColor(settings, "ambientLight");
  lightColorFolder.addColor(settings, "diffuseLight");
  lightColorFolder.addColor(settings, "specularLight");
}

main();
