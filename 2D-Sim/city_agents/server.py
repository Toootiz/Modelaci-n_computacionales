from agent import *
from model import CityModel
from mesa.visualization import CanvasGrid, ModularServer

def agent_portrayal(agent):
    portrayal = {
        "Shape": "rect",
        "Filled": "true",
        "Layer": 1,
        "w": 1,
        "h": 1,
    }

    if isinstance(agent, Road):
        portrayal.update({"Color": "grey", "Layer": 0, "text": agent.direction, "text_color": "black"})
    elif isinstance(agent, Destination):
        portrayal.update({"Color": "lightgreen", "Layer": 0})
    elif isinstance(agent, Traffic_Light):
        portrayal.update({
            "Color": "red" if not agent.state else "green",
            "Layer": 0,
            "w": 0.8,
            "h": 0.8,
        })
    elif isinstance(agent, Obstacle):
        portrayal.update({"Color": "cadetblue", "Layer": 0, "w": 0.8, "h": 0.8})
    elif isinstance(agent, Car):
        portrayal = {"Shape": "circle", "Color": "yellow", "Filled": "true", "Layer": 1, "r": 0.5}

    return portrayal

# Leer el archivo base solo una vez
with open("../city_files/2024_base.txt") as baseFile:
    lines = baseFile.readlines()
    width = len(lines[0]) - 1
    height = len(lines)

grid = CanvasGrid(agent_portrayal, width, height, 500, 500)

server = ModularServer(CityModel, [grid], "Traffic Base")
server.port = 8523
server.launch()
