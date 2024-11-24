from mesa import Agent
class Car(Agent):
    """
    Agent that moves following the direction of the Road it is currently on, respects traffic lights,
    and evaluates surroundings and upcoming cells.
    """
    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)
        self.map_knowledge = model.static_map  # Copia del mapa estático
        self.previous_direction = None  # Dirección de la celda anterior

    def get_surroundings(self, position):
        """
        Get the contents of the cells around the car (Moore neighborhood).
        """
        neighborhood = self.model.grid.get_neighborhood(
            position,
            moore=True,  # Considera las 8 celdas alrededor
            include_center=False  # Excluye la celda actual
        )
        surroundings = {}
        for cell_pos in neighborhood:
            if 0 <= cell_pos[0] < self.model.width and 0 <= cell_pos[1] < self.model.height:
                cell_contents = self.model.grid.get_cell_list_contents(cell_pos)
                surroundings[cell_pos] = cell_contents
        return surroundings

    def get_next_cells(self, position, direction, steps=3):
        """
        Get the next 'steps' cells in the given direction.
        """
        x, y = position
        cells = []

        for _ in range(steps):
            if direction == "Right":
                x += 1
            elif direction == "Left":
                x -= 1
            elif direction == "Up":
                y += 1
            elif direction == "Down":
                y -= 1

            # Verificar si está dentro de los límites del mapa
            if 0 <= x < self.model.width and 0 <= y < self.model.height:
                cell_contents = self.model.grid.get_cell_list_contents((x, y))
                cells.append({"position": (x, y), "contents": cell_contents})
            else:
                break  # Salir si está fuera del mapa

        return cells

    def move(self):
        """
        Moves the car strictly following the direction of the Road it is currently on or,
        if on a Traffic Light, follows the direction of the previous Road.
        """
        # Obtener la posición actual
        x, y = self.pos
        current_cell = self.map_knowledge[y][x]

        # Verificar si la celda actual es un semáforo
        current_cell_contents = self.model.grid.get_cell_list_contents(self.pos)
        traffic_light = next((agent for agent in current_cell_contents if isinstance(agent, Traffic_Light)), None)

        # Si está en un semáforo, usar la dirección previa para decidir el siguiente movimiento
        if traffic_light:
            if not self.previous_direction:
                return  # Si no hay dirección previa, no avanzar
            current_direction = self.previous_direction
        else:
            # Si no está en un semáforo, tomar la dirección de la celda actual
            if not current_cell or current_cell["type"] != "Road":
                return  # No hacer nada si no está en una calle
            current_direction = current_cell["direction"]
            self.previous_direction = current_direction  # Actualizar la dirección anterior

        # Obtener las celdas alrededor del coche
        surroundings = self.get_surroundings(self.pos)
        print(f"Alrededor de {self.pos}: {[(pos, [type(a).__name__ for a in agents]) for pos, agents in surroundings.items()]}")

        # Inspeccionar las próximas celdas en la dirección actual
        next_cells = self.get_next_cells((x, y), current_direction, steps=3)
        print(f"Próximas celdas en dirección {current_direction}: {[(cell['position'], [type(a).__name__ for a in cell['contents']]) for cell in next_cells]}")

        # Calcular la posición candidata basada en la dirección actual
        next_position = None
        if current_direction == "Right":
            next_position = (x + 1, y)
        elif current_direction == "Left":
            next_position = (x - 1, y)
        elif current_direction == "Up":
            next_position = (x, y + 1)
        elif current_direction == "Down":
            next_position = (x, y - 1)

        # Verificar si la nueva posición es válida y está dentro de los límites
        if next_position:
            nx, ny = next_position
            if 0 <= nx < self.model.width and 0 <= ny < self.model.height:
                # Obtener contenido de la nueva posición
                cell_contents = self.model.grid.get_cell_list_contents(next_position)

                # Verificar si hay un semáforo en la nueva posición
                next_traffic_light = next((agent for agent in cell_contents if isinstance(agent, Traffic_Light)), None)
                if next_traffic_light and not next_traffic_light.state:  # Semáforo en rojo
                    return  # No moverse si el semáforo está en rojo

                # Verificar si hay un destino en la nueva posición
                if any(isinstance(agent, Destination) for agent in cell_contents):
                    self.model.grid.move_agent(self, next_position)
                    print(f"Coche {self.unique_id} ha alcanzado su destino en {next_position}.")
                    return  # Detenerse al llegar al destino

                # Moverse a la nueva posición si contiene una calle o un semáforo en verde
                if any(isinstance(agent, Road) for agent in cell_contents) or next_traffic_light:
                    self.model.grid.move_agent(self, next_position)

    def step(self):
        """
        Determines the movement of the car for the current step.
        """
        self.move()




class Traffic_Light(Agent):
    """
    Traffic light. Where the traffic lights are in the grid.
    """
    def __init__(self, unique_id, model, state = False, timeToChange = 10):
        super().__init__(unique_id, model)
        """
        Creates a new Traffic light.
        Args:
            unique_id: The agent's ID
            model: Model reference for the agent
            state: Whether the traffic light is green or red
            timeToChange: After how many step should the traffic light change color 
        """
        self.state = state
        self.timeToChange = timeToChange

    def step(self):
        """ 
        To change the state (green or red) of the traffic light in case you consider the time to change of each traffic light.
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
    def __init__(self, unique_id, model, direction= "Left"):
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
