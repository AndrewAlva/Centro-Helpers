#!/usr/bin/env python3
"""
SOLUCIÓN DOCENTE, NO REPARTIR.

Genera los assets del escaparate sin depender de archivos externos:
  public/textures/concrete.jpg       piso y pared (tileable)
  public/textures/wood.jpg           pedestales (tileable)
  public/textures/deck-a|b|c.png     gráficos de tablas (sin texto, se ven bien en cualquier orientación)
  public/textures/matcap-chrome.png  matcap cromado para los rodamientos
  public/models/skateboard.glb       tabla completa (deck, grip, trucks, 4 ruedas)

En un proyecto real de alumno, el GLB sale de Cinema 4D o Blender. Aquí se construye
por código solo para que el ejemplo corra sin assets externos.

Uso:  pip install numpy pillow trimesh && python3 tools/generate_assets.py
"""
from pathlib import Path

import numpy as np
import trimesh
from PIL import Image, ImageDraw
from trimesh.visual import TextureVisuals
from trimesh.visual.material import PBRMaterial

RAIZ = Path(__file__).resolve().parent.parent
TEX = RAIZ / "public" / "textures"
MOD = RAIZ / "public" / "models"
TEX.mkdir(parents=True, exist_ok=True)
MOD.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


# ─────────────────────────── texturas ───────────────────────────
def ruido_fft(h, w, beta, ax=1.0, ay=1.0):
    """Ruido con espectro 1/f^beta. Por construcción es periódico: la textura hace tile sin costura."""
    F = np.fft.fft2(rng.standard_normal((h, w)))
    fy = np.fft.fftfreq(h)[:, None] * ay
    fx = np.fft.fftfreq(w)[None, :] * ax
    f = np.sqrt(fx**2 + fy**2)
    f[0, 0] = 1.0
    F = F / f**beta
    F[0, 0] = 0
    n = np.real(np.fft.ifft2(F))
    return (n - n.min()) / (n.max() - n.min())


def guardar_jpg(arr, nombre):
    img = Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8), "RGB")
    img.save(TEX / nombre, quality=86, optimize=True)


def concreto(n=512):
    base = 0.30 + 0.22 * ruido_fft(n, n, 1.3) + 0.10 * ruido_fft(n, n, 0.5)
    poros = ruido_fft(n, n, 0.2)
    base[poros > 0.93] *= 0.55  # poros oscuros
    rgb = np.stack([base * 1.00, base * 0.99, base * 1.04], -1)  # gris ligeramente frío
    guardar_jpg(rgb, "concrete.jpg")


def madera(n=512):
    """Triplay de maple: vetas largas y suaves, con un poco de grano fino."""
    vetas = ruido_fft(n, n, 1.6, ax=0.08, ay=1.0)  # estirado a lo largo de x
    grano = ruido_fft(n, n, 0.4, ax=0.15, ay=1.0)
    y = np.arange(n)[:, None] / n
    anillos = 0.5 + 0.5 * np.sin((y * 7 + vetas * 0.9) * 2 * np.pi)
    t = 0.40 * anillos + 0.40 * vetas + 0.20 * grano
    claro = np.array([0.82, 0.66, 0.44])
    oscuro = np.array([0.60, 0.43, 0.26])
    rgb = oscuro[None, None, :] + (claro - oscuro)[None, None, :] * t[..., None]
    guardar_jpg(rgb * 0.9, "wood.jpg")


def deck_a(draw, W, H):
    draw.rectangle([0, 0, W, H], fill="#ff2e88")
    draw.ellipse([120, -40, 420, 300], fill="#2ee6d6")
    draw.ellipse([190, 30, 350, 230], fill="#ff2e88")
    for i in range(0, W, 64):  # zigzag amarillo
        draw.polygon([(i, H), (i + 32, H - 70), (i + 64, H)], fill="#ffd23f")
    for i in range(6):
        draw.ellipse([520 + i * 70, 40 + (i % 2) * 40, 556 + i * 70, 76 + (i % 2) * 40], fill="#fff6e0")
    draw.rectangle([0, 0, W, 14], fill="#16161a")
    draw.rectangle([0, H - 14, W, H], fill="#16161a")


def deck_b(draw, W, H):
    draw.rectangle([0, 0, W, H], fill="#1c1f3a")
    for i in range(0, W, 32):  # franja de tablero de ajedrez
        for j in range(3):
            if (i // 32 + j) % 2 == 0:
                draw.rectangle([i, 90 + j * 26, i + 32, 116 + j * 26], fill="#fff6e0")
    cx, cy = 300, 128
    for k in range(16):  # sol con rayos
        a = k * np.pi / 8
        draw.polygon([
            (cx + 60 * np.cos(a - 0.12), cy + 60 * np.sin(a - 0.12)),
            (cx + 140 * np.cos(a), cy + 140 * np.sin(a)),
            (cx + 60 * np.cos(a + 0.12), cy + 60 * np.sin(a + 0.12)),
        ], fill="#ffd23f")
    draw.ellipse([cx - 62, cy - 62, cx + 62, cy + 62], fill="#ff2e88")
    for i in range(5):
        draw.polygon([(600 + i * 80, 210), (640 + i * 80, 120), (680 + i * 80, 210)], fill="#2ee6d6")


def deck_c(draw, W, H):
    draw.rectangle([0, 0, W, H], fill="#ffd23f")
    for k in range(5):  # ondas rosas
        pts = [(x, 50 + k * 38 + 18 * np.sin(x / 38 + k)) for x in range(0, W + 1, 8)]
        draw.line(pts, fill="#ff2e88", width=12)
    for i in range(4):
        draw.ellipse([90 + i * 240, 80, 190 + i * 240, 180], fill="#16161a")
        draw.ellipse([120 + i * 240, 110, 160 + i * 240, 150], fill="#2ee6d6")


def decks():
    for nombre, fn in (("deck-a", deck_a), ("deck-b", deck_b), ("deck-c", deck_c)):
        img = Image.new("RGB", (1024, 256))
        fn(ImageDraw.Draw(img), 1024, 256)
        img.save(TEX / f"{nombre}.png", optimize=True)


def matcap_cromo(n=256):
    """Esfera cromada en espacio de vista: cielo arriba, horizonte y suelo oscuro abajo."""
    ys, xs = np.mgrid[0:n, 0:n]
    x = (xs + 0.5) / n * 2 - 1
    y = -((ys + 0.5) / n * 2 - 1)
    r2 = np.clip(x**2 + y**2, 0, 1)
    z = np.sqrt(1 - r2)
    rx, ry, rz = 2 * z * x, 2 * z * y, 2 * z * z - 1  # vector reflejado
    cielo = np.array([0.93, 0.96, 1.00])
    horizonte = np.array([0.55, 0.58, 0.65])
    suelo = np.array([0.10, 0.10, 0.13])
    t = np.clip((ry + 0.15) / 0.5, -1, 1)
    arriba = horizonte + (cielo - horizonte) * np.clip(t, 0, 1)[..., None]
    abajo = horizonte + (suelo - horizonte) * np.clip(-t * 1.6, 0, 1)[..., None]
    col = np.where((t >= 0)[..., None], arriba, abajo)
    luz = np.exp(-(((rx + 0.55) ** 2 + (ry - 0.55) ** 2 + (rz - 0.63) ** 2) / 0.05))  # softbox
    col = col + luz[..., None] * 0.6
    borde = 0.6 + 0.4 * (1 - r2) ** 0.4  # leve oscurecimiento en el borde
    col = col * borde[..., None]
    Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8), "RGB").save(TEX / "matcap-chrome.png", optimize=True)


# ─────────────────────────── modelo GLB ───────────────────────────
L, W, T = 0.81, 0.205, 0.012  # largo, ancho y grosor del deck (metros)


def superficies_deck():
    """Deck paramétrico: puntas redondeadas, nose y tail levantados, concavidad transversal."""
    nu, nv = 90, 14
    th = np.linspace(-np.pi / 2, np.pi / 2, nu + 1)
    s = np.sin(th)  # más muestras cerca de las puntas
    p = 6.0
    hw = (W / 2) * np.clip(1 - np.abs(s) ** p, 0, 1) ** (1 / p)
    k = np.clip((np.abs(s) - 0.62) / 0.38, 0, 1)
    y_base = 0.055 * k**2
    t = np.linspace(-1, 1, nv + 1)
    X = np.repeat((s * L / 2)[:, None], nv + 1, 1)
    Z = hw[:, None] * t[None, :]
    Ym = y_base[:, None] + 0.007 * (t**2)[None, :]

    def idx(i, j):
        return i * (nv + 1) + j

    top_v = np.stack([X, Ym + T / 2, Z], -1).reshape(-1, 3)
    bot_v = np.stack([X, Ym - T / 2, Z], -1).reshape(-1, 3)
    n = len(top_v)

    top_f, bot_f, sl_f, sr_f = [], [], [], []
    for i in range(nu):
        for j in range(nv):
            a, b, c, d = idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)
            top_f += [(a, d, c), (a, c, b)]  # normal +Y
            bot_f += [(a, c, d), (a, b, c)]  # normal -Y
        a, b = idx(i, 0), idx(i + 1, 0)  # canto z-
        sl_f += [(a, b, n + b), (a, n + b, n + a)]
        a, b = idx(i, nv), idx(i + 1, nv)  # canto z+
        sr_f += [(a, n + b, b), (a, n + a, n + b)]
    return top_v, bot_v, np.array(top_f), np.array(bot_f), np.array(sl_f), np.array(sr_f), n


def construir_deck(img_deck):
    top_v, bot_v, top_f, bot_f, sl_f, sr_f, n = superficies_deck()
    # Vértices separados por cara para que el sombreado no se "derrita" en los cantos.
    verts = np.vstack([top_v, bot_v])
    faces = np.vstack([top_f, bot_f + 0, sl_f, sr_f])
    # bot_f usa índices de la malla superior: los movemos a la mitad inferior
    bot_f2 = bot_f + n
    faces = np.vstack([top_f, bot_f2, sl_f, sr_f])
    # caras laterales: duplicamos vértices para normales limpias
    lado = trimesh.Trimesh(verts, np.vstack([sl_f, sr_f]), process=False)
    lado.remove_unreferenced_vertices()
    cuerpo = trimesh.Trimesh(verts, np.vstack([top_f, bot_f2]), process=False)
    cuerpo.remove_unreferenced_vertices()
    deck = trimesh.util.concatenate([cuerpo, lado])
    uv = np.column_stack([deck.vertices[:, 0] / L + 0.5, deck.vertices[:, 2] / W + 0.5])
    deck.visual = TextureVisuals(
        uv=uv,
        material=PBRMaterial(name="DeckGrafico", baseColorTexture=img_deck, metallicFactor=0.0, roughnessFactor=0.55),
    )
    # Lija (grip): la superficie superior, levantada 1.5 mm
    grip = trimesh.Trimesh(top_v + [0, 0.0015, 0], top_f, process=False)
    grip.visual = TextureVisuals(
        uv=np.zeros((len(grip.vertices), 2)),
        material=PBRMaterial(name="Grip", baseColorFactor=[0.09, 0.09, 0.10, 1.0], metallicFactor=0.0, roughnessFactor=0.95),
    )
    return deck, grip


def con_material(mesh, nombre, color, metal, rugosidad):
    mesh.visual = TextureVisuals(
        uv=np.zeros((len(mesh.vertices), 2)),
        material=PBRMaterial(name=nombre, baseColorFactor=color, metallicFactor=metal, roughnessFactor=rugosidad),
    )
    return mesh


def construir_truck():
    base = trimesh.creation.box(extents=[0.075, 0.003, 0.05])
    base.apply_translation([0, -0.0075, 0])
    hanger = trimesh.creation.box(extents=[0.05, 0.026, 0.11])
    hanger.apply_translation([0, -0.0225, 0])
    eje = trimesh.creation.cylinder(radius=0.0055, height=0.2, sections=16)  # eje a lo largo de Z
    eje.apply_translation([0, -0.034, 0])
    truck = trimesh.util.concatenate([base, hanger, eje])
    return con_material(truck, "MetalTruck", [0.78, 0.80, 0.83, 1.0], 1.0, 0.32)


def construir_rueda():
    rueda = trimesh.creation.cylinder(radius=0.027, height=0.031, sections=40)  # eje a lo largo de Z
    return con_material(rueda, "Uretano", [1.0, 0.82, 0.24, 1.0], 0.0, 0.42)


def modelo():
    img_deck = Image.open(TEX / "deck-a.png")
    deck, grip = construir_deck(img_deck)
    escena = trimesh.Scene()
    escena.add_geometry(deck, node_name="Deck", geom_name="Deck")
    escena.add_geometry(grip, node_name="Grip", geom_name="Grip")
    truck = construir_truck()
    for nombre, x in (("Truck_Front", 0.22), ("Truck_Rear", -0.22)):
        escena.add_geometry(truck, node_name=nombre, geom_name=nombre, transform=trimesh.transformations.translation_matrix([x, 0, 0]))
    rueda = construir_rueda()
    for nombre, x, z in (("Wheel_FL", 0.22, -0.078), ("Wheel_FR", 0.22, 0.078), ("Wheel_RL", -0.22, -0.078), ("Wheel_RR", -0.22, 0.078)):
        escena.add_geometry(rueda, node_name=nombre, geom_name=nombre, transform=trimesh.transformations.translation_matrix([x, -0.034, z]))
    glb = escena.export(file_type="glb")
    (MOD / "skateboard.glb").write_bytes(glb)
    return deck


def verificar(deck):
    nrm = deck.face_normals
    print("  deck: caras", len(deck.faces), "| vértices", len(deck.vertices))
    print("  normales: media Y de la mitad superior =", round(float(nrm[: len(nrm) // 4][:, 1].mean()), 3))


if __name__ == "__main__":
    concreto()
    madera()
    decks()
    matcap_cromo()
    d = modelo()
    verificar(d)
    for p in sorted(list(TEX.iterdir()) + list(MOD.iterdir())):
        print(f"  {p.relative_to(RAIZ)}  {p.stat().st_size / 1024:.0f} KB")
