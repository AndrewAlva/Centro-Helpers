# Guía de instalación: Node, npm, Git, Vite y Three.js

**Interacción y Renderizado Web Avanzado · CC325-21**

Esta guía te lleva paso a paso para dejar tu computadora lista para trabajar en clase. Sigue los pasos **en orden**. No te saltes ninguno.

---

## Elige tu computadora

Haz clic en la tuya para ir directo a tus instrucciones:

- 🪟 **[Tengo Windows (PC)](#windows)**
- 🍎 **[Tengo Mac](#mac)**

---

## Qué vamos a instalar (y para qué sirve cada cosa)

| Programa | Para qué sirve | Cómo se instala |
|---|---|---|
| **VS Code** | El editor donde escribes tu código | Descargando el instalador |
| **Node.js** | Permite correr JavaScript fuera del navegador. **Ya incluye npm.** | Descargando el instalador |
| **npm** | La tienda de paquetes de JavaScript. Con él instalas Vite y Three.js | Viene dentro de Node.js |
| **Git** | Guarda versiones de tu proyecto y lo sube a GitHub | Descargando el instalador |
| **Vite** | El servidor que te deja ver tu proyecto en el navegador | Con `npm`, **dentro de cada proyecto** |
| **Three.js** | La librería para hacer 3D en el navegador | Con `npm`, **dentro de cada proyecto** |

> 💡 **Importante:** Vite y Three.js **no se instalan una sola vez en la computadora**. Se instalan dentro de cada proyecto. Por eso, si recuperas tu proyecto del escaparate desde GitHub, un solo comando (`npm install`) te los vuelve a instalar.

### Cómo leer esta guía

Todo lo que aparece en una caja gris como esta es **código que tienes que escribir (o copiar y pegar) en la terminal**:

```bash
esto es un ejemplo, no lo escribas
```

Después de pegar cada comando, presiona **Enter** y espera a que termine antes de escribir el siguiente.

> ⚠️ **No copies el símbolo `$` ni `>`** si algún día lo ves al inicio de una línea. Solo copia el comando.

---
---

# Windows

## Paso 1 · Instalar VS Code

1. Entra a 👉 **<https://code.visualstudio.com/>**
2. Haz clic en el botón azul **Download for Windows**.
3. Abre el archivo que se descargó y sigue el instalador.
4. En la pantalla **"Select Additional Tasks"** marca estas casillas:
   - ✅ *Add "Open with Code" action to Windows Explorer file context menu*
   - ✅ *Add to PATH*
5. Haz clic en **Install** y luego en **Finish**.

## Paso 2 · Instalar Node.js (incluye npm)

1. Entra a 👉 **<https://nodejs.org/>**
2. Descarga la versión que dice **LTS** (es la estable; **no** descargues la que dice "Current").
3. Abre el instalador (`.msi`) y da **Next** en todo. **No cambies nada** de las opciones que vienen por defecto.
4. Cuando termine, haz clic en **Finish**.

## Paso 3 · Instalar Git

1. Entra a 👉 **<https://git-scm.com/download/win>**
2. Se descargará el instalador automáticamente (si no, haz clic en **"Click here to download"**).
3. Ábrelo y da **Next** en todas las pantallas. **No cambies nada** de las opciones por defecto.
4. Haz clic en **Install** y luego en **Finish**.

## Paso 4 · Reiniciar la computadora

Reinicia tu computadora ahora. Sirve para que Windows reconozca todo lo que acabas de instalar.

> Si no reinicias, en el siguiente paso puede salirte un error de "no se reconoce el comando".

## Paso 5 · Abrir la terminal y comprobar que todo se instaló

1. Presiona la tecla **Windows** ⊞ del teclado.
2. Escribe **PowerShell**.
3. Abre **Windows PowerShell**. Se abre una ventana azul (o negra) donde vas a escribir los comandos.

Escribe estos tres comandos, **uno por uno**, presionando Enter después de cada uno:

```powershell
node -v
```

```powershell
npm -v
```

```powershell
git --version
```

**✅ Si todo salió bien**, cada comando te responde con un número de versión, algo así:

```
v24.11.0
11.6.1
git version 2.51.0.windows.1
```

(Tus números pueden ser distintos, no importa. Lo importante es que **te responda con números y no con un error rojo**.)

> ❌ Si algún comando marca error, ve a la sección [Si algo sale mal](#si-algo-sale-mal).

## Paso 6 · Presentarte con Git

Git necesita saber quién eres. **Solo se hace una vez.** Escribe estos dos comandos, cambiando lo que está entre comillas por **tu nombre** y **el correo con el que tienes tu cuenta de GitHub**:

```powershell
git config --global user.name "Tu Nombre Aquí"
```

```powershell
git config --global user.email "tucorreo@ejemplo.com"
```

Para comprobar que quedó guardado:

```powershell
git config --global --list
```

Deberías ver tu nombre y tu correo en la lista.

**Sigue en → [Paso final: recuperar tu proyecto](#paso-final-recuperar-tu-proyecto-windows-y-mac)**

---
---

# Mac

## Paso 1 · Instalar VS Code

1. Entra a 👉 **<https://code.visualstudio.com/>**
2. Haz clic en el botón azul **Download for Mac**.
3. Se descarga un archivo `.zip`. Ábrelo (doble clic) y saldrá la aplicación **Visual Studio Code**.
4. **Arrastra** esa aplicación a tu carpeta **Aplicaciones** (Applications).

## Paso 2 · Instalar Node.js (incluye npm)

1. Entra a 👉 **<https://nodejs.org/>**
2. Descarga la versión que dice **LTS** (es la estable; **no** descargues la que dice "Current"). Elige el instalador **macOS Installer (.pkg)**.
3. Ábrelo y da **Continuar** en todas las pantallas.
4. Te va a pedir la contraseña de tu Mac. Escríbela y continúa.
5. Al terminar, haz clic en **Cerrar**.

## Paso 3 · Abrir la terminal

1. Presiona **Cmd ⌘ + Espacio** (se abre Spotlight).
2. Escribe **Terminal**.
3. Presiona **Enter**. Se abre una ventana donde vas a escribir los comandos.

## Paso 4 · Instalar Git

En tu Mac, Git viene en unas herramientas de Apple. Escribe esto en la terminal:

```bash
git --version
```

- **Si te responde con una versión** (por ejemplo `git version 2.39.5`), ya lo tienes. Pasa al Paso 5.
- **Si te aparece una ventana** que dice *"El comando git requiere las herramientas de línea de comandos"*, haz clic en **Instalar**, acepta los términos y **espera** (puede tardar varios minutos). Cuando termine, vuelve a escribir `git --version` para confirmar.

## Paso 5 · Comprobar que todo se instaló

Escribe estos comandos, **uno por uno**, presionando Enter después de cada uno:

```bash
node -v
```

```bash
npm -v
```

```bash
git --version
```

**✅ Si todo salió bien**, cada comando te responde con un número de versión, algo así:

```
v24.11.0
11.6.1
git version 2.39.5
```

(Tus números pueden ser distintos, no importa. Lo importante es que **te responda con números y no con un error**.)

> ❌ Si algún comando marca error, ve a la sección [Si algo sale mal](#si-algo-sale-mal).

## Paso 6 · Presentarte con Git

Git necesita saber quién eres. **Solo se hace una vez.** Escribe estos dos comandos, cambiando lo que está entre comillas por **tu nombre** y **el correo con el que tienes tu cuenta de GitHub**:

```bash
git config --global user.name "Tu Nombre Aquí"
```

```bash
git config --global user.email "tucorreo@ejemplo.com"
```

Para comprobar que quedó guardado:

```bash
git config --global --list
```

Deberías ver tu nombre y tu correo en la lista.

**Sigue en → [Paso final: recuperar tu proyecto](#paso-final-recuperar-tu-proyecto-windows-y-mac)**

---
---

# Paso final: recuperar tu proyecto (Windows y Mac)

Desde aquí los comandos son **iguales en Windows y en Mac**.

## A · Entrar a tu cuenta de GitHub

1. Entra a 👉 **<https://github.com/login>** e inicia sesión con tu cuenta.
2. Busca el repositorio de tu **escaparate** en la lista de *Your repositories* (o desde tu foto de perfil → **Your repositories**).

> 🔎 **Si ves tu repositorio** → sigue con el punto B. Tu avance está a salvo.
>
> 🔎 **Si no lo ves, o está vacío** → significa que ese avance nunca se subió a GitHub. Avísame por correo y vemos cómo retomarlo. Mientras tanto, sigue con la sección [Plan B: proyecto nuevo de prueba](#plan-b-proyecto-nuevo-de-prueba) para comprobar que tu instalación funciona.

## B · Descargar tu proyecto a tu computadora

1. Dentro de tu repositorio en GitHub, haz clic en el botón verde **`< > Code`**.
2. Con la pestaña **HTTPS** seleccionada, haz clic en el icono de copiar 📋 junto a la dirección.
3. En la terminal, escribe `git clone` seguido de un espacio y **pega** la dirección que copiaste. Se ve así:

```bash
git clone https://github.com/tu-usuario/nombre-de-tu-repositorio.git
```

> 🧩 Esa dirección es de ejemplo. **Usa la que copiaste de tu propio repositorio.**

4. La primera vez te va a abrir una ventana del navegador para **iniciar sesión en GitHub**. Autoriza el acceso y regresa a la terminal.
5. Cuando termine, entra a la carpeta que se creó. **Cambia `nombre-de-tu-repositorio` por el nombre real de tu carpeta**:

```bash
cd nombre-de-tu-repositorio
```

## C · Reinstalar Vite y Three.js con un solo comando

Estando **dentro de la carpeta de tu proyecto**, escribe:

```bash
npm install
```

Espera a que termine (puede tardar uno o dos minutos). Este comando lee el archivo `package.json` de tu proyecto e instala **automáticamente** todo lo que tu proyecto necesita, incluidos **Vite** y **Three.js**. Va a aparecer una carpeta nueva llamada `node_modules`. Es normal y **no debes tocarla ni subirla a GitHub**.

## D · Abrir el proyecto y verlo funcionando

Sigue estando dentro de la carpeta del proyecto y escribe:

```bash
code .
```

(Eso abre VS Code con tu proyecto. Ojo: hay un espacio y un punto después de `code`.)

Ahora, para ver tu proyecto en el navegador:

```bash
npm run dev
```

La terminal te va a mostrar algo como:

```
  VITE  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

Abre esa dirección (`http://localhost:5173/`) en Chrome. **Si ves tu escaparate, todo quedó instalado. ¡Listo!** 🎉

Para detener el servidor cuando termines, en la terminal presiona **Ctrl + C**.

---

# Plan B: proyecto nuevo de prueba

Haz esto **solo si** tu repositorio no tiene tu avance y quieres comprobar que todo funciona. Estos comandos crean un proyecto vacío con Vite y le instalan Three.js.

**1.** Crea el proyecto (la carpeta se llamará `prueba-vite`):

```bash
npm create vite@latest prueba-vite
```

Te va a hacer un par de preguntas. Contesta así (muévete con las flechas ↑ ↓ y confirma con Enter):

- **Select a framework:** `Vanilla`
- **Select a variant:** `JavaScript`
- Si te pregunta si quieres instalar y arrancar de una vez, puedes decir que **No** y seguir con los comandos de abajo.

**2.** Entra a la carpeta:

```bash
cd prueba-vite
```

**3.** Instala lo que necesita el proyecto:

```bash
npm install
```

**4.** Instala Three.js:

```bash
npm install three
```

**5.** Arranca el servidor:

```bash
npm run dev
```

**6.** Abre en Chrome la dirección que te muestre la terminal (normalmente `http://localhost:5173/`). Si ves la página de Vite, tu instalación funciona.

---

# Si algo sale mal

## `node`, `npm` o `git` "no se reconoce como comando" (Windows)

O en Mac: `command not found`.

1. **Cierra la terminal por completo** y ábrela otra vez.
2. Si sigue igual, **reinicia la computadora** y vuelve a intentar.
3. Si aún no funciona, vuelve a instalar el programa que falla, con las opciones por defecto.

## Windows: "la ejecución de scripts está deshabilitada en este sistema"

Es un bloqueo de seguridad de PowerShell que aparece al usar `npm`. Se arregla con este comando:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Si te pregunta algo, escribe `S` (o `Y`) y presiona Enter. Después, cierra y abre PowerShell y vuelve a intentar.

## `npm install` se queda "congelado" o marca errores de red

- Revisa que tengas internet estable.
- Espera un par de minutos: a veces solo es lento.
- Si de plano falla, presiona **Ctrl + C**, y vuelve a escribir `npm install`.

## "Port 5173 is already in use"

Ya tienes otro proyecto de Vite corriendo. Busca la otra ventana de terminal y presiona **Ctrl + C** para detenerlo, o simplemente usa la dirección que te muestre Vite (puede ser `5174`).

## Nada de esto funcionó

**No pasa nada.** Escríbeme a **salvaradoh@centro.edu.mx** y mándame:

1. 📸 Una **captura de pantalla** de la terminal con el error completo.
2. 💻 Si tienes **Windows o Mac**.
3. 📍 En **qué paso** te quedaste.

Con eso te ayudo mucho más rápido.

---

## Resumen rápido (por si ya sabes lo que haces)

1. Instala **VS Code**, **Node.js LTS** y **Git**.
2. Verifica: `node -v` · `npm -v` · `git --version`
3. Configura Git: `git config --global user.name "..."` y `git config --global user.email "..."`
4. Clona tu repo: `git clone <url>`
5. Entra a la carpeta: `cd <carpeta>`
6. Instala dependencias: `npm install`
7. Arranca: `npm run dev`

### Links de descarga

| Qué | Link |
|---|---|
| VS Code | <https://code.visualstudio.com/> |
| Node.js (incluye npm) | <https://nodejs.org/> |
| Git para Windows | <https://git-scm.com/download/win> |
| Git para Mac | <https://git-scm.com/download/mac> |
| Cuenta de GitHub | <https://github.com/> |
| Vite (documentación) | <https://vite.dev/> |
| Three.js (documentación) | <https://threejs.org/> |
