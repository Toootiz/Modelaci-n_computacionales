# TC2008B
**Modelación de sistemas multiagentes con gráficas computacionales**

Simulation of CDMX traffic through python and js [Vite](https://es.vitejs.dev/guide/) server using [Mesa](https://mesa.readthedocs.io) and [WebGL](https://idk.com).

## Team Members

- [Gabriel Muñoz Luna](https://github.com/Toootiz)
- [Miguel Enrique Soria](https://github.com/mesc2004)

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

### Optional for faster execution with single command
If you wish to be able to run the project with one command, in the root of the repository run:
- `npm install` or `npm i`
This will allow you to use an npm command to run the project. If you wish to skip this step, you can use the instructions shown [here](#run-each-server-manually)

## Running the project

### Single command run
If you installed the dependencies on the root directory, you should be able to run `npm start`, with messages labeled [FRONT] and [BACK] for each section of the project.

### Run each server manually
#### Backend
In the python-server directory, run `python city-server.py`

#### Frontend
In the visualization directory, run `npx vite`
