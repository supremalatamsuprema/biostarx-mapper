# Especificación Técnica y Funcional: BioStar X Mapper

## 1. Introducción
**BioStar X Mapper** es una aplicación web interactiva diseñada para la preventa técnica de la plataforma de control de acceso BioStar X de Suprema. Su objetivo principal es calcular de forma precisa y en tiempo real el licenciamiento (Bill of Materials - BOM) necesario según las capacidades y funcionalidades requeridas por un proyecto específico.

## 2. Stack Tecnológico
Para garantizar portabilidad y facilidad de ejecución sin dependencias complejas, responsiva para usar en brouser o celulares.
- **Google Fonts**: Tipografías *Montserrat* (títulos) y *Noto Sans* (cuerpo).

---

## 3. Modelo de Datos (Data Dictionary)

### 3.1 Niveles de Licencia (LICENSE_TIERS)
La app utiliza una jerarquía de 5 niveles base:
| ID | Nombre | Puertas Máx | Usuarios Máx | Operadores Máx | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BIOSTARX-STR | Starter | 5 | 100 | 1 | Pequeños sitios. |
| BIOSTARX-ESS | Essential | 32 | 1,000 | 10 | PyMEs con expansión. |
| BIOSTARX-ADV | Advanced | 128 | 50,000 | 20 | Profesional & Mapas. |
| BIOSTARX-ENT | Enterprise | 500 | 100,000 | 40 | Todo incluido. |
| BIOSTARX-ELT | Elite | 2000 | 500,000 | 100 | Alta capacidad. |

### 3.2 Add-ons y Upgrades (ADDONS)
- **Funcionalidad**: Visitantes, T&A (Standard/Enterprise), Mobile App, API Support, AD/LDAP, Remote Access, Event API.
- **Upgrades**: Incrementos de puertas (+32), operadores (+5) y usuarios (+5k para Essential).
- **Paquetes**: *Advanced AC Package* (Incluye Global APB, Fire Zones, etc.).
- **Dispositivos**: Licencias para Cámaras QR, Cerraduras Inalámbricas y Canales de Video.

---

## 4. Estructura de la Aplicación

### 4.1 Pantalla de Bienvenida (Landing)
Permite al usuario seleccionar el **Escenario del Proyecto**:
1. **Proyecto Nuevo (Greenfield)**: Instalación desde cero.
2. **Migración BioStar 2 (Legacy)**: Actualización de sistemas existentes (Bloquea el tier Starter y activa validaciones extras).

### 4.2 Interfaz Principal (Single-Page Layout)
Toda la configuración se realiza en una sola página con scroll continuo, dividida en:
- **Header**: Logo, indicador de escenario y botón de reinicio.
- **Main Column (68%)**: Formulario de entrada de datos.
- **Sticky Sidebar (32%)**: Dashboard en tiempo real que muestra el tier seleccionado y el BOM detallado.

---

## 5. Secciones de Datos

### 5.1 Identificación del Proyecto
Campos de metadatos: Nombre del proyecto, Cliente, País, Tipo de cliente, Datos del contacto (Nombre, Apellido, Email, Teléfono) y Autorización de datos.

### 5.2 Validación de Migración (Condicional)
Solo aparece en el escenario "Migración":
- Versión actual, Código de activación.
- Carga de evidencias (Dashboard, Versión, Licencia).
- Checkbox de confirmación: No hay equipos de 1ra Generación.

### 5.3 Dimensionamiento y Capacidad
Entradas numéricas críticas para el motor de cálculo:
- Usuarios, Puertas, Dispositivos, Operadores.

### 5.4 Funciones y Add-ons
Toggles y checkboxes categorizados:
- **ADVANCED AC**: Si se activa cualquiera (Global Apb, Interlock, etc.), se dispara la necesidad de la licencia *Base Advanced* o superior + el paquete *Advanced AC*.
- **MÓDULOS**: Mapas Gráficos (Requiere Advanced), Visitantes, T&A, Mobile, AD, Remote, APIs.

---

## 6. Lógica de Cálculo (Motor Core)

La lógica reside en el hook `useMemo` de `calculatedBOM` y sigue estos pasos:

1. **Determinación del Tier Base**:
    - Se filtran los tiers candidatos. Si es migración, se elimina `Starter`.
    - Si se requiere *Advanced AC* o *Mapas Gráficos*, se eliminan `Starter` y `Essential`.
    - Se selecciona el tier más bajo que cumpla con el máximo de **Usuarios** y **Operadores**.
    - **Ajuste por Puertas**: Si el número de puertas excede el Tier seleccionado, se sube al siguiente nivel o se calculan upgrades de puertas (packs de 32) si el tier lo permite.

2. **Inclusión de Part Numbers**:
    - Se añade la licencia base seleccionada.
    - Se calculan **Upgrades** si los inputs exceden los límites del tier (Puertas, Ops, Usuarios en Essential).
    - Se añaden **Add-ons** seleccionados visualmente.
    - Se añaden **Device Licenses** según las unidades ingresadas (QR, Wireless, Video).

---

## 7. Salida y Reporte

### 7.1 Sidebar BOM
Actualización visual inmediata. Muestra el nombre comercial del tier y el listado de IDs técnicos con sus cantidades.

### 7.2 Reporte Maestro (Modal)
Genera una vista previa estilizada que incluye:
- Resumen técnico de capacidades.
- Detalle de validación de migración (si aplica).
- **Lista de Materiales (BOM)** formateada en tabla detallada.
- Funciones para **Imprimir/Exportar a PDF** y **Copiar Texto**.

---

## 8. Diseño y Estética (UI/UX)
- **Paleta de Colores**: Rojo Suprema (#A12944), Azul BioStar X (#0047FF) y Gradientes dinámicos.
- **Componentes Visuales**:
    - `NumericInput`: Inputs minimalistas con animaciones de escala al enfocar.
    - `FeatureToggle`: Checkboxes con bordes activos y cambios de color de fondo.
    - `Glass-card`: Efectos de desenfoque de fondo y bordes semi-transparentes.
- **Animaciones**: Fade-in suave al cargar secciones y transiciones de estado.

---

## 9. Instrucciones para Reconstrucción
Para replicar esta app:
1. Crear un web app moderno, profesional, seguro, responsive, .
2. Copiar los estilos personalizados (sección `<style>`).
3. Definir las constantes de datos (`LICENSE_TIERS`, `ADDONS`).
4. Implementar el componente `App` con los estados definidos para `meta`, `inputs` y `features`.
5. Asegurar que el `useMemo` de `calculatedBOM` respete estrictamente las reglas de selección de tiers y upgrades detalladas en la sección 6.
6. Usar Tailwind CSS para el layout de dos columnas responsivo.
7. usa las mejoras practicas de desarrollo de software.
8. usa una estructura profesional y mantenible, siguiendo las mejores practicas de desarrollo de software.
 implemente cualquier mejora que consideres necesaria.
 
