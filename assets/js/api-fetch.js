console.log("JS07 - apiFetch");

const urlUser = "https://reqres.in/api/users?delay=3";
const localStorageKey = "userData";

// Obtener fecha actual en formato ISO
const getCurrentDateTime = () => new Date().toISOString();

const getUsers = () => {
  const spinner = document.getElementById("spinner"); // Controlar spinner de carga
  if (spinner) {
    spinner.style.display = "block";
  }

  const storedData = localStorage.getItem(localStorageKey);

  if (storedData) {
    // Si hay datos almacenados, verificar el tiempo transcurrido
    const { data, timestamp } = JSON.parse(storedData);
    const currentTime = getCurrentDateTime();

    const minutesElapsed = Math.floor(
      (new Date(currentTime) - new Date(timestamp)) / (1000 * 60)
    );

    if (minutesElapsed <= 1) {
      console.log("Recuperando datos del local storage"); // Si ha pasado menos de 1 minuto, usar los datos almacenados
      imprimirEnDOM(data);
      spinner.style.display = "none"; // Ocultar el spinner al cargar desde el almacenamiento local
      return;
    }
  }

  // Si pasó 1 minuto o no hay datos almacenados, realizar una nueva solicitud
  fetch(urlUser)
    .then((response) => {
      console.log("status code: " + response.status);
      return response.json();
    })
    .finally(() => {
      const spinner = document.getElementById("spinner");
      if (spinner) {
        spinner.style.display = "none"; // Ocultar el spinner al finalizar la solicitud
      }
    })
    .then((users) => {
      console.log(users);
      // Almacenar en local storage con la fecha y hora
      const newData = { data: users.data, timestamp: getCurrentDateTime() };
      localStorage.setItem(localStorageKey, JSON.stringify(newData));
      imprimirEnDOM(users.data);
    })
    .catch((error) => {
      console.log("Error en la solicitud: ");
      console.warn(error);
    });
};

function imprimirEnDOM(users) {
  const usersContainer = document.getElementById("users-container");

  const tableHeader = `
      <div class="container text-center tableHead">
        <div class="row">
          <div class="col-1"><em>ID</em></div>
          <div class="col-3"><em>Nombre</em></div>
          <div class="col-3"><em>Apellido</em></div>
          <div class="col-4"><em>Avatar</em></div>
        </div>
      </div>
    `;

  const usersHTML = users.map(
    (user) => `
      <div class="container text-center elementList">
        <div class="row">
          <div class="col-1">${user.id}</div>
          <div class="col-3">${user.first_name}</div>
          <div class="col-3">${user.last_name}</div>
          <div class="col-4"><img src="${user.avatar}" class="img-circle" alt="${user.first_name}"></div>
        </div>
    </div>
      `
  );
  usersContainer.innerHTML = tableHeader + usersHTML.join("");
}

const fetchButton = document.getElementById("fetchButton");
fetchButton.addEventListener("click", getUsers);
