  formu.addEventListener("click", (e) => {
    const campoEnfocado = e.target;

    if (campoEnfocado.id === "usuario") {
      const p = document.getElementById("errorEmail");
      if (p) p.remove();
    } else if (campoEnfocado.id === "contrasena") {
      const p = document.getElementById("errorPass");
      if (p) p.remove();
    }
  });
