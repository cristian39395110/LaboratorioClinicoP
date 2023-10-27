document.addEventListener("DOMContentLoaded", function () {
    const cerrarSesionButton = document.getElementById("cerrar-sesion");
  
    cerrarSesionButton.addEventListener("click", function () {
      if (confirm("¿Desea cerrar la sesión?")) {
        alert("Sesión cerrada");
        window.location.href = "http://localhost:3000";
      }
    });
  });