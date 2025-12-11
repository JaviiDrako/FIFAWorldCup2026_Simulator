# 🏆 Simulador Interactivo Copa Mundial FIFA 2026

## 📋 ¿Qué es este proyecto?

Una aplicación web que te permite **simular todo el Mundial 2026** desde tu navegador. Crea grupos, simula partidos, y ve cómo se desarrolla el torneo completo. Lo especial: **replica exactamente las complejas reglas FIFA** para determinar qué equipos avanzan.

Accede a la web utilizando este enlace: [Simulador Copa Mudial 2026](https://fifa-world-cup2026-simulator.vercel.app)

## 🎮 ¿Qué puedes hacer?

### 1. **Crear los grupos del Mundial**
- **Opción A**: Sorteo automático con reglas FIFA reales
- **Opción B**: Armar grupos manualmente
- **Opción C**: Usar los grupos oficiales del sorteo real

### 2. **Simular la fase de grupos**
- **Modo Completo**: Ingresar el resultado de cada partido (72 partidos)
- **Modo Rápido**: Seleccionar directamente quién clasifica (1°, 2°, 3° lugar)

### 3. **Ver la fase eliminatoria completa**
- **Modo Completo**: Ingresar el resultado de cada cruce desde 16vos hasta la final
- **Modo Rápido**: Hacer clic en cada partido para elegir ganadores
- **Visualización clara**: Se ve todo el camino a la final

## 🧠 **El Problema Más Complejo: Los 8 Terceros Lugares**

### **¿Por qué es tan complicado?**

En el Mundial 2026, de los 12 grupos, clasifican los 2 primeros de cada grupo, pero también **8 de los 12 terceros lugares** El desafío es:

1. **¿Cuáles 8 terceros clasifican?** 
   - En modo detallado: Los 8 mejores según puntos, diferencia de goles, etc.
   - En modo rápido: Los 8 que se elijan

2. **¿A qué partido específico va cada tercero?**
   - No pueden ir a cualquier partido
   - Cada partido solo acepta terceros de ciertos grupos específicos
   - No pueden enfrentar al primer lugar de su mismo grupo

### **Ejemplo de las reglas:**

```
Partido 74 → Acepta terceros de grupos: A, B, C, D, F
Partido 77 → Acepta terceros de grupos: C, D, F, G, H
Partido 79 → Acepta terceros de grupos: C, E, F, H, I
... y así para 8 partidos diferentes
```

## 🔧 Resolución del problema de asignación


### 1. Modo Rápido (Usuario elige) ⚡
- **Situación**: 8 terceros lugares seleccionados por el usuario
- **Problema**: Asignar esos 8 a los 8 partidos disponibles
- **Solución**: **Algoritmo Voraz (Greedy)**

**Cómo funciona:**
```typescript
// Paso a paso del algoritmo Greedy:
1. Mirar cada grupo: ¿A qué partidos puede ir?
2. Ordenar grupos: Los con MENOS opciones primero
3. Asignar: Darle al grupo su primera opción disponible
4. Actualizar: Quitar ese partido de las opciones
5. Repetir hasta asignar todos
```

**Ejemplo práctico:**
- Grupo K solo puede ir a Partido 87 → Lo asignamos primero
- Grupo L solo puede ir a Partido 80 → Lo asignamos segundo
- Grupo A puede ir a Partido 74 o 82 → Lo asignamos después

### 2. Modo Completo (12 equipos, elegir los 8 mejores) ⚙️
- **Situación**: Tenemos 12 terceros, debemos elegir los 8 mejores y asignarlos
- **Problema**: ¿Qué pasa si los 8 mejores no se pueden asignar?
- **Solución**: **Matching Bipartito + DFS**

### Grafo Bipartito
Al tener grupos de emparejamiento:
- **Grupo 1**: 8 equipos (terceros lugares)
- **Grupo 2**: 8 partidos

Las "conexiones" son: cada equipo puede ir a ciertos partidos. Queremos "emparejar" cada equipo con un partido diferente.

### **DFS (Depth-First Search)**
Es como explorar un laberinto:
1. Empiezar por un camino
2. Si se llega a callejón sin salida, vuelve atrás
3. Prueba otro camino
4. Seguir hasta encontrar la salida

### **La Matriz de Compatibilidad**
Es una tabla que dice qué equipos pueden ir a qué partidos:

```
        Partido74 Partido77 Partido79 Partido80 ...
Grupo A    ✓         ✗         ✓         ✗
Grupo B    ✓         ✗         ✗         ✗  
Grupo C    ✓         ✓         ✓         ✗
Grupo D    ✓         ✓         ✗         ✗
...
```

✓ = Puede ir  
✗ = No puede ir

### **Cómo Funciona el Algoritmo Paso a Paso:**

```typescript
// FASE 1: Preparación
1. Ordenamos equipos: Los con MENOS opciones primero
2. Creamos la matriz de compatibilidad

// FASE 2: Búsqueda con Backtracking
for each equipo (en orden de dificultad):
  for each partido compatible:
    if partido está libre:
      asignamos equipo → partido
    else:
      intentamos mover al equipo actual de ese partido
      if éxito:
        re-asignamos y continuamos
      else:
        deshacemos cambios y probamos siguiente partido

// FASE 3: Si falla, usamos plan B
if no encontramos asignación perfecta:
  usamos algoritmo voraz (greedy) como respaldo
```

## 🚀 **Flujo Completo de la Aplicación**

```
INICIO → Elegir cómo crear grupos → Simular fase grupos → Octavos de final
         ↓                          ↓                    ↓
    Manual/Automático       Completo/Rápido        Bracket interactivo
    /Oficial                         ↓
                              ¿Hay terceros?
                                   ↓
                           Asignación automática
                           (algoritmo descrito)
```

## 💻 **Tecnologías Usadas**

### **Frontend:**
- **Next.js 14** - Framework de React para aplicaciones web
- **React 18** - Para crear interfaces interactivas
- **TypeScript** - JavaScript con "chequeo de tipos" para menos errores
- **Tailwind CSS** - Para estilos rápidos y responsivos
- **shadcn/ui** - Componentes bonitos pre-hechos

### **Backend:**
Todo corre en **navegador**:
- Los cálculos se hacen en computadora/telefono
- No hay servidor ni base de datos
- Funciona completamente offline

## 🚀 **Cómo Funciona Por Dentro**

### **1. Estructura de Archivos:**
```
app/              # Páginas principales
components/       # Partes reutilizables (botones, tarjetas)
lib/             # Lógica y algoritmos (¡aquí está lo complicado!)
public/          # Imágenes, banderas, etc.
```

### **2. Archivos Importantes:**
- `lib/tournament-structure.ts` → **El cerebro** (algoritmo de terceros lugares)
- `components/GroupSimulator.tsx` → Simulador de fase de grupos
- `components/KnockoutBracket.tsx` → Bracket de eliminatorias

### **3. Tipos de Archivos:**
- `.ts` → **Solo lógica** (funciones, cálculos)
- `.tsx` → **Lógica + interfaz** (componentes con botones, texto, etc.)

## 🎯 **Para Quién Es Este Proyecto**

### **Para aficionados al fútbol:**
- Simula escenarios del Mundial 2026
- Entiende las complejas reglas de clasificación
- Compite con amigos en predicciones

### **Para estudiantes de programación:**
- Ejemplo real de algoritmos complejos
- Proyecto completo con Next.js + TypeScript
- Código bien organizado y comentado

### **Para curiosos:**
- Ve cómo funciona un sorteo FIFA por dentro
- Experimenta con "y si..." (¿y si este equipo gana? ¿y si este pierde?)

## 🛠 **Instalación Para Desarrolladores**

```bash
# 1. Clona el proyecto
git clone https://github.com/tuusuario/world-cup-2026-simulator.git

# 2. Instala dependencias
npm install

# 3. Corre en desarrollo
npm run dev

# 4. Abre en navegador
# http://localhost:3000
```

## 🤝 **Contribuir**

¿Encontraste un bug? ¿Tienes una idea para mejorar?

1. **Reporta issues** en GitHub
2. **Envía un Pull Request** con mejoras
3. **Comparte** con otros aficionados

## 📄 **Licencia**

Este es un proyecto **de código abierto** creado por un aficionado. No está afiliado a la FIFA.

**Nota importante**: FIFA™ es una marca registrada. Este simulador es para fines educativos y de entretenimiento.













