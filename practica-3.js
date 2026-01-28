import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// 1) EJEMPLO: reemplaza TODO lo que dice "TU_..." y "000..." con tu configuración real de Firebase.
//    Esa info la copias desde Firebase Console > Configuración de la app web.
//    No compartas esta configuración en lugares públicos si tu profe lo pide.
const firebaseConfig = {
  apiKey: "TU_API_KEY", // <- reemplazar
  authDomain: "TU_PROYECTO.firebaseapp.com", // <- reemplazar
  projectId: "TU_PROYECTO", // <- reemplazar
  storageBucket: "TU_PROYECTO.appspot.com", // <- reemplazar
  messagingSenderId: "000000000000", // <- reemplazar
  appId: "1:000000000000:web:xxxxxxxxxxxx" // <- reemplazar
};

const grupo = document.getElementById("grupo");
const btn = document.getElementById("cargar");
const tabla = document.getElementById("tabla");
const estado = document.getElementById("estado");

const placeholderTokens = ["TU_", "000000", "xxxxxxxxxxxx"];
const configIncompleta = Object.values(firebaseConfig).some((v) => {
  if (typeof v !== "string") return false;
  return placeholderTokens.some((token) => v.includes(token));
});

let db = null;
if (configIncompleta){
  estado.textContent = "Config de Firebase incompleta: reemplaza TODO en firebaseConfig.";
  btn.disabled = true;
}else{
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

async function cargarGrupo(){
  if (!db){
    estado.textContent = "No hay conexión: verifica firebaseConfig antes de cargar.";
    return;
  }
  const nombreColeccion = grupo.value;
  estado.textContent = "Cargando datos de " + nombreColeccion + "...";
  tabla.innerHTML = "";

  try{
    const snap = await getDocs(collection(db, nombreColeccion));
    if (snap.empty){
      estado.textContent = "No hay alumnos en " + nombreColeccion + ".";
      return;
    }
    snap.forEach(doc => {
      const d = doc.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.matricula ?? "-"}</td>
        <td>${d.nombre ?? "-"}</td>
        <td>${d.edad ?? "-"}</td>
        <td>${d.promedio ?? "-"}</td>
        <td>${d.activo ? "Sí" : "No"}</td>
      `;
      tabla.appendChild(tr);
    });
    estado.textContent = "Mostrando " + snap.size + " alumnos de " + nombreColeccion + ".";
  }catch(err){
    console.error(err);
    estado.textContent = "Error al leer datos. Revisa permisos y configuración.";
  }
}

btn.addEventListener("click", cargarGrupo);
