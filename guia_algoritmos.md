
# Índice con Enlaces Internos

## Presentación 1 - Introducción a Algoritmos
- [¿Qué es un Algoritmo?](#qué-es-un-algoritmo)
- [Solución Algorítmica](#solución-algorítmica)
- [Eficiencia de Algoritmos](#eficiencia-de-algoritmos)
- [Análisis y Diseño de Algoritmos](#análisis-y-diseño-de-algoritmos)
- [Análisis Formal y Herramientas](#análisis-formal-y-herramientas)
- [Análisis de Algoritmos](#análisis-de-algoritmos)
- [Historia de la Computación](#historia-de-la-computación)
- [Algoritmos Modernos](#algoritmos-modernos)

## Presentación 2 - Complejidad Computacional
- [Introducción a la Complejidad Computacional](#introducción-a-la-complejidad-computacional)
- [Corrección de Algoritmos](#corrección-de-algoritmos)
- [Complejidad de Tiempo y Espacio](#complejidad-de-tiempo-y-espacio)
- [Algoritmos de Fibonacci](#algoritmos-de-fibonacci)
- [Notación Asintótica](#notación-asintótica)
- [Complejidad en el Peor Caso y Caso Promedio](#complejidad-en-el-peor-caso-y-caso-promedio)
- [Clasificación de Funciones por Complejidad](#clasificación-de-funciones-por-complejidad)

## Presentación 3 - Análisis de Algoritmos de Búsqueda y Ordenamiento
- [Búsqueda Secuencial](#búsqueda-secuencial)
- [Búsqueda Binaria](#búsqueda-binaria)
- [Algoritmos de Ordenamiento](#algoritmos-de-ordenamiento)
  - [Selection Sort](#selection-sort)
  - [Bubble Sort](#bubble-sort)
  - [Merge Sort](#merge-sort)
  - [Quick Sort](#quick-sort)

## Presentación 4 - Técnicas de Diseño de Algoritmos
- [Divide y Conquista](#divide-y-conquista)
- [Algoritmos Greedy (Codiciosos)](#algoritmos-greedy-codiciosos)
- [Programación Dinámica](#programación-dinámica)
- [Método Maestro](#método-maestro)

## Presentación 5 - Técnicas de Diseño de Algoritmos: Backtracking y Branch and Bound
- [Backtracking](#backtracking)
- [Branch and Bound](#branch-and-bound)
- [Comparación entre Backtracking y Branch and Bound](#comparación-entre-backtracking-y-branch-and-bound)
- [Ejemplo Práctico: Problema de Asignación](#ejemplo-práctico-problema-de-asignación)

## Presentación 6 - Colas con Prioridad
- [Introducción a las Colas con Prioridad](#introducción-a-las-colas-con-prioridad)
- [Binary Heap](#binary-heap)
- [Operaciones en un Heap](#operaciones-en-un-heap)
  - [Insertar un Elemento](#insertar-un-elemento)
  - [Eliminar el Máximo (o Mínimo)](#eliminar-el-máximo-o-mínimo)
- [Aplicación: Heap Sort](#aplicación-heap-sort)

## Presentación 7 - Algoritmos de Strings
- [Conceptos Básicos de Strings](#conceptos-básicos-de-strings)
- [Z-Function](#z-function)
- [Algoritmo Knuth-Morris-Pratt (KMP)](#algoritmo-knuth-morris-pratt-kmp)
- [Algoritmo de Manacher](#algoritmo-de-manacher)
- [Hashing de Strings](#hashing-de-strings)
- [Arreglo de Sufijos (Suffix Array)](#arreglo-de-sufijos-suffix-array)
- [Trie (Árbol de Prefijos)](#trie-árbol-de-prefijos)

## Presentación 8 - Aplicaciones de Técnicas de Diseño de Algoritmos
- [Longest Common Substring (LCS)](#longest-common-substring-lcs)
- [Longest Common Subsequence (LCS)](#longest-common-subsequence-lcs)
- [Problema de la Mochila (Knapsack Problem)](#problema-de-la-mochila-knapsack-problem)
  - [Sin Repetición](#sin-repetición)
  - [Fraccional](#fraccional)
- [Problema del Camino Más Corto (Shortest Path Problem)](#problema-del-camino-más-corto-shortest-path-problem)
  - [Algoritmo de Dijkstra](#algoritmo-de-dijkstra)

## Presentación 9 - Técnicas de Búsqueda Avanzada
- [Bitmask](#bitmask)
- [Encontrarse en el Medio](#encontrarse-en-el-medio)
- [Búsqueda A*](#búsqueda-a)
- [Búsqueda de Escalada (Hill Climbing)](#búsqueda-de-escalada-hill-climbing)
- [Recocido Simulado (Simulated Annealing)](#recocido-simulado-simulated-annealing)

## Temas Adicionales: Técnicas de Diseño de Algoritmos Avanzadas
- [BST Optimal Problem](#bst-optimal-problem)
- [Graph Coloring (Welsh-Powell)](#graph-coloring-welsh-powell)
- [Maximum Flow in a Flow Network (Dinic)](#maximum-flow-in-a-flow-network-dinic)
- [Matrix Chain Multiplication (Godbole)](#matrix-chain-multiplication-godbole)



# Guía: Presentación 1 - Introducción a Algoritmos

## Temas Principales

### 1. ¿Qué es un Algoritmo?
- **Definición**: Conjunto claramente especificado de instrucciones para resolver un problema o calcular una función.
- **Tipos**:
  - Algoritmo general.
  - Algoritmo computacional: implementable en un programa.

**Ejemplo**:
Resolver el problema de sumar dos números.
```python
def sumar(a, b):
    return a + b
```

---

### 2. Solución Algorítmica
- **Concepto**: Un algoritmo produce la respuesta correcta para cualquier entrada válida, dado tiempo y recursos suficientes.
- **Relación con la Teoría de Computabilidad**:
  - Un problema es algorítmico si puede resolverse con un algoritmo computable.

**Ejemplo**:
Determinar si un número es par.
```python
def es_par(n):
    return n % 2 == 0
```

---

### 3. Eficiencia de Algoritmos
- **Importancia**: Un algoritmo computable no garantiza ser eficiente en términos de tiempo y memoria.
- **Conceptos Clave**:
  - Eficiencia temporal (tiempo de ejecución).
  - Eficiencia espacial (uso de memoria).

**Ejemplo**:
Comparación entre una búsqueda lineal y una búsqueda binaria en listas.
```python
# Búsqueda lineal
def busqueda_lineal(lista, objetivo):
    for elemento in lista:
        if elemento == objetivo:
            return True
    return False
```

---

### 4. Análisis y Diseño de Algoritmos
- **Proceso**:
  1. Diseñar el algoritmo.
  2. Adaptar y aplicar.
  3. Analizar su eficiencia.

- **“Algorithm Toolbox”**:
  - Estudiar algoritmos existentes.
  - Conocer paradigmas de diseño.

**Ejemplo**:
El algoritmo de la suma de prefijos puede ser un ejemplo de diseño eficiente.
```python
def suma_prefijos(lista):
    suma = 0
    resultado = []
    for num in lista:
        suma += num
        resultado.append(suma)
    return resultado
```

---

### 5. Análisis Formal y Herramientas
- **Independiente de Hardware y Software**:
  - Matemáticas discretas: conjuntos, relaciones, logaritmos, sumatorias.
  - Demostraciones matemáticas, como inducción.

**Ejemplo**: Suma de números del 1 al n.
Demostración por inducción de la fórmula:
\(
\sum_{i=1}^{n} i = rac{n(n+1)}{2}
\)

**Caso Base**: \( n = 1 \), la fórmula es correcta.
**Paso Recursivo**: Asumir \( n = k \) y demostrar para \( n = k+1 \).

---

### 6. Análisis de Algoritmos
- **Criterios**:
  - Correctitud: siempre da la solución correcta.
  - Complejidad: tiempo y espacio usados.
  - Simplicidad y claridad.
  - Óptimo: mejor solución posible.

**Ejemplo**:
Comparar dos algoritmos de ordenamiento:
- Bubble Sort (O(n²)).
- Merge Sort (O(n log n)).

---

### 7. Historia de la Computación
- **Componentes**:
  - Hardware: arquitectura y electrónica.
  - Software: sistemas operativos, lenguajes, algoritmos.

**Ejemplo**: Desarrollo del algoritmo Quicksort en los 60s, que popularizó el uso de recursión.

---

### 8. Algoritmos Modernos
- **Aplicaciones**:
  - Inteligencia Artificial.
  - Data Science y Big Data.
  - Robótica: visión y planificación de trayectorias.

**Ejemplo**:
Planificar una trayectoria en un robot autónomo usando el algoritmo A*.

---

### 9. Pregunta Clave
- ¿Se puede hacer mejor? La búsqueda de la mejora es constante en el diseño de algoritmos.

---

### Referencias
- S. Baase y A. Van Gelder, *Algoritmos Computacionales: introducción al análisis y diseño* (3ª edición).




# Guía: Presentación 2 - Complejidad Computacional

## Temas Principales

### 1. Introducción a la Complejidad Computacional
- **Definición**: Estudio de la cantidad de recursos necesarios (como tiempo y memoria) para ejecutar un algoritmo.
- **Ejemplo**: Comparar un algoritmo iterativo y uno recursivo para calcular la sucesión de Fibonacci.

---

### 2. Corrección de Algoritmos
- **Definición**: Se asegura formalmente que un algoritmo cumple con su propósito para cualquier entrada válida.
- **Método**: Uso de lemas y teoremas para verificar relaciones entre entradas y salidas.
- **Ejemplo**:
Demostración por inducción de la fórmula de la suma de números del 1 al \(n\):
\(
\sum_{i=1}^{n} i = rac{n(n+1)}{2}
\)

---

### 3. Complejidad de Tiempo y Espacio
- **Complejidad Temporal**: Número de operaciones básicas realizadas.
- **Complejidad Espacial**: Número de celdas de memoria usadas durante la ejecución.
- **Ejemplo**:
Complejidad temporal de la búsqueda lineal en una lista de \(n\) elementos: \(O(n)\).

**Pseudocódigo**:
```python
def busqueda_lineal(lista, objetivo):
    for elemento in lista:
        if elemento == objetivo:
            return True
    return False
```

---

### 4. Algoritmos de Fibonacci
#### a. Algoritmo Recursivo (Ineficiente)
- **Definición Recursiva**:
\(
fib(n) = fib(n-1) + fib(n-2) 	ext{, para } n > 1
\)
- **Pseudocódigo**:
```python
def fib_rec(n):
    if n <= 1:
        return n
    else:
        return fib_rec(n-1) + fib_rec(n-2)
```
- **Complejidad Temporal**: Exponencial, \(O(2^n)\).

#### b. Algoritmo Iterativo (Eficiente)
- **Pseudocódigo**:
```python
def fib_iter(n):
    fib = [0, 1]
    for i in range(2, n+1):
        fib.append(fib[i-1] + fib[i-2])
    return fib[n]
```
- **Complejidad Temporal**: Lineal, \(O(n)\).

---

### 5. Notación Asintótica
- **Conceptos Clave**:
  - \(O(g)\): Cota superior asintótica (Big-O).
  - \(\Omega(g)\): Cota inferior asintótica (Big-Omega).
  - \(\Theta(g)\): Orden asintótico exacto (Big-Theta).
- **Ejemplo**:
Para \(f(n) = 3n^2 + 5n + 2\):
  - \(f(n) \in O(n^2)\): \(f(n)\) crece a lo sumo como \(n^2\) para valores grandes de \(n\).

---

### 6. Complejidad en el Peor Caso y Caso Promedio
- **Definiciones**:
  - **Peor Caso**: Máximo número de operaciones necesarias.
  - **Caso Promedio**: Promedio ponderado por la probabilidad de cada entrada.
- **Ejemplo**:
  - Búsqueda en una lista desordenada:
    - Peor Caso: \(O(n)\) (el objetivo está al final o no está).
    - Caso Promedio: Aproximadamente \(O(n/2)\).

---

### 7. Clasificación de Funciones por Complejidad
- **Tasas de Crecimiento**:
  - Constante: \(O(1)\).
  - Logarítmica: \(O(\log n)\).
  - Lineal: \(O(n)\).
  - Cuadrática: \(O(n^2)\).
  - Exponencial: \(O(2^n)\).
- **Gráfico**:
El orden de crecimiento de \(O(1) < O(\log n) < O(n) < O(n^2) < O(2^n)\) muestra la escalabilidad de los algoritmos.

---

### 8. Reglas para Notación Big-O
- Los múltiplos constantes se ignoran.
- Los términos más pequeños se omiten.
- Ejemplo:
  - \(3n^2 + 5n + 2 \in O(n^2)\).

---

### Referencias
- S. Baase y A. Van Gelder, *Algoritmos Computacionales: introducción al análisis y diseño* (3ª edición).




# Guía: Presentación 3 - Análisis de Algoritmos de Búsqueda y Ordenamiento

## Temas Principales

### 1. Búsqueda Secuencial
- **Definición**: Busca un elemento recorriendo cada posición del arreglo.
- **Ventajas**: Funciona con cualquier arreglo.
- **Complejidad Temporal**: \(O(n)\) en el peor caso.
- **Pseudocódigo**:
```python
def busqueda_secuencial(arreglo, clave):
    for i in range(len(arreglo)):
        if arreglo[i] == clave:
            return i  # Regresa la posición
    return -1  # No encontrado
```

---

### 2. Búsqueda Binaria
- **Definición**: Divide el arreglo en mitades y busca la clave en la mitad correspondiente.
- **Condición**: El arreglo debe estar ordenado.
- **Complejidad Temporal**: \(O(\log n)\).
- **Pseudocódigo**:
```python
def busqueda_binaria(arreglo, clave, inicio, fin):
    if inicio > fin:
        return -1  # No encontrado
    medio = (inicio + fin) // 2
    if arreglo[medio] == clave:
        return medio
    elif arreglo[medio] > clave:
        return busqueda_binaria(arreglo, clave, inicio, medio - 1)
    else:
        return busqueda_binaria(arreglo, clave, medio + 1, fin)
```

---

### 3. Algoritmos de Ordenamiento
#### a. Selection Sort
- **Definición**: Encuentra el menor elemento y lo coloca al inicio, repitiendo el proceso.
- **Complejidad Temporal**: \(O(n^2)\).
- **Pseudocódigo**:
```python
def selection_sort(arreglo):
    for i in range(len(arreglo)):
        min_idx = i
        for j in range(i + 1, len(arreglo)):
            if arreglo[j] < arreglo[min_idx]:
                min_idx = j
        arreglo[i], arreglo[min_idx] = arreglo[min_idx], arreglo[i]
```

#### b. Bubble Sort
- **Definición**: Recorre el arreglo y “burbujea” el elemento más grande hacia el final.
- **Complejidad Temporal**: \(O(n^2)\).
- **Pseudocódigo**:
```python
def bubble_sort(arreglo):
    for i in range(len(arreglo)):
        for j in range(0, len(arreglo) - i - 1):
            if arreglo[j] > arreglo[j + 1]:
                arreglo[j], arreglo[j + 1] = arreglo[j + 1], arreglo[j]
```

#### c. Merge Sort
- **Definición**: Divide el arreglo en partes, las ordena recursivamente y las combina.
- **Complejidad Temporal**: \(O(n \log n)\).
- **Pseudocódigo**:
```python
def merge_sort(arreglo):
    if len(arreglo) > 1:
        medio = len(arreglo) // 2
        izquierda = arreglo[:medio]
        derecha = arreglo[medio:]
        merge_sort(izquierda)
        merge_sort(derecha)

        i = j = k = 0
        while i < len(izquierda) and j < len(derecha):
            if izquierda[i] < derecha[j]:
                arreglo[k] = izquierda[i]
                i += 1
            else:
                arreglo[k] = derecha[j]
                j += 1
            k += 1
        while i < len(izquierda):
            arreglo[k] = izquierda[i]
            i += 1
            k += 1
        while j < len(derecha):
            arreglo[k] = derecha[j]
            j += 1
            k += 1
```

#### d. Quick Sort
- **Definición**: Elige un pivote, separa los elementos menores y mayores, y los ordena recursivamente.
- **Complejidad Temporal**: \(O(n \log n)\) en promedio, \(O(n^2)\) en el peor caso.
- **Pseudocódigo**:
```python
def quick_sort(arreglo):
    if len(arreglo) <= 1:
        return arreglo
    pivote = arreglo[len(arreglo) // 2]
    menores = [x for x in arreglo if x < pivote]
    iguales = [x for x in arreglo if x == pivote]
    mayores = [x for x in arreglo if x > pivote]
    return quick_sort(menores) + iguales + quick_sort(mayores)
```

---

### Referencias
- S. Baase y A. Van Gelder, *Algoritmos Computacionales: introducción al análisis y diseño* (3ª edición).



# Guía: Presentación 4 - Técnicas de Diseño de Algoritmos: Divide y Conquista, Greedy y Programación Dinámica

## Temas Principales

### 1. Divide y Conquista
- **Definición**: Divide el problema en subproblemas más pequeños, resuélvelos recursivamente y combina sus soluciones.
- **Ejemplo**: Merge Sort.
- **Ecuación de Recurrencia**: \( T(n) = aT(n/b) + f(n) \), donde \(a\) es el número de subproblemas y \(b\) es el factor de reducción.
- **Pseudocódigo para Merge Sort**:
```python
def merge_sort(array):
    if len(array) > 1:
        mid = len(array) // 2
        left = array[:mid]
        right = array[mid:]
        merge_sort(left)
        merge_sort(right)
        i = j = k = 0
        while i < len(left) and j < len(right):
            if left[i] < right[j]:
                array[k] = left[i]
                i += 1
            else:
                array[k] = right[j]
                j += 1
            k += 1
        while i < len(left):
            array[k] = left[i]
            i += 1
            k += 1
        while j < len(right):
            array[k] = right[j]
            j += 1
            k += 1
```

---

### 2. Algoritmos Greedy (Codiciosos)
- **Definición**: Selecciona en cada paso la opción que parece ser la mejor en ese momento.
- **Ventajas**: Simplicidad y eficiencia en problemas específicos.
- **Desventajas**: No garantiza siempre una solución óptima.
- **Ejemplo**: Problema de la Mochila Fraccional.
- **Pseudocódigo**:
```python
def mochila_fraccional(capacidad, objetos):
    objetos.sort(key=lambda x: x.valor / x.peso, reverse=True)
    valor_total = 0
    for objeto in objetos:
        if capacidad >= objeto.peso:
            capacidad -= objeto.peso
            valor_total += objeto.valor
        else:
            valor_total += (capacidad / objeto.peso) * objeto.valor
            break
    return valor_total
```

---

### 3. Programación Dinámica
- **Definición**: Resuelve problemas dividiéndolos en subproblemas y almacenando sus soluciones para evitar cálculos repetitivos.
- **Concepto Clave**: Memoization.
- **Ejemplo**: Problema del cambio de monedas.
- **Relación Recursiva**: \( 	ext{MinCoins}(n) = \min(	ext{MinCoins}(n - c_i) + 1) \) para todas las denominaciones \(c_i\).
- **Pseudocódigo para Programación Dinámica**:
```python
def cambio_monedas(monedas, cantidad):
    dp = [float('inf')] * (cantidad + 1)
    dp[0] = 0
    for i in range(1, cantidad + 1):
        for moneda in monedas:
            if i - moneda >= 0:
                dp[i] = min(dp[i], dp[i - moneda] + 1)
    return dp[cantidad]
```

---

### 4. Método Maestro
- **Definición**: Herramienta para resolver ecuaciones de recurrencia del tipo \( T(n) = aT(n/b) + f(n) \).
- **Casos**:
  1. \( f(n) \in O(n^{\log_b{a} - \epsilon}) \): \( T(n) \in \Theta(n^{\log_b{a}}) \).
  2. \( f(n) \in \Theta(n^{\log_b{a}} \log^k{n}) \): \( T(n) \in \Theta(n^{\log_b{a}} \log^{k+1}{n}) \).
  3. \( f(n) \in \Omega(n^{\log_b{a} + \epsilon}) \): \( T(n) \in \Theta(f(n)) \).
- **Ejemplo**:
Para \( T(n) = 2T(n/2) + n \):
  - \( a = 2, b = 2, f(n) = n \).
  - \( \log_b{a} = 1 \), por lo tanto \( T(n) \in \Theta(n \log n) \).

---

### Referencias
- S. Baase y A. Van Gelder, *Algoritmos Computacionales: introducción al análisis y diseño* (3ª edición).



# Guía: Presentación 5 - Técnicas de Diseño de Algoritmos: Backtracking y Branch and Bound

## Temas Principales

### 1. Backtracking
- **Definición**: Técnica que explora soluciones paso a paso, deshaciendo pasos (backtracking) cuando no son prometedores.
- **Ejemplo**: Problema de las N-Reinas (colocar N reinas en un tablero sin que se ataquen).
- **Pseudocódigo para Backtracking**:
```python
def backtracking(nodo):
    if not es_promisorio(nodo):
        return  # Regresar
    if es_solucion(nodo):
        imprimir(nodo)
        return
    for hijo in hijos(nodo):
        backtracking(hijo)
```
- **Ejemplo Práctico**: Problema de las 4-Reinas.
  - Colocar 4 reinas en un tablero de ajedrez 4x4 sin que se ataquen.

---

### 2. Branch and Bound (B&B)
- **Definición**: Técnica para resolver problemas de optimización combinatoria.
- **Diferencias con Backtracking**:
  - Genera todos los hijos de un nodo y elige el más prometedor basado en límites.
  - Utiliza poda para descartar ramas no prometedoras.
- **Ejemplo**: Problema de Asignación (asignar trabajos a trabajadores minimizando el costo total).
- **Pseudocódigo para B&B**:
```python
def branch_and_bound(frontera):
    nodo = mejor_nodo(frontera)
    if not es_promisorio(nodo):
        return
    if es_solucion(nodo):
        if es_factible(nodo) and limite(nodo) < MEJOR:
            MEJOR = limite(nodo)
            SOLUCION = nodo
        return
    for hijo in hijos(nodo):
        agregar_a_frontera(hijo)
    if frontera:
        branch_and_bound(frontera)
```

---

### 3. Comparación entre Backtracking y Branch and Bound
- **Backtracking**:
  - Explora nodos secuencialmente (DFS).
  - Poda solo nodos no prometedores.
- **Branch and Bound**:
  - Genera todos los hijos de un nodo.
  - Poda ramas basándose en límites óptimos.

---

### 4. Ejemplo Práctico: Problema de Asignación
- **Problema**: Asignar trabajos a trabajadores minimizando el costo total.
- **Solución usando B&B**:
  1. Relajar el problema para calcular el límite del nodo raíz.
  2. Explorar los nodos vivos y actualizar la mejor solución.

---

### Referencias
- L. González, V. de la Cueva y O. Pérez. *Algoritmos: Análisis, Diseño e Implementación*. Editorial Digital del Tecnológico de Monterrey (2021).



# Guía: Presentación 6 - Colas con Prioridad

## Temas Principales

### 1. Introducción a las Colas con Prioridad
- **Definición**: Estructura de datos donde los elementos con mayor prioridad son atendidos antes, incluso si llegaron después.
- **Implementación**: La forma más eficiente es usando un Binary Heap (Max-Heap o Min-Heap).
- **Operaciones básicas**:
  1. Insertar un nuevo elemento.
  2. Eliminar el elemento con mayor (o menor) prioridad.

---

### 2. Binary Heap
- **Definición**: Árbol binario casi completo que cumple las siguientes propiedades:
  - El valor de cada nodo es mayor (Max-Heap) o menor (Min-Heap) que sus hijos.
  - La raíz contiene el valor máximo (Max-Heap) o mínimo (Min-Heap).
- **Propiedad**: La altura de un heap con \(n\) nodos es \(O(\log n)\).

---

### 3. Operaciones en un Heap
#### a. Insertar un Elemento
- **Proceso**:
  1. Añadir el elemento al final del árbol (arreglo).
  2. Aplicar "swim" para restaurar el orden del heap.
- **Pseudocódigo**:
```python
def insert(heap, elemento):
    heap.append(elemento)  # Agregar al final
    swim(heap, len(heap) - 1)

def swim(heap, k):
    while k > 0 and heap[(k - 1) // 2] < heap[k]:
        heap[(k - 1) // 2], heap[k] = heap[k], heap[(k - 1) // 2]
        k = (k - 1) // 2
```

#### b. Eliminar el Máximo (o Mínimo)
- **Proceso**:
  1. Intercambiar la raíz con el último elemento.
  2. Eliminar el último elemento.
  3. Aplicar "sink" para restaurar el orden del heap.
- **Pseudocódigo**:
```python
def remove_max(heap):
    max_element = heap[0]
    heap[0] = heap[-1]
    heap.pop()
    sink(heap, 0)
    return max_element

def sink(heap, k):
    while 2 * k + 1 < len(heap):
        j = 2 * k + 1
        if j + 1 < len(heap) and heap[j] < heap[j + 1]:
            j += 1
        if heap[k] >= heap[j]:
            break
        heap[k], heap[j] = heap[j], heap[k]
        k = j
```

---

### 4. Aplicación: Heap Sort
- **Proceso**:
  1. Construir un heap con los elementos del arreglo.
  2. Extraer los elementos en orden decreciente.
- **Complejidad**: \(O(n \log n)\).
- **Pseudocódigo**:
```python
def heap_sort(array):
    heap = []
    for elemento in array:
        insert(heap, elemento)
    sorted_array = []
    while heap:
        sorted_array.append(remove_max(heap))
    return sorted_array[::-1]
```

---

### 5. Implementación en C++
- La biblioteca estándar (STL) incluye una estructura de Max-Heap llamada `std::priority_queue`.
- **Ejemplo**:
```cpp
#include <queue>
#include <vector>
#include <functional>

int main() {
    std::priority_queue<int, std::vector<int>, std::greater<int>> min_heap;
    min_heap.push(5);
    min_heap.push(3);
    min_heap.push(8);
    while (!min_heap.empty()) {
        std::cout << min_heap.top() << " ";
        min_heap.pop();
    }
    return 0;
}
```

---

### Referencias
- R. Sedgewick and K. Wayne. *Algorithms*. 4th ed, Addison-Wesley (2011).



# Guía: Presentación 7 - Algoritmos de Strings

## Temas Principales

### 1. Conceptos Básicos de Strings
- **Definiciones**:
  - **String**: Secuencia ordenada de caracteres.
  - **Substring**: Secuencia continua de caracteres dentro de un string.
  - **Prefijo**: Substring que comienza en la primera posición.
  - **Sufijo**: Substring que termina en la última posición.
- **Ejemplo**:
  - Dado \( S = "abcde" \):
    - Prefijos: "a", "ab", "abc", "abcd", "abcde".
    - Sufijos: "e", "de", "cde", "bcde", "abcde".

---

### 2. Z-Function
- **Definición**: Arreglo \( Z[i] \) que indica la longitud máxima del prefijo de \( S \) que coincide con el substring que inicia en \( i \).
- **Ejemplo**:
  - Para \( S = "aaabaaab" \), el arreglo \( Z \) es: [0, 2, 1, 0, 2, 1, 0, 1].
- **Pseudocódigo (Naive)**:
```python
def z_function_naive(S):
    n = len(S)
    Z = [0] * n
    for i in range(1, n):
        while i + Z[i] < n and S[Z[i]] == S[i + Z[i]]:
            Z[i] += 1
    return Z
```

---

### 3. Algoritmo Knuth-Morris-Pratt (KMP)
- **Problema**: Encontrar todas las ocurrencias de un patrón \( P \) en un texto \( T \).
- **Complejidad**: \( O(m + n) \) donde \( m \) es la longitud del patrón y \( n \) del texto.
- **Pseudocódigo para Preprocesamiento**:
```python
def kmp_preprocess(P):
    n = len(P)
    V = [0] * n
    j = 0
    for i in range(1, n):
        if P[i] == P[j]:
            V[i] = j + 1
            j += 1
        elif j > 0:
            j = V[j - 1]
            i -= 1  # Reanalizar posición i
        else:
            V[i] = 0
    return V
```

- **Pseudocódigo para Coincidencia**:
```python
def kmp_search(T, P):
    V = kmp_preprocess(P)
    i = j = 0
    while i < len(T):
        if T[i] == P[j]:
            i += 1
            j += 1
            if j == len(P):
                return i - j  # Coincidencia encontrada
        elif j > 0:
            j = V[j - 1]
        else:
            i += 1
    return -1  # No encontrado
```

---

### 4. Algoritmo de Manacher (Palíndromo Más Largo)
- **Problema**: Encontrar el substring palíndromo más largo de un string \( S \).
- **Complejidad**: \( O(n) \).
- **Pseudocódigo**:
```python
def manacher(S):
    T = '#' + '#'.join(S) + '#'
    n = len(T)
    L = [0] * n
    C = R = 0
    for i in range(1, n - 1):
        mirr = 2 * C - i
        if i < R:
            L[i] = min(R - i, L[mirr])
        while i + L[i] + 1 < n and i - L[i] - 1 >= 0 and T[i + L[i] + 1] == T[i - L[i] - 1]:
            L[i] += 1
        if i + L[i] > R:
            C = i
            R = i + L[i]
    max_len, center_index = max((L[i], i) for i in range(n))
    start = (center_index - max_len) // 2
    return S[start: start + max_len]
```

---

### 5. Hashing de Strings
- **Propósito**: Comparar strings eficientemente usando funciones hash.
- **Función Hash Polinómica**:
  - \( H(S) = \sum_{i=0}^{n-1} S[i] \cdot p^i \mod m \)
  - \( p \): Número primo pequeño.
  - \( m \): Número primo grande.
- **Pseudocódigo**:
```python
def polynomial_hash(S, p=31, m=1e9+9):
    hash_value = 0
    power = 1
    for char in S:
        hash_value = (hash_value + (ord(char) - ord('a') + 1) * power) % m
        power = (power * p) % m
    return hash_value
```

---

### 6. Arreglo de Sufijos (Suffix Array)
- **Definición**: Arreglo que contiene las posiciones de inicio de los sufijos de \( S \), ordenados lexicográficamente.
- **Aplicaciones**: Búsqueda de patrones, compresión de datos.
- **Complejidad**: \( O(n \log n) \).

---

### 7. Trie (Árbol de Prefijos)
- **Definición**: Estructura para almacenar y buscar strings en tiempo eficiente.
- **Pseudocódigo para Insertar**:
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.end_of_word = True
```
- **Pseudocódigo para Buscar**:
```python
def search(self, word):
    node = self.root
    for char in word:
        if char not in node.children:
            return False
        node = node.children[char]
    return node.end_of_word
```

---

### Referencias
- L. González, V. de la Cueva y O. Pérez. *Algoritmos: Análisis, Diseño e Implementación*. Editorial Digital del Tecnológico de Monterrey (2021).



# Guía: Presentación 8 - Aplicaciones de Técnicas de Diseño de Algoritmos

## Temas Principales

### 1. Longest Common Substring (LCS)
- **Problema**: Encontrar el substring común más largo entre dos strings.
- **Ejemplo**:
  - Dado \( S1 = "AABCABA" \) y \( S2 = "CABCBABACC" \), el LCS es "ABC", "CAB" o "ABA".
- **Pseudocódigo con Programación Dinámica**:
```python
def longest_common_substring(S1, S2):
    n, m = len(S1), len(S2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    max_len = 0
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if S1[i - 1] == S2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
                max_len = max(max_len, dp[i][j])
    return max_len
```

---

### 2. Longest Common Subsequence (LCS)
- **Problema**: Encontrar la subsecuencia común más larga entre dos strings.
- **Ejemplo**:
  - Dado \( S1 = "AABCABA" \) y \( S2 = "CABCBABACC" \), el LCS es "ABABA".
- **Pseudocódigo**:
```python
def longest_common_subsequence(S1, S2):
    n, m = len(S1), len(S2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if S1[i - 1] == S2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]
```

---

### 3. Problema de la Mochila (Knapsack Problem)
#### a. Sin Repetición (Programación Dinámica)
- **Definición**: Maximizar el valor de los objetos seleccionados sin superar el peso permitido.
- **Pseudocódigo**:
```python
def knapsack(values, weights, W):
    n = len(values)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(W + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]
```

#### b. Fraccional (Greedy)
- **Definición**: Permite fracciones de objetos.
- **Pseudocódigo**:
```python
def fractional_knapsack(values, weights, W):
    items = sorted(zip(values, weights), key=lambda x: x[0] / x[1], reverse=True)
    max_value = 0
    for value, weight in items:
        if W >= weight:
            W -= weight
            max_value += value
        else:
            max_value += value * (W / weight)
            break
    return max_value
```

---

### 4. Problema del Camino Más Corto (Shortest Path Problem)
#### a. Algoritmo de Dijkstra
- **Definición**: Encuentra la distancia más corta de un nodo a todos los demás en un grafo con pesos positivos.
- **Pseudocódigo**:
```python
import heapq

def dijkstra(graph, start):
    n = len(graph)
    distances = [float('inf')] * n
    distances[start] = 0
    pq = [(0, start)]  # (distancia, nodo)
    while pq:
        current_distance, current_node = heapq.heappop(pq)
        if current_distance > distances[current_node]:
            continue
        for neighbor, weight in graph[current_node]:
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    return distances
```

---

### Referencias
- L. González, V. de la Cueva y O. Pérez. *Algoritmos: Análisis, Diseño e Implementación*. Editorial Digital del Tecnológico de Monterrey (2021).



# Guía: Presentación 9 - Aplicaciones de Técnicas de Diseño de Algoritmos (Continuación)

## Temas Principales

### 1. Problema del Camino Más Corto (Shortest Path Problem)
#### a. Algoritmo de Floyd-Warshall
- **Definición**: Calcula la distancia más corta entre todos los pares de nodos en un grafo.
- **Complejidad**: \(O(V^3)\), donde \(V\) es el número de vértices.
- **Pseudocódigo**:
```python
def floyd_warshall(graph):
    n = len(graph)
    dist = [[float('inf')] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i == j:
                dist[i][j] = 0
            elif graph[i][j] != 0:
                dist[i][j] = graph[i][j]
    for k in range(n):
        for i in range(n):
            for j in range(n):
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    return dist
```

#### b. Algoritmo de Dijkstra
- **Definición**: Encuentra el camino más corto desde un nodo inicial a todos los demás.
- **Complejidad**: \(O((V + E) \log V)\) con un min-heap.
- **Pseudocódigo**:
```python
import heapq

def dijkstra(graph, start):
    n = len(graph)
    dist = [float('inf')] * n
    dist[start] = 0
    pq = [(0, start)]  # (distance, node)
    while pq:
        current_dist, node = heapq.heappop(pq)
        if current_dist > dist[node]:
            continue
        for neighbor, weight in graph[node]:
            new_dist = current_dist + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    return dist
```

---

### 2. Problema del Viajante (Travelling Salesman Problem)
- **Definición**: Encuentra el recorrido más corto que visita todos los nodos exactamente una vez y regresa al inicial.
- **Técnicas de Resolución**:
  - Backtracking.
  - Branch & Bound.
  - Programación Dinámica.

---

### 3. Árbol de Expansión Mínima (Minimum Spanning Tree)
#### a. Algoritmo de Prim
- **Definición**: Encuentra el subgrafo conexo con peso mínimo que conecta todos los vértices.
- **Complejidad**: \(O(E \log V)\).
- **Pseudocódigo**:
```python
import heapq

def prim(graph, start=0):
    n = len(graph)
    visited = [False] * n
    pq = [(0, start)]  # (cost, node)
    total_cost = 0
    while pq:
        cost, node = heapq.heappop(pq)
        if visited[node]:
            continue
        visited[node] = True
        total_cost += cost
        for neighbor, weight in graph[node]:
            if not visited[neighbor]:
                heapq.heappush(pq, (weight, neighbor))
    return total_cost
```

#### b. Algoritmo de Kruskal
- **Definición**: Une los vértices con las aristas de menor peso, asegurando que no formen ciclos.
- **Complejidad**: \(O(E \log E)\).
- **Pseudocódigo**:
```python
def kruskal(edges, n):
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        root_x = find(x)
        root_y = find(y)
        if root_x != root_y:
            parent[root_y] = root_x

    edges.sort(key=lambda x: x[2])  # Sort by weight
    mst_cost = 0
    for u, v, weight in edges:
        if find(u) != find(v):
            union(u, v)
            mst_cost += weight
    return mst_cost
```

---

### 4. Flujo Máximo (Maximum Flow)
#### a. Algoritmo de Edmonds-Karp
- **Definición**: Encuentra el flujo máximo en una red de flujo utilizando BFS.
- **Complejidad**: \(O(VE^2)\).
- **Pseudocódigo**:
```python
from collections import deque

def edmonds_karp(capacity, source, sink):
    n = len(capacity)
    flow = [[0] * n for _ in range(n)]
    max_flow = 0
    while True:
        parent = [-1] * n
        parent[source] = source
        queue = deque([source])
        while queue:
            u = queue.popleft()
            for v in range(n):
                if parent[v] == -1 and capacity[u][v] - flow[u][v] > 0:
                    parent[v] = u
                    queue.append(v)
                    if v == sink:
                        break
        else:
            break
        increment = float('inf')
        v = sink
        while v != source:
            u = parent[v]
            increment = min(increment, capacity[u][v] - flow[u][v])
            v = u
        v = sink
        while v != source:
            u = parent[v]
            flow[u][v] += increment
            flow[v][u] -= increment
            v = u
        max_flow += increment
    return max_flow
```

---

### Referencias
- L. González, V. de la Cueva y O. Pérez. *Algoritmos: Análisis, Diseño e Implementación*. Editorial Digital del Tecnológico de Monterrey (2021).



# Guía: Presentación 9 - Técnicas de Búsqueda Avanzada

## Temas Principales

### 1. Bitmask
- **Definición**: Máscara de bits utilizada para representar subconjuntos o estados de manera eficiente en memoria.
- **Operaciones principales**:
  - Establecer (prender un bit): \( b | (1 << i) \).
  - Remover (apagar un bit): \( b & \sim (1 << i) \).
  - Verificar (determinar si un bit está prendido): \( b & (1 << i) \).
- **Ejemplo (C++)**:
```cpp
typedef unsigned char uchar;

uchar add(uchar mask, int pos) {
    return (mask | (1 << pos));
}

uchar remove(uchar mask, int pos) {
    return (mask & ~(1 << pos));
}

bool test(uchar mask, int pos) {
    return ((mask & (1 << pos)) != 0);
}
```
- **Aplicación**: Resolución de problemas como el viajante usando programación dinámica.

---

### 2. Encontrarse en el Medio
- **Definición**: Técnica que divide la búsqueda en dos partes desde puntos opuestos (inicio y meta) y busca un punto de intersección.
- **Ejemplo práctico**: Búsqueda bidireccional en grafos.
- **Ventajas**:
  - Reduce el espacio de búsqueda total.
- **Pseudocódigo**:
```python
def meet_in_the_middle(graph, start, goal):
    forward_queue = [start]
    backward_queue = [goal]
    visited_forward = set()
    visited_backward = set()
    
    while forward_queue and backward_queue:
        if expand(forward_queue, visited_forward, visited_backward):
            return True
        if expand(backward_queue, visited_backward, visited_forward):
            return True
    return False

def expand(queue, visited, opposite_visited):
    current = queue.pop(0)
    if current in opposite_visited:
        return True
    visited.add(current)
    for neighbor in get_neighbors(current):
        if neighbor not in visited:
            queue.append(neighbor)
    return False
```

---

### 3. Búsqueda A*
- **Definición**: Combina las estrategias de búsqueda de costo uniforme (UCS) y BFS usando una función \( f(n) = g(n) + h(n) \).
  - \( g(n) \): Costo desde el inicio al nodo actual.
  - \( h(n) \): Heurística del costo estimado desde el nodo actual a la meta.
- **Pseudocódigo**:
```python
from queue import PriorityQueue

def a_star(graph, start, goal, h):
    pq = PriorityQueue()
    pq.put((0, start))
    costs = {start: 0}
    while not pq.empty():
        cost, node = pq.get()
        if node == goal:
            return costs[goal]
        for neighbor, weight in graph[node]:
            new_cost = costs[node] + weight
            if neighbor not in costs or new_cost < costs[neighbor]:
                costs[neighbor] = new_cost
                priority = new_cost + h(neighbor, goal)
                pq.put((priority, neighbor))
    return float('inf')
```

---

### 4. Búsqueda de Escalada (Hill Climbing)
- **Definición**: Algoritmo de búsqueda local que reemplaza el nodo actual por el mejor vecino según una función de evaluación.
- **Ventajas**:
  - Simplicidad y bajo uso de memoria.
- **Desventajas**:
  - Puede quedarse atrapado en óptimos locales.
- **Pseudocódigo**:
```python
def hill_climbing(graph, start, evaluate):
    current = start
    while True:
        neighbors = get_neighbors(current)
        best_neighbor = max(neighbors, key=evaluate)
        if evaluate(best_neighbor) <= evaluate(current):
            return current
        current = best_neighbor
```

---

### 5. Recocido Simulado (Simulated Annealing)
- **Definición**: Algoritmo que combina Hill Climbing con selecciones aleatorias, permitiendo ocasionalmente movimientos hacia peores soluciones para escapar de óptimos locales.
- **Pseudocódigo**:
```python
import math
import random

def simulated_annealing(graph, start, t_function, evaluate):
    current = start
    t = t_function(0)
    step = 0
    while t > 0:
        neighbor = random.choice(get_neighbors(current))
        delta = evaluate(neighbor) - evaluate(current)
        if delta > 0 or math.exp(delta / t) > random.random():
            current = neighbor
        step += 1
        t = t_function(step)
    return current
```

---

### Referencias
- S. Russell y P. Norvig. *Inteligencia Artificial: Un Enfoque Moderno*. 2ª edición, Pearson (2004).



# Temas Adicionales: Técnicas de Diseño de Algoritmos Avanzadas

## 1. BST Optimal Problem
- **Definición**: Determinar el árbol binario de búsqueda (BST) con el tiempo promedio de búsqueda mínimo.
- **Algoritmo de Gilbert and Moore**: 
  - Utiliza programación dinámica para almacenar los tiempos promedio de búsqueda en una matriz \( A[i][j] \).
  - Complejidad: \( O(n^3) \).
- **Pseudocódigo**:
```python
def optimal_bst(keys, probabilities):
    n = len(keys)
    A = [[float('inf')] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        A[i][i] = probabilities[i - 1]
    for diag in range(1, n):
        for i in range(1, n - diag + 1):
            j = i + diag
            minimum = float('inf')
            for k in range(i, j + 1):
                cost = A[i][k - 1] + A[k + 1][j]
                minimum = min(minimum, cost)
            A[i][j] = minimum + sum(probabilities[i - 1:j])
    return A[1][n]
```

---

## 2. Graph Coloring
- **Definición**: Asignar colores a los vértices de un grafo tal que vértices adyacentes tengan colores diferentes.
- **Algoritmo de Welsh-Powell**:
  - Ordenar los vértices por grado descendente.
  - Asignar colores de manera greedy.
- **Pseudocódigo**:
```python
def welsh_powell(graph):
    degrees = sorted(graph.keys(), key=lambda x: len(graph[x]), reverse=True)
    colors = {}
    current_color = 0
    for node in degrees:
        if node not in colors:
            current_color += 1
            colors[node] = current_color
            for neighbor in degrees:
                if neighbor not in colors and not any(colors.get(adj) == current_color for adj in graph[neighbor]):
                    colors[neighbor] = current_color
    return colors
```

---

## 3. Maximum Flow in a Flow Network
- **Algoritmo de Dinic**:
  - Divide el problema en bloques mediante niveles.
  - Complejidad: \( O(|V|^2|E|) \).
- **Pseudocódigo**:
```python
def dinic_max_flow(graph, source, sink):
    max_flow = 0
    while True:
        levels = bfs_level_graph(graph, source, sink)
        if not levels:
            break
        flow = send_flow(graph, source, sink, levels)
        max_flow += flow
    return max_flow

def bfs_level_graph(graph, source, sink):
    level = {node: -1 for node in graph}
    level[source] = 0
    queue = [source]
    while queue:
        current = queue.pop(0)
        for neighbor in graph[current]:
            if level[neighbor] == -1:
                level[neighbor] = level[current] + 1
                queue.append(neighbor)
                if neighbor == sink:
                    return level
    return None
```

---

## 4. Matrix Chain Multiplication
- **Algoritmo de Godbole**:
  - Utiliza programación dinámica para encontrar la forma óptima de agrupar matrices para minimizar multiplicaciones.
- **Pseudocódigo**:
```python
def matrix_chain_order(dims):
    n = len(dims) - 1
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]
                dp[i][j] = min(dp[i][j], cost)
    return dp[0][n - 1]
```

---

### Referencias
- L. González, V. de la Cueva y O. Pérez. *Algoritmos: Análisis, Diseño e Implementación*. Editorial Digital del Tecnológico de Monterrey (2021).
