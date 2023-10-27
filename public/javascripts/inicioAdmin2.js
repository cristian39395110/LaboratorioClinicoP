document.addEventListener("DOMContentLoaded", function () {
  const cerrarSesionButton = document.getElementById("cerrar-sesion");
  const contenido = document.getElementById("contenido");
  const mostrarNotificacionButton = document.getElementById("mostrar-notificacion");

  mostrarNotificacionButton.addEventListener("click", function () {
    // Crea un elemento de notificación
    const notificacion = document.createElement("div");
    notificacion.className = "alert alert-success";
    notificacion.textContent = "No hay notificaciones nuevas.";

    // Agrega la notificación al contenido
    contenido.appendChild(notificacion);

    // Borra la notificación después de unos segundos (puedes ajustar el tiempo)
    setTimeout(function () {
      notificacion.remove();
    }, 5000); // La notificación se eliminará después de 5 segundos
  });

  cerrarSesionButton.addEventListener("click", function () {
    if (confirm("¿Desea cerrar la sesión?")) {
      alert("Sesión cerrada");
      window.location.href = "http://localhost:3000";
    }
  });
});
