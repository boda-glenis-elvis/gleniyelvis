# Invitación de Boda Web - Glenis & Elvis 💍✨

Página web interactiva y elegante diseñada para la boda de **Glenis & Elvis** el **14 de Noviembre de 2026** en Cusco, Perú.

---

## 🌟 Características Incluidas

1. **Sobre de Bienvenida Interactivo:** Experiencia de apertura con sello de lacre dorado con las iniciales `G & E`.
2. **Cuenta Regresiva en Vivo:** Cálculo dinámico de días, horas, minutos y segundos hasta el 14 de noviembre de 2026 a las 11:30 AM.
3. **Música de Fondo:** Reproductor flotante con melodía romántica y sintetizador armónico ambiental.
4. **Ceremonia Religiosa:**
   - Lugar: Convento de La Merced (Calle Mantas 121, frente a Plazoleta Espinar, Cusco).
   - Hora: 11:30 A.M.
   - Enlace directo a Google Maps y Waze.
5. **Recepción & Fiesta:**
   - Lugar: Villa Novios Saylla - Cusco.
   - Hora: 14:00 P.M. (2:00 P.M.).
   - Enlace directo a Google Maps y Waze.
6. **Agendar Evento:**
   - Botón directo para "Agregar a Google Calendar".
   - Botón para descargar archivo de calendario `.ics` (compatible con iPhone, iPad, Mac y Outlook).
7. **Itinerario Paso a Paso:** Cronograma elegante con iconos ilustrativos.
8. **Código de Vestimenta (Dress Code):** Estilo Formal/Elegante con paleta sugerida y recordatorio del blanco para la novia.
9. **Mesa de Regalos / Lluvia de Sobres:**
   - Cuentas de banco (BCP) y billeteras digitales (Yape / Plin).
   - Botones con función de **copiado rápido al portapapeles con 1 solo toque**.
10. **Galería de Recuerdos:** Cuadrícula de fotos con diseño romántico.
11. **Confirmación de Asistencia (RSVP) por WhatsApp:**
    - Formulario con nombre, asistencia (Sí/No), número de pases, canción para la fiesta y dedicatoria.
    - Envío automático de mensaje formateado a WhatsApp con animación de lluvia de confeti.

---

## 🛠️ Cómo Personalizar la Información

### 1. Cambiar el número de WhatsApp para recibir las confirmaciones
Abre el archivo `app.js` y busca en la primera línea:
```javascript
const WEDDING_CONFIG = {
  brideName: "Glenis",
  groomName: "Elvis",
  weddingDate: new Date("2026-11-14T11:30:00-05:00"),
  whatsappNumber: "51987654321", // <-- Coloca aquí tu número con código de país (ejemplo: 51 para Perú)
  ...
};
```

### 2. Cambiar los números de cuenta bancaria o Yape
Abre `index.html` y busca la sección `<!-- SECCIÓN MESA DE REGALOS / LLUVIA DE SOBRES -->`. Puedes editar los números de cuenta y el número de Yape/Plin según tus datos reales.

### 3. Cambiar las fotos de la galería
En `index.html`, dentro de `<!-- SECCIÓN GALERÍA DE RECUERDOS -->`, puedes reemplazar los enlaces `src="..."` de las etiquetas `<img>` con tus propias fotos (puedes crear una carpeta llamada `fotos/` y colocar ahí tus archivos como `foto1.jpg`, `foto2.jpg`, etc.).

---

## 🚀 Cómo Visualizar la Web

Solo haz doble clic en el archivo `index.html` para abrirlo en cualquier navegador (Google Chrome, Safari, Edge, Firefox, o en el navegador de tu celular).
