from mesa import Model, agent
from mesa.time import RandomActivation
from mesa.space import MultiGrid
from .agent import *
import json
import random


class CityModel(Model):
    """
    Creates a model based on a city map.
    """
    def __init__(self):
        # Cargar el diccionario de datos del mapa
        dataDictionary = json.load(open("city_files/mapDictionary.json"))

        self.traffic_lights = []
        self.destinations = []  # Lista para almacenar las posiciones de los destinos
        self.graph = {}  # Grafo como lista de adyacencia

        # Variables para el control de generación de agentes
        self.spawned_agents = 0  # Contador de agentes generados
        self.spawn_interval = 2  # Intervalo de pasos para generar agentes
        self.step_count = 0  # Contador de pasos

        # Leer el archivo del mapa
        with open('city_files/2024_base.txt') as baseFile:
            lines = baseFile.readlines()
            self.width = len(lines[0]) - 1
            self.height = len(lines)

            self.grid = MultiGrid(self.width, self.height, torus=False)
            self.schedule = RandomActivation(self)

            self.static_map = [[None for _ in range(self.width)] for _ in range(self.height)]

            # Posiciones de las cuatro esquinas
            self.spawn_positions = [
                (0, 0),  # Esquina inferior izquierda
                (self.width - 1, 0),  # Esquina inferior derecha
                (0, self.height - 1),  # Esquina superior izquierda
                (self.width - 1, self.height - 1)  # Esquina superior derecha
            ]

            # Crear agentes y generar el grafo
            for r, row in enumerate(lines):
                for c, col in enumerate(row):
                    cell_pos = (c, self.height - r - 1)  # Ajustar posición según Mesa
                    if col in dataDictionary:  # Verificar que la celda está en el diccionario
                        # Direcciones específicas de cada celda
                        directions = dataDictionary[col] if isinstance(dataDictionary[col], list) else [dataDictionary[col]]

                        # Inicializar nodo en el grafo con vecinos calculados
                        self.graph[cell_pos] = self.get_neighbors(cell_pos, directions, dataDictionary, lines, col)

                        # Asignar agentes a las celdas según su tipo
                        if col in ["V", "v", "^", ">", "<", "I", "i", "O", "o", "A", "a", "Z", "z"]:
                            agent = Road(f"r_{r*self.width+c}", self, directions)
                            self.grid.place_agent(agent, cell_pos)
                            self.static_map[cell_pos[1]][cell_pos[0]] = {"type": "Road", "directions": directions}
                        elif col == "D":
                            agent = Destination(f"d_{r*self.width+c}", self)
                            self.grid.place_agent(agent, cell_pos)
                            self.destinations.append(cell_pos)  # Agregar posición del destino
                            self.static_map[cell_pos[1]][cell_pos[0]] = {"type": "Destination"}
                        elif col in ["S", "s"]:
                            # Asignar dirección heredada al semáforo
                            inherited_directions = self.get_inherited_direction(cell_pos, lines, dataDictionary)
                            agent = Traffic_Light(f"tl_{r*self.width+c}", self, False if col == "S" else True, int(dataDictionary[col][0]))
                            self.grid.place_agent(agent, cell_pos)
                            self.schedule.add(agent)
                            self.traffic_lights.append((cell_pos, inherited_directions))
                            self.static_map[cell_pos[1]][cell_pos[0]] = {"type": "Traffic_Light", "directions": inherited_directions}
                        elif col == "#":
                            agent = Obstacle(f"ob_{r*self.width+c}", self)
                            self.grid.place_agent(agent, cell_pos)
                            self.static_map[cell_pos[1]][cell_pos[0]] = {"type": "Obstacle"}

            # Crear los primeros 4 coches en las esquinas
            self.spawn_cars()

        self.running = True

    def spawn_cars(self):
        """
        Generar coches en las cuatro esquinas.
        Detener la simulación si las cuatro esquinas están bloqueadas.
        """
        all_corners_blocked = True  # Bandera para verificar si todas las esquinas están bloqueadas

        for spawn_pos in self.spawn_positions:
            cell_contents = self.grid.get_cell_list_contents(spawn_pos)

            # Verificar si la celda está ocupada
            if not any(isinstance(agent, (Car, Obstacle)) for agent in cell_contents):
                # Crear y asignar el coche si la celda está libre
                car = Car(f"car_{self.spawned_agents}", self)
                if spawn_pos == (0, 0):
                    car.direction = "Right"
                elif spawn_pos == (self.width - 1, 0):
                    car.direction = "Up"
                elif spawn_pos == (0, self.height - 1):
                    car.direction = "Down"
                elif spawn_pos == (self.width - 1, self.height - 1):
                    car.direction = "Left"

                self.grid.place_agent(car, spawn_pos)
                self.schedule.add(car)
                if self.destinations:
                    car.destination = random.choice(self.destinations)  # Asignar un destino aleatorio
                self.spawned_agents += 1
                all_corners_blocked = False  # Al menos una esquina permitió generar un coche

        # Detener la simulación si no se pudo generar un coche en ninguna esquina
        if all_corners_blocked:
            self.running = False

    def get_neighbors(self, pos, directions, dataDictionary, lines, cell_type):
        """
        Obtiene las celdas vecinas según las direcciones permitidas.
        Los semáforos heredan la dirección del nodo previo y se conectan correctamente al siguiente nodo.
        """
        x, y = pos
        neighbors = []

        for direction in directions:
            current = (x, y)
            while True:
                if direction == "Right":
                    next_pos = (current[0] + 1, current[1])
                elif direction == "Left":
                    next_pos = (current[0] - 1, current[1])
                elif direction == "Up":
                    next_pos = (current[0], current[1] + 1)
                elif direction == "Down":
                    next_pos = (current[0], current[1] - 1)
                else:
                    break

                # Verificar límites del mapa
                if not (0 <= next_pos[0] < self.width and 0 <= next_pos[1] < self.height):
                    break

                neighbor_cell = lines[self.height - next_pos[1] - 1][next_pos[0]]

                # Si es un obstáculo, detener
                if neighbor_cell == "#":
                    break

                # Si es un semáforo, agregarlo y detener el loop
                if neighbor_cell in ["S", "s"]:
                    neighbors.append(next_pos)  # Conectar solo al semáforo
                    break  # No continuar más allá del semáforo

                # Si es un nodo transitable y no es un semáforo, agregarlo como vecino
                if neighbor_cell in dataDictionary:
                    neighbors.append(next_pos)
                    break

        return neighbors

    def get_inherited_direction(self, pos, lines, dataDictionary):
        """
        Obtiene la dirección heredada para una celda de semáforo.
        """
        x, y = pos
        inherited_directions = []

        # Revisar las celdas adyacentes para heredar la dirección
        for dx, dy, direction in [(-1, 0, "Right"), (1, 0, "Left"), (0, -1, "Up"), (0, 1, "Down")]:
            neighbor = (x + dx, y + dy)
            if 0 <= neighbor[0] < self.width and 0 <= neighbor[1] < self.height:
                neighbor_cell = lines[self.height - neighbor[1] - 1][neighbor[0]]
                if neighbor_cell in ["v", "^", ">", "<", "I", "i", "O", "o", "A", "a", "Z", "z"]:
                    inherited_directions.append(direction)

        return inherited_directions

    def step(self):
        """Avanzar el modelo en un paso."""
        self.schedule.step()
        self.step_count += 1

        # Generar más coches cada intervalo de pasos
        if self.step_count % self.spawn_interval == 0:
            self.spawn_cars()
