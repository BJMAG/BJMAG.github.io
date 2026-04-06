document.getElementById("formConsulta").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  console.log(data);

  await fetch("https://TU-BACKEND.onrender.com/consultas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  alert("Consulta guardada");
});
