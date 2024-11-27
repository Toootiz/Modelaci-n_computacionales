from mesa import Agent
from collections import deque

class Car(Agent):
    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)
        self.map_knowledge = model.static_map  # Copia del mapa estático
        self.destination = None  # Destino del coche
        self.path = []  # Ruta calculada
        self.steps_waited = 0  # Contador de pasos esperando
        self.previous_positions = deque(maxlen=5)  # Últimas posiciones visitadas para evitar retrocesos
        self.direction = None
        

    def bfs_find_shortest_path(self, start, destination):
        """
        Realiza BFS para encontrar la ruta más corta desde el inicio hasta el destino en el grafo.
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
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, path + [neighbor]))

        return None

    def calculate_path(self):
        """
        Calcula la ruta más corta al destino usando BFS.
        """
        if not self.destination:
            print(f"Coche {self.unique_id} no tiene destino asignado.")
            return

        start = self.pos
        destination = self.destination
        print(f"Coche {self.unique_id} buscando la ruta más corta de {start} a {destination} usando BFS.")

        self.path = self.bfs_find_shortest_path(start, destination)

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
        Move the car along the calculated path, respecting the graph's nodes and avoiding collisions.
        If blocked for 3 steps, checks lateral positions for a possible lane change.
        """
        # Verificar si ya llegó al destino
        if self.pos == self.destination:
            print(f"Coche {self.unique_id} ha llegado a su destino en {self.pos}.")
            self.model.grid.remove_agent(self)  # Eliminar el coche del grid
            self.model.schedule.remove(self)  # Eliminar el coche del schedule
            return

        # Si no hay una ruta calculada o está vacía, calcularla
        if not self.path or len(self.path) <= 1:
            self.calculate_path()
            if not self.path or len(self.path) <= 1:  # Si no hay ruta o ya está en el destino, detenerse
                print(f"Coche {self.unique_id} no tiene una ruta válida o ya está en el destino.")
                return

        # Determinar el siguiente nodo en la ruta
        next_node = self.path[1]  # El siguiente nodo es el segundo en la lista (el primero es la posición actual)
        print(f"Coche {self.unique_id} evaluando movimiento al nodo {next_node} desde {self.pos}.")

        # Verificar el contenido del nodo siguiente
        cell_contents = self.model.grid.get_cell_list_contents(next_node)
        print(f"Coche {self.unique_id}: nodo {next_node} contiene {[type(agent).__name__ for agent in cell_contents]}")

        # Verificar si hay un coche en el siguiente nodo
        other_car = next((agent for agent in cell_contents if isinstance(agent, Car)), None)
        if other_car:
            print(f"Coche {self.unique_id} detectó un coche bloqueando el nodo {next_node}. Evaluando cambio de carril.")

            # Incrementar contador de pasos bloqueado
            if not hasattr(self, "blocked_steps"):
                self.blocked_steps = 0  # Inicializar atributo
            self.blocked_steps += 1

            if self.blocked_steps >= 2:  # Bloqueado durante 3 pasos consecutivos
                print(f"Coche {self.unique_id} lleva {self.blocked_steps} pasos bloqueado. Buscando cambio de carril.")
                self.blocked_steps = 0  # Reiniciar el contador tras cambio de carril

                # Determinar vecinos laterales
                next_x, next_y = next_node
                lateral_moves = [
                    (next_x, next_y + 1),  # Arriba
                    (next_x, next_y - 1),  # Abajo
                    (next_x + 1, next_y),  # Derecha
                    (next_x - 1, next_y)   # Izquierda
                ]

                # Validar cada vecino lateral
                for lateral in lateral_moves:
                    if 0 <= lateral[0] < self.model.width and 0 <= lateral[1] < self.model.height:  # Dentro del mapa
                        lateral_contents = self.model.grid.get_cell_list_contents(lateral)
                        if not any(isinstance(agent, (Car, Obstacle, Destination, Traffic_Light)) for agent in lateral_contents):
                            print(f"Coche {self.unique_id} cambia al carril {lateral}.")
                            self.model.grid.move_agent(self, lateral)
                            self.calculate_path()  # Recalcular la ruta desde la nueva posición
                            return

            print(f"Coche {self.unique_id} no pudo cambiar de carril. Se detiene temporalmente.")
            return

        # Si no está bloqueado, reiniciar el contador de pasos bloqueado
        if hasattr(self, "blocked_steps"):
            self.blocked_steps = 0

        # Verificar semáforo en el siguiente nodo
        traffic_light = next((agent for agent in cell_contents if isinstance(agent, Traffic_Light)), None)
        if traffic_light and not traffic_light.state:  # Semáforo en rojo
            print(f"Coche {self.unique_id} se detuvo frente al semáforo en el nodo {next_node}.")
            return

        # Mover al coche al siguiente nodo
        print(f"Coche {self.unique_id} avanzando de {self.pos} al nodo {next_node}.")
        self.update_direction(self.pos, next_node)
        self.model.grid.move_agent(self, next_node)
        self.pos = next_node  # Actualizar la posición actual
        self.path.pop(0)  # Eliminar el nodo visitado de la ruta



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

class Zepeling(Agent):
    pass