const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value;
    fetch('/examenordenes?term='  + searchTerm)
  .then(response => response.json())
  .then(data => {
      // Borra los resultados anteriores
      resultsContainer.innerHTML = '';
       
      // Renderiza los nuevos resultados
      if (data.length > 0) {
        data.forEach(result => {
          const li = document.createElement('li');
          li.textContent = result.OrdenTrabajoId; // Reemplaza "OrdenTrabajoId" con el campo que deseas mostrar
          resultsContainer.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = 'No se encontraron resultados';
        resultsContainer.appendChild(li);
      }
    })
    .catch(error => {
      console.error('Error al obtener resultados: ', error);
    });
});

