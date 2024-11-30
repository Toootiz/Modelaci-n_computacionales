
# Gabriel Muñoz Luna A01028774
# 24/11/2024
# File with the agents for the city simulation
# This file contains the agents for the city simulation, such as cars, traffic lights, and obstacles.

from mesa import Agent
from collections import deque


class Car(Agent):
    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)
        self.map_knowledge = model.static_map
        self.destination = None
        self.path = []
        self.steps_waited = 0  # Contador de pasos esperando
        self.previous_positions = deque(
            maxlen=5
        )  # Últimas posiciones visitadas para evitar retrocesos
        self.direction = None
        self.inactive_steps = 0  # Contador de pasos inactivos
        self.blocked_node = None  # Nodo que se debe evitar

    def bfs_find_shortest_path(self, start, destination, avoid_node=None):
        """
        Realiza BFS para encontrar la ruta más corta desde el inicio hasta el destino en el grafo.
        Permite evitar un nodo específico si está definido.
        """
        visited = set()
        queue = deque()
        queue.append((start, [start]))

        while queue:
            current_node, path = queue.popleft()

            if current_node == destination:
                return path

            visited.add(current_node)

            neighbors = self.model.graph.get(current_node, [])
            for neighbor in neighbors:
                if neighbor not in visited and neighbor != avoid_node:
                    visited.add(neighbor)
                    queue.append((neighbor, path + [neighbor]))

        return None

    def calculate_path(self, avoid_node=None):
        """
        Calcula la rut
        a más corta al destino usando BFS.
        Si avoid_node está definido, evita ese nodo durante el cálculo.
        """
        if not self.destination:
            print(f"Coche {self.unique_id} no tiene destino asignado.")
            return

        start = self.pos
        destination = self.destination
        print(
            f"Coche {self.unique_id} buscando la ruta más corta de {start} a {destination}, evitando {avoid_node}."
        )

        self.path = self.bfs_find_shortest_path(start, destination, avoid_node)

        if self.path:
            print(f"Coche {self.unique_id} calculó la ruta más corta: {self.path}")
        else:
            print(f"Coche {self.unique_id} no encontró un camino a {destination}.")

    def update_direction(self, current_pos, next_pos):
        """
        Actualiza la dirección del coche basado en el movimiento realizado.
        """
        if next_pos[0] > current_pos[0]:
            self.direction = "Right"
        elif next_pos[0] < current_pos[0]:
            self.direction = "Left"
        elif next_pos[1] > current_pos[1]:
            self.direction = "Up"
        elif next_pos[1] < current_pos[1]:
            self.direction = "Down"
        print(f"Coche {self.unique_id} cambió dirección a {self.direction}.")

    def move(self):
        """
        Mueve el coche según su ruta calculada.
        Si está bloqueado por 2 pasos consecutivos, intenta cambiar de carril.
        Si está bloqueado por 10 pasos, recalcula una ruta alternativa evitando el nodo bloqueado.
        """
        if self.pos == self.destination:
            print(f"Coche {self.unique_id} ha llegado a su destino en {self.pos}.")

            # Incrementar el contador de coches que llegaron a su destino en el modelo
            self.model.agents_reached_destination += 1

            self.model.grid.remove_agent(self)
            self.model.schedule.remove(self)
            return

        if not self.path or len(self.path) <= 1:
            self.calculate_path()
            if not self.path or len(self.path) <= 1:
                print(
                    f"Coche {self.unique_id} no tiene una ruta válida o ya está en el destino."
                )
                return

        next_node = self.path[1]
        cell_contents = self.model.grid.get_cell_list_contents(next_node)
        print(
            f"Coche {self.unique_id}: nodo {next_node} contiene {[type(agent).__name__ for agent in cell_contents]}"
        )

        other_car = next(
            (agent for agent in cell_contents if isinstance(agent, Car)), None
        )
        if other_car:
            print(
                f"Coche {self.unique_id} detectó un coche bloqueando el nodo {next_node}. Evaluando cambio de carril."
            )
            self.inactive_steps += 8

            # Intentar cambio de carril tras 2 pasos bloqueados
            if self.inactive_steps >= 1:
                print(
                    f"Coche {self.unique_id} bloqueado por {self.inactive_steps} pasos. Buscando cambio de carril."
                )
                next_x, next_y = next_node
                lateral_moves = [
                    (next_x, next_y + 1),  # Arriba
                    (next_x, next_y - 1),  # Abajo
                    (next_x + 1, next_y),  # Derecha
                    (next_x - 1, next_y),  # Izquierda
                ]

                for lateral in lateral_moves:
                    if (
                        0 <= lateral[0] < self.model.width
                        and 0 <= lateral[1] < self.model.height
                    ):
                        lateral_contents = self.model.grid.get_cell_list_contents(
                            lateral
                        )
                        if not any(
                            isinstance(
                                agent, (Car, Obstacle, Destination, Traffic_Light)
                            )
                            for agent in lateral_contents
                        ):
                            lateral_directions = self.model.static_map[lateral[1]][
                                lateral[0]
                            ].get("directions", [])
                            if self.direction in lateral_directions:
                                print(
                                    f"Coche {self.unique_id} cambia al carril {lateral}."
                                )
                                self.model.grid.move_agent(self, lateral)
                                self.calculate_path()
                                return
                            else:
                                print(
                                    f"Coche {self.unique_id} no puede cambiar al carril {lateral} porque no tiene la misma dirección."
                                )

            # Recalcular ruta alternativa tras 10 pasos bloqueados
            if self.inactive_steps >= 10:
                print(
                    f"Coche {self.unique_id} bloqueado por 10 pasos. Recalculando ruta alternativa evitando {next_node}."
                )
                self.blocked_node = next_node
                self.calculate_path(avoid_node=self.blocked_node)
                self.inactive_steps = 0  # Reiniciar contador tras recalcular
            return

        # Resetear pasos inactivos si puede moverse
        self.inactive_steps = 0
        traffic_light = next(
            (agent for agent in cell_contents if isinstance(agent, Traffic_Light)), None
        )
        if traffic_light and not traffic_light.state:
            print(
                f"Coche {self.unique_id} se detuvo frente al semáforo en el nodo {next_node}."
            )
            return

        print(f"Coche {self.unique_id} avanzando de {self.pos} al nodo {next_node}.")
        self.update_direction(self.pos, next_node)
        self.model.grid.move_agent(self, next_node)
        self.pos = next_node
        self.path.pop(0)

    def step(self):
        """
        Determina el movimiento del coche en el paso actual.
        """
        self.move()


class Traffic_Light(Agent):
    """
    Traffic light. Where the traffic lights are in the grid.
    """

    def __init__(self, unique_id, model, state=False, timeToChange=10):
        super().__init__(unique_id, model)
        """
        Creates a new Traffic light.
        Args:
            unique_id: The agent's ID
            model: Model reference for the agent
            state: Whether the traffic light is green or red
            timeToChange: After how many steps the traffic light changes color 
        """
        self.state = state
        self.timeToChange = timeToChange

    def step(self):
        """
        Change the state (green or red) of the traffic light based on the time to change.
        """
        if self.model.schedule.steps % self.timeToChange == 0:
            self.state = not self.state


class Destination(Agent):
    """
    Destination agent. Where each car should go.
    """

    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)

    def step(self):
        pass


class Obstacle(Agent):
    """
    Obstacle agent. Just to add obstacles to the grid.
    """

    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)

    def step(self):
        pass


class Road(Agent):
    """
    Road agent. Determines where the cars can move, and in which direction.
    """

    def __init__(self, unique_id, model, direction="Left"):
        """
        Creates a new road.
        Args:
            unique_id: The agent's ID
            model: Model reference for the agent
            direction: Direction where the cars can move
        """
        super().__init__(unique_id, model)
        self.direction = direction

    def step(self):
        pass


