# TC2008B
**Modelación de sistemas multiagentes con gráficas computacionales**

Simulation of CDMX traffic through python and js [Vite](https://es.vitejs.dev/guide/) server using [Mesa](https://mesa.readthedocs.io) and [WebGL](https://idk.com).

## Team Members

- [Gabriel Muñoz Luna](https://github.com/Toootiz)
- [Miguel Enrique Soria](https://github.com/mesc2004)

## Video of the project explanation and simulation
[Video link](https://www.youtube.com/watch?v=N64wJhSg8BI)

## Image of the project running
![image](https://github.com/user-attachments/assets/59f1332d-46f6-486d-9a68-10690c9cd723)


## Cloning the repository

In your terminal, run:
    ```
    git clone https://github.com/Toootiz/Modelacion_Reto
    ```
    
## Dependencies
To run the project, you must first have python and node.
> Tested versions: `python: 3.9.13`  `node: 22.5.1`

### Python backend dependencies
In the **python-server** directory, install:
- Flask: installed with `pip install flask`
- Flask-Cors: installed with `pip install flask-cors`
- Mesa (must be v2.4.0): install specific version with `pip install mesa==2.4.0`

### Vite frontend depenencies
In the **visualization** directory, run:
- `npm install` or `npm i`
This should install the necessary versions according to repository settings.

## Running the project

#### Backend
In the python-server directory, run `python city-server.py`

#### Frontend
In the visualization directory, run `npx vite`

##### Simulation Parameters
> If you want the simulation to run faster, lower the value of `UPDATE_INTERVAL` in *city_agents.js*. If you want it to run slower, raise the value. This value is in seconds.
> For determining the amount of steps that it takes for new agents to appear, change the `self.spawn_interval` value in *model.py*.
