document.getElementById("formConsulta").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  console.log("Enviando:", data);

  try {
    const res = await fetch("http://localhost:3000/consultas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    alert("Consulta guardada");
  } catch (error) {
    console.error(error);
    alert("Error al guardar");
  }
});
