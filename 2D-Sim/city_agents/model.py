from mesa import Model
from mesa.time import RandomActivation
from mesa.space import MultiGrid
from .agent import *
import json
import random

class CityModel(Model):
    def __init__(self):
        dataDictionary = json.load(open("city_files/mapDictionary.json"))

        self.traffic_lights = []
        self.destinations = []
        self.graph = {}
        self.spawned_agents = 0
        self.spawn_interval = 2
        self.step_count = 0

        with open('city_files/2024_base.txt') as baseFile:
            lines = baseFile.readlines()
            self.width = len(lines[0]) - 1
            self.height = len(lines)

            self.grid = MultiGrid(self.width, self.height, torus=False)
            self.schedule = RandomActivation(self)

            self.static_map = [[None for _ in range(self.width)] for _ in range(self.height)]

            self.spawn_positions = [
                (0, 0),
                (self.width - 1, 0),
                (0, self.height - 1),
                (self.width - 1, self.height - 1)
            ]

            # Diccionario para caracteres del mapa y sus propiedades
            map_properties = {
                "V": {"type": "Road", "is_walkable": True},
                "v": {"type": "Road", "is_walkable": True},
                "^": {"type": "Road", "is_walkable": True},
                ">": {"type": "Road", "is_walkable": True},
                "<": {"type": "Road", "is_walkable": True},
                "I": {"type": "Road", "is_walkable": True},
                "i": {"type": "Road", "is_walkable": True},
                "O": {"type": "Road", "is_walkable": True},
                "o": {"type": "Road", "is_walkable": True},
                "A": {"type": "Road", "is_walkable": True},
                "a": {"type": "Road", "is_walkable": True},
                "Z": {"type": "Road", "is_walkable": True},
                "z": {"type": "Road", "is_walkable": True},
                "D": {"type": "Destination", "is_walkable": True},
                "S": {"type": "Traffic_Light", "is_walkable": True},
                "s": {"type": "Traffic_Light", "is_walkable": True},
                "#": {"type": "Obstacle", "is_walkable": False},
            }

            for r, row in enumerate(lines):
                for c, col in enumerate(row):
                    cell_pos = (c, self.height - r - 1)
                    if col in dataDictionary:
                        directions = dataDictionary[col] if isinstance(dataDictionary[col], list) else [dataDictionary[col]]
                        self.graph[cell_pos] = self.get_neighbors(cell_pos, directions, dataDictionary, lines, col)

                        # Usar las propiedades del mapa para decidir el tipo de agente
                        if col in map_properties:
                            properties = map_properties[col]
                            cell_type = properties["type"]

                            if cell_type == "Road":
                                agent = Road(f"r_{cell_pos}", self, directions)
                                self.grid.place_agent(agent, cell_pos)
                                self.static_map[cell_pos[1]][cell_pos[0]] = {"type": "Road", "directions": directions}
                            elif cell_type == "Destination":
                                agent = Destination(f"d_{cell_pos}", self)
                                self.grid.place_agent(agent, cell_pos)
                                self.destinations.append(cell_pos)
                                self.static_map[cell_pos[1]][cell_pos[0]] = {"type": "Destination"}
                            elif cell_type == "Traffic_Light":
                                inherited_directions = self.get_inherited_direction(cell_pos, lines)
                                agent = Traffic_Light(f"tl_{cell_pos}", self, col == "s", int(dataDictionary[col][0]))
                                self.grid.place_agent(agent, cell_pos)
                                self.schedule.add(agent)
                                self.traffic_lights.append((cell_pos, inherited_directions))
                                self.static_map[cell_pos[1]][cell_pos[0]] = {"type": "Traffic_Light", "directions": inherited_directions}
                            elif cell_type == "Obstacle":
                                agent = Obstacle(f"ob_{cell_pos}", self)
                                self.grid.place_agent(agent, cell_pos)
                                self.static_map[cell_pos[1]][cell_pos[0]] = {"type": "Obstacle"}

            self.spawn_cars()

        self.running = True

    def spawn_cars(self):
        directions_map = {
            (0, 0): "Right",
            (self.width - 1, 0): "Left",
            (0, self.height - 1): "Up",
            (self.width - 1, self.height - 1): "Down"
        }

        all_corners_blocked = True

        for spawn_pos in self.spawn_positions:
            cell_contents = self.grid.get_cell_list_contents(spawn_pos)

            if not any(isinstance(agent, (Car, Obstacle)) for agent in cell_contents):
                car = Car(f"car_{self.spawned_agents}", self)
                car.direction = directions_map.get(spawn_pos, "Right")
                self.grid.place_agent(car, spawn_pos)
                self.schedule.add(car)
                if self.destinations:
                    car.destination = random.choice(self.destinations)
                self.spawned_agents += 1
                all_corners_blocked = False

        if all_corners_blocked:
            self.running = False

    def get_neighbors(self, pos, directions, dataDictionary, lines, cell_type):
        direction_map = {
            "Right": (1, 0),
            "Left": (-1, 0),
            "Up": (0, 1),
            "Down": (0, -1)
        }

        x, y = pos
        neighbors = []

        for direction in directions:
            current = (x, y)
            while True:
                dx, dy = direction_map.get(direction, (0, 0))
                next_pos = (current[0] + dx, current[1] + dy)

                if not (0 <= next_pos[0] < self.width and 0 <= next_pos[1] < self.height):
                    break

                neighbor_cell = lines[self.height - next_pos[1] - 1][next_pos[0]]

                if neighbor_cell == "#":
                    break

                if neighbor_cell in ["S", "s"]:
                    neighbors.append(next_pos)
                    break

                if neighbor_cell in dataDictionary:
                    neighbors.append(next_pos)
                    break

        return neighbors

    def get_inherited_direction(self, pos, lines):
        direction_inheritance = {
            "v": "Up",
            "^": "Down",
            ">": "Left",
            "<": "Right",
            "I": "Up",
            "i": "Down",
            "O": "Left",
            "o": "Right",
            "A": "Up",
            "a": "Down",
            "Z": "Left",
            "z": "Right",
        }

        x, y = pos
        inherited_directions = []

        for dx, dy, direction in [(-1, 0, "Right"), (1, 0, "Left"), (0, -1, "Up"), (0, 1, "Down")]:
            neighbor = (x + dx, y + dy)
            if 0 <= neighbor[0] < self.width and 0 <= neighbor[1] < self.height:
                neighbor_cell = lines[self.height - neighbor[1] - 1][neighbor[0]]
                if neighbor_cell in direction_inheritance:
                    inherited_directions.append(direction_inheritance[neighbor_cell])

        return inherited_directions

    def step(self):
        self.schedule.step()
        self.step_count += 1

        if self.step_count % self.spawn_interval == 0:
            self.spawn_cars()
