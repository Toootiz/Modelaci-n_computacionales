from mesa import Model
from mesa.time import RandomActivation
from mesa.space import MultiGrid
from agent import *
import json

class CityModel(Model):
    """ 
        Creates a model based on a city map.

        Args:
            N: Number of agents in the simulation
    """
    def __init__(self, N):

        # Load the map dictionary. The dictionary maps the characters in the map file to the corresponding agent.
        dataDictionary = json.load(open("city_files/mapDictionary.json"))

        self.traffic_lights = []
        

        # Load the map file. The map file is a text file where each character represents an agent.
        with open('city_files/2023_base.txt') as baseFile:
            lines = baseFile.readlines()
            self.width = len(lines[0])-1
            self.height = len(lines)

            self.grid = MultiGrid(self.width, self.height, torus = False) 
            self.schedule = RandomActivation(self)

            self.static_map = [[None for _ in range(self.width)] for _ in range(self.height)]
            
            # Goes through each character in the map file and creates the corresponding agent.
            for r, row in enumerate(lines):
                for c, col in enumerate(row):
                    cell_pos = (c, self.height - r - 1)
                    if col in ["v", "^", ">", "<"]:
                        direction = dataDictionary[col]  # Dirección de la calle
                        agent = Road(f"r_{r*self.width+c}", self, direction)
                        self.grid.place_agent(agent, cell_pos)
                        self.static_map[cell_pos[1]][cell_pos[0]] = {"type": "Road", "direction": direction}

                    elif col in ["S", "s"]:
                        agent = Traffic_Light(f"tl_{r*self.width+c}", self, False if col == "S" else True, int(dataDictionary[col]))
                        self.grid.place_agent(agent, cell_pos)
                        self.schedule.add(agent)
                        self.traffic_lights.append(agent)
                        self.static_map[cell_pos[1]][cell_pos[0]] = {"type": "Traffic_Light"}

                    elif col == "#":
                        agent = Obstacle(f"ob_{r*self.width+c}", self)
                        self.grid.place_agent(agent, cell_pos)
                        self.static_map[cell_pos[1]][cell_pos[0]] = {"type": "Obstacle"}

                    elif col == "D":
                        agent = Destination(f"d_{r*self.width+c}", self)
                        self.grid.place_agent(agent, cell_pos)
                        self.static_map[cell_pos[1]][cell_pos[0]] = {"type": "Destination"}
                
            # Agregar un agente Car en la posición (0, 0)
            car = Car("car_0", self)
            self.grid.place_agent(car, (0, 0))  # Posicionar en (0, 0)
            self.schedule.add(car)

        self.num_agents = N
        self.running = True
        

    def step(self):
        '''Advance the model by one step.'''
        self.schedule.step()
