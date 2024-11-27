# Miguel Soria A01028033
# Script for managing the flask server that sends data to the vite server
# to render the sent data in WebGL
# 24/11/2024

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from city_agents.model import CityModel 
from city_agents.agent import Car, Traffic_Light, Destination, Obstacle, Road

with open('city_files/2022_base.txt') as baseFile:
    lines = baseFile.readlines()
    width = len(lines[0])-1
    height = len(lines)

numAgents = 1
cityModel = None
currentStep = 0

# This application will be used to interact with WebGL
app = Flask("Traffic Simulation")
cors = CORS(app, origins=['http://localhost'])

# This route will be used to send the parameters of the simulation to the server.
# The server expects a POST request with the parameters in JSON.
@app.route('/init', methods=['POST'])
@cross_origin()
def initModel():
    global currentStep, cityModel, numAgents, width, height

    if request.method == 'POST':
        try:
            numAgents = 1
            width = int(request.json.get('width'))
            height = int(request.json.get('height'))
            currentStep = 0

            print(request.json)
            print(f"Model parameters: {numAgents, width, height}")

            # Create the model using the parameters sent by the application
            cityModel = CityModel(numAgents)

            # Return a message saying that the model was created successfully
            return jsonify({"message": "Parameters received, model initiated."})

        except Exception as e:
            print(e)
            return jsonify({"message": "Error initializing the model"}), 500

# This route will be used to get the positions of the car agents
@app.route('/getAgents', methods=['GET'])
@cross_origin()
def getAgents():
    global cityModel

    if cityModel is None:
        return jsonify({"message": "Model not initialized"}), 400

    if request.method == 'GET':
        try:
            carPositions = [
                {"id": str(a.unique_id), "x": a.pos[0], "y": 1, "z": a.pos[1]}
                for a in cityModel.schedule.agents
                if isinstance(a, Car)
            ]
            return jsonify({'positions': carPositions})
        except Exception as e:
            print(f"Exception in getAgents: {e}")
            return jsonify({"message": "Error with the agent positions", "error": str(e)}), 500


@app.route('/getObstacles', methods=['GET'])
@cross_origin()
def getObstacles():
    global cityModel

    if cityModel is None:
        return jsonify({"message": "Model not initialized"}), 400

    if request.method == 'GET':
        try:
            obsPositions = [
                {"id": str(a.unique_id), "x": x, "y": 1, "z": y}
                for cell_contents, (x, y) in cityModel.grid.coord_iter()
                for a in cell_contents if isinstance(a, Obstacle)
            ]

            return jsonify({'positions': obsPositions})
        except Exception as e:
            print(traceback.format_exc())
            print(f"Exception in getObstacles: {e}")
            return jsonify({"message": "Error with the obstacle positions"}), 500

@app.route('/getLights', methods=['GET'])
@cross_origin()
def getLights():
    global cityModel

    if cityModel is None:
        return jsonify({"message": "Model not initialized"}), 400

    if request.method == 'GET':
        try:
            lightPositions = [
                {"id": str(a.unique_id), "x": x, "y": 2, "z": y, "state": a.state}
                for cell_contents, (x, y) in cityModel.grid.coord_iter()
                for a in cell_contents if isinstance(a, Traffic_Light)
            ]

            return jsonify({'positions': lightPositions})
        except Exception as e:
            print(traceback.format_exc())
            print(f"Exception in getObstacles: {e}")
            return jsonify({"message": "Error with the obstacle positions"}), 500


@app.route('/getDestinations', methods=['GET'])
@cross_origin()
def getDestinations():
    global cityModel

    if cityModel is None:
        return jsonify({"message": "Model not initialized"}), 400

    if request.method == 'GET':
        try:
            destPositions = [
                {"id": str(a.unique_id), "x": x, "y": 0.99, "z": y}
                for cell_contents, (x, y) in cityModel.grid.coord_iter()
                for a in cell_contents if isinstance(a, Destination)
            ]

            # for cell_contents, x, y in cityModel.grid.coord_iter():
            #     for a in cell_contents:
            #         if isinstance(a, Obstacle):
            #             destPositions.append({"id": str(a.unique_id), "x": x, "y": 1, "z": y})

            return jsonify({'positions': destPositions})
        except Exception as e:
            print(traceback.format_exc())
            print(f"Exception in getObstacles: {e}")
            return jsonify({"message": "Error with the obstacle positions"}), 500

@app.route('/getRoads', methods=['GET'])
@cross_origin()
def getRoads():
    global cityModel

    if cityModel is None:
        return jsonify({"message": "Model not initialized"}), 400

    if request.method == 'GET':
        try:
            roadPositions = [
                {"id": str(a.unique_id), "x": x, "y": 0.999, "z": y, "direction": a.direction}
                for cell_contents, (x, y) in cityModel.grid.coord_iter()
                for a in cell_contents if isinstance(a, Road)
            ]

            return jsonify({'positions': roadPositions})
        except Exception as e:
            print(traceback.format_exc())
            print(f"Exception in getObstacles: {e}")
            return jsonify({"message": "Error with the obstacle positions"}), 500


# This route will be used to update the model
@app.route('/update', methods=['GET'])
@cross_origin()
def updateModel():
    global currentStep, cityModel

    if cityModel is None:
        return jsonify({"message": "Model not initialized"}), 400

    if request.method == 'GET':
        try:
            cityModel.step()
            currentStep += 1
            return jsonify({'message': f'Model updated to step {currentStep}.', 'currentStep': currentStep})
        except Exception as e:
            print(f"Exception in updateModel: {e}")
            return jsonify({"message": "Error during step."}), 500

if __name__ == '__main__':
    # Run the flask server on port 8585
    app.run(host="localhost", port=8585, debug=True)

