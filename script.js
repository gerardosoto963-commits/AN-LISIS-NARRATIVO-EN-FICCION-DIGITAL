document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const form = document.querySelector("#analysisForm");
  const downloadBtn = document.querySelector("#downloadBtn");
  const storageKey = "analisis-narrativo-form";
  const entriesKey = "analisis-narrativo-entries";

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // EVENTO DE SCROLL: CAMBIO DE ALTURA DE BARRA SUPERIOR
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  });

  // ANIMACIONES VINCULADAS AL SCROLL (SCROLL-DRIVEN VIA INTERSECTION OBSERVER)
  const animatedElements = document.querySelectorAll(".typo-row, .editorial-block, .gallery-item");
  
  const scrollObserverOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px", // Se activa ligeramente antes de tocar el fondo del viewport
    threshold: 0.12
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target); // Evita repetir la animación y optimiza rendimiento
      }
    });
  }, scrollObserverOptions);

  animatedElements.forEach(element => scrollObserver.observe(element));

  // MENÚ RESPONSIVO
  menuToggle?.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      if (menuToggle) menuToggle.textContent = "☰";
    });
  });

  // PERSISTENCIA DE LA MATRIZ DE VACIADO
  function getFormData() {
    return Object.fromEntries(new FormData(form).entries());
  }

  function setFormData(data) {
    Object.entries(data).forEach(([key, value]) => {
      const field = form.elements[key];
      if (field) field.value = value;
    });
  }

  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      setFormData(JSON.parse(saved));
    } catch {
      localStorage.removeItem(storageKey);
    }
  }

  form?.addEventListener("input", () => {
    localStorage.setItem(storageKey, JSON.stringify(getFormData()));
  });

  form?.addEventListener("reset", () => {
    setTimeout(() => {
      localStorage.removeItem(storageKey);
    }, 10);
  });
// LÓGICA INTERACTIVA PARA EL DROPDOWN PERSONALIZADO
  const customDropdown = document.querySelector(".custom-dropdown");
  const dropdownTrigger = document.querySelector(".dropdown-trigger");
  const dropdownOptions = document.querySelectorAll(".dropdown-option");
  const hiddenNarrativaInput = document.querySelector("#hiddenNarrativaInput");

  // Abrir y cerrar el menú al hacer clic en el disparador
  dropdownTrigger?.addEventListener("click", (e) => {
    e.stopPropagation();
    customDropdown.classList.toggle("is-open");
  });

  // Capturar la selección de cada opción
  dropdownOptions.forEach(option => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      const value = option.getAttribute("data-value");
      
      // Actualizar el texto visible y el valor del input oculto
      if (dropdownTrigger) dropdownTrigger.textContent = option.textContent;
      if (hiddenNarrativaInput) hiddenNarrativaInput.value = value;
      
      // Forzar el evento 'input' en el formulario para que LocalStorage salve el cambio automáticamente
      form.dispatchEvent(new Event("input"));

      // Cambiar clases estéticas de selección
      dropdownOptions.forEach(opt => opt.classList.remove("is-selected"));
      option.classList.add("is-selected");
      
      // Cerrar el contenedor
      customDropdown.classList.remove("is-open");
    });
  });

  // Cerrar el menú si el usuario hace clic en cualquier otra parte de la pantalla
  document.addEventListener("click", () => {
    customDropdown?.classList.remove("is-open");
  });

  // GENERACIÓN DE INFORME TXT (ACTUALIZADO CON FUNCIÓN LÚDICO-NARRATIVA)
  downloadBtn?.addEventListener("click", () => {
    const data = getFormData();
    if (!data.ficcion) {
      alert("Por favor, ingresa al menos el nombre de la Ficción digital analizada.");
      return;
    }

    const text = `==================================================
REPORTE: ANÁLISIS NARRATIVO EN FICCIÓN DIGITAL
==================================================
Ficción digital: ${data.ficcion || "No especificado"}
Taxonomía Narrativa: ${data.narrativa || "No especificado"}

1. CRONOTOPO (Space-Time):
${data.espacio || "Sin registros."}

2. INDICIOS CARACTEROLÓGICOS Y ATMOSFÉRICOS:
${data.indicios || "Sin registros."}

3. FUNCIÓN LÚDICO-NARRATIVA:
${data.funcion_ludico_narrativa || "Sin registros."}

4. FUNCIONES NÚCLEO:
${data.nucleo || "Sin registros."}

5. FUNCIONES CATÁLISIS:
${data.catalisis || "Sin registros."}

6. MODOS DE FICCIÓN Y ALTERIDAD:
${data.modo || "Sin registros."}

--------------------------------------------------
Generado mediante la interfaz analítica de la obra.`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `analisis-${data.ficcion.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  });

  // INYECCIÓN DINÁMICA DE ENTRADAS DEL AULA
  function renderEntries() {
    const grid = document.querySelector("#entriesGrid");
    if (!grid) return;

    const defaults = [
      {
        title: "Actividad Inicial: Rompiendo el código lúdico",
        category: "Lectura multimodal",
        body: "Proponga al grupo de estudiantes observar los primeros 10 minutos de juego en Hallownest (Hollow Knight). Pida separar explícitamente lo que comunica la paleta de color ceniza de la melodía melancólica del piano y la libertad espacial del avatar.",
      },
      {
        title: "Discusión en el Aula: El bucle formal como figura literaria",
        category: "Didáctica Práctica",
        body: "Aborde las dinámicas de 'Enter the Gungeon'. ¿Cómo resignifica el alumno la repetición constante del gameplay frente al concept del mito de Sísifo o las estructuras poéticas de carácter circular? Un excelente detonador crítico.",
      },
      {
        title: "Evidencia de Evaluación Estructural",
        category: "Rúbrica de Evaluación",
        body: "Solicite a los estudiantes el vaciado estructurado de las funciones núcleo de 'Celeste'. El alumno debe argumentar por qué vencer a la propia alteridad o sombra (Badeline) constituye un nexo estructural insustituible.",
      }
    ];

    let entries = defaults;
    try {
      const custom = JSON.parse(localStorage.getItem(entriesKey) || "[]");
      if (custom.length) entries = custom;
    } catch {
      localStorage.removeItem(entriesKey);
    }

    grid.innerHTML = entries.map((entry) => `
        <div class="entry-editorial-row">
          <div class="entry-cat">${escapeHtml(entry.category || "Estudio")}</div>
          <h3>${escapeHtml(entry.title || "Sin título")}</h3>
          <p>${escapeHtml(entry.body || "")}</p>
        </div>
      `).join("");
  }

  renderEntries();

  // AUTOMATIZACIÓN DE CARRUSEL HERO
  const slides = document.querySelectorAll(".carousel-slide");
  let currentSlideIndex = 0;
  const slideIntervalTime = 5000;

  function nextSlide() {
    if (slides.length === 0) return;
    slides[currentSlideIndex].classList.remove("active");
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slides[currentSlideIndex].classList.add("active");
  }

  if (slides.length > 1) {
    setInterval(nextSlide, slideIntervalTime);
  }
});