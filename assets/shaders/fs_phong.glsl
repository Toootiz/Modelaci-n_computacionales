#version 300 es
precision highp float;

in vec3 v_normal; 
in vec3 v_lightDirection; //dirección de la fuente de luz
in vec3 v_cameraDirection; //dirección de la cámara

// Scene uniforms
uniform vec4 u_ambientLight;
uniform vec4 u_diffuseLight;
uniform vec4 u_specularLight;


// model uniforms
uniform vec4 u_ambientColor;
uniform vec4 u_diffuseColor;
uniform vec4 u_specularColor;
uniform float u_shininess;

out vec4 outColor;

void main() {
    //Ambient light component
    vec4 ambient = u_ambientLight * u_ambientColor;



    //Diffuse light component
    vec4 diffuse = vec4(0, 0, 0, 1);
    vec3 v_n_n = normalize(v_normal); //vector normalizado
    vec3 v_l_n = normalize(v_lightDirection); 
    float lambert = dot(v_n_n, v_l_n);
    if(lambert > 0.0){
        diffuse = u_diffuseLight * u_diffuseColor * lambert;
    };

    //Specular light component
    vec4 specular = vec4(0, 0, 0, 1);
    vec3 v_c_n = normalize(v_cameraDirection);
    vec3 v_paralelo = v_n_n * dot(v_n_n, v_l_n);
    vec3 v_perpendicular = v_n_n - v_paralelo;
    vec3 v_reflejado = v_paralelo - v_perpendicular;
    float spec = dot(v_c_n, v_reflejado);
    if(spec > 0.0){
        specular = u_specularLight * u_specularColor * pow(spec, u_shininess);
    };


    outColor = ambient + specular + diffuse;
}
