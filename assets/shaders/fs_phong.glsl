#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_cameraDirection;
in vec3 v_worldPosition;

// Scene uniforms
uniform vec4 u_ambientLight;

// Light arrays
uniform int u_numLights;
uniform vec3 u_lightWorldPositions[25];
uniform vec4 u_lightDiffuseColors[25];
uniform vec4 u_lightSpecularColors[25];

// Model uniforms
uniform vec4 u_ambientColor;
uniform vec4 u_diffuseColor;
uniform vec4 u_specularColor;
uniform float u_shininess;

out vec4 outColor;

void main() {
    // Global ambient light (from the top light only)
    vec4 ambient = u_ambientLight * u_ambientColor;

    vec3 normal = normalize(v_normal);
    vec3 viewDir = normalize(v_cameraDirection);

    vec4 totalDiffuse = vec4(0.0);
    vec4 totalSpecular = vec4(0.0);

    // Loop through all lights
    for (int i = 0; i < u_numLights; ++i) {
        vec3 lightDir = normalize(u_lightWorldPositions[i] - v_worldPosition);
        float lambertian = max(dot(normal, lightDir), 0.0);
        vec4 diffuse = u_lightDiffuseColors[i] * u_diffuseColor * lambertian;

        vec3 halfDir = normalize(lightDir + viewDir);
        float specAngle = max(dot(halfDir, normal), 0.0);
        float specularFactor = pow(specAngle, u_shininess);
        vec4 specular = u_lightSpecularColors[i] * u_specularColor * specularFactor;

        // Separate contributions for global and local lights
        if (i == 0) {
            // Top light (global)
            ambient += diffuse;
            totalSpecular += specular;
        } else {
            // Local lights (traffic lights)
            totalDiffuse += diffuse;
            totalSpecular += specular;
        }
    }

    // Final color combines global ambient and local contributions
    outColor = ambient + totalDiffuse + totalSpecular;
    outColor.a = 1.0;
}

