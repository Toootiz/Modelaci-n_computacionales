from mesa import Agent
from collections import deque

from mesa import Agent
from collections import deque

class Car(Agent):
    def __init__(self, unique_id, model, verbose=False):
        super().__init__(unique_id, model)
        self.map_knowledge = model.static_map
        self.destination = None
        self.path = []
        self.steps_waited = 0
        self.previous_positions = deque(maxlen=5)
        self.direction = None
        self.inactive_steps = 0
        self.blocked_node = None
        self.verbose = verbose

    def log(self, message):
        if self.verbose:
            print(f"[Car {self.unique_id}] {message}")

    def bfs_find_shortest_path(self, start, destination, avoid_node=None):
        visited = set()
        queue = deque([(start, [start])])
        neighbors_cache = self.model.graph

        while queue:
            current_node, path = queue.popleft()

            if current_node == destination:
                return path

            visited.add(current_node)

            for neighbor in neighbors_cache.get(current_node, []):
                if neighbor not in visited and neighbor != avoid_node:
                    visited.add(neighbor)
                    queue.append((neighbor, path + [neighbor]))
        return None

    def calculate_path(self, avoid_node=None):
        if not self.destination:
            return
        self.path = self.bfs_find_shortest_path(self.pos, self.destination, avoid_node)

    def update_direction(self, current_pos, next_pos):
        direction_map = {
            (1, 0): "Right",
            (-1, 0): "Left",
            (0, 1): "Up",
            (0, -1): "Down",
        }
        dx, dy = next_pos[0] - current_pos[0], next_pos[1] - current_pos[1]
        self.direction = direction_map.get((dx, dy))

    def is_node_blocked(self, node):
        cell_contents = self.model.grid.get_cell_list_contents(node)
        traffic_light = next((agent for agent in cell_contents if isinstance(agent, Traffic_Light)), None)
        if traffic_light and not traffic_light.state:
            return True
        if any(isinstance(agent, Car) for agent in cell_contents):
            return True
        return False

    def attempt_lane_change(self, next_node):
        lateral_moves = [
            (next_node[0] + 1, next_node[1]),
            (next_node[0] - 1, next_node[1]),
            (next_node[0], next_node[1] + 1),
            (next_node[0], next_node[1] - 1),
        ]

        for lateral in lateral_moves:
            if 0 <= lateral[0] < self.model.width and 0 <= lateral[1] < self.model.height:
                lateral_contents = self.model.grid.get_cell_list_contents(lateral)
                if not any(isinstance(agent, (Car, Obstacle, Destination, Traffic_Light)) for agent in lateral_contents):
                    self.model.grid.move_agent(self, lateral)
                    self.calculate_path()
                    return True
        return False

    def move(self):
        if self.pos == self.destination:
            self.model.grid.remove_agent(self)
            self.model.schedule.remove(self)
            return

        if not self.path or len(self.path) <= 1:
            self.calculate_path()
            if not self.path or len(self.path) <= 1:
                return

        next_node = self.path[1]

        if self.is_node_blocked(next_node):
            self.inactive_steps += 1

            if self.inactive_steps >= 1 and self.attempt_lane_change(next_node):
                return

            if self.inactive_steps >= 50:
                self.blocked_node = next_node
                self.calculate_path(avoid_node=self.blocked_node)
                self.inactive_steps = 0
            return

        self.inactive_steps = 0
        self.update_direction(self.pos, next_node)
        self.model.grid.move_agent(self, next_node)
        self.pos = next_node
        self.path.pop(0)

    def step(self):
        self.move()



class Traffic_Light(Agent):
    def __init__(self, unique_id, model, state=False, timeToChange=10):
        super().__init__(unique_id, model)
        self.state = state
        self.timeToChange = timeToChange

    def step(self):
        if self.model.schedule.steps % self.timeToChange == 0:
            self.state = not self.state


class Destination(Agent):
    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)

    def step(self):
        pass


class Obstacle(Agent):
    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)

    def step(self):
        pass


class Road(Agent):
    def __init__(self, unique_id, model, direction="Left"):
        super().__init__(unique_id, model)
        self.direction = direction

    def step(self):
        pass


class Zepeling(Agent):
    pass
