const preguntas = [
    {
        id: 1,
        enunciado: "Futbolista que ha ganado el Balón de Oro",
        respuestas: [
            { nombre: "Lionel Messi", alias: ["messi", "lionel messi", "leo messi"], popularidad: 95 },
            { nombre: "Cristiano Ronaldo", alias: ["cristiano", "cristiano ronaldo", "cr7"], popularidad: 92 },
            { nombre: "Luka Modrić", alias: ["modric", "luka modric"], popularidad: 60 },
            { nombre: "Kaká", alias: ["kaka", "ricardo kaka"], popularidad: 45 },
            { nombre: "George Weah", alias: ["weah", "george weah"], popularidad: 12 },
            { nombre: "Allan Simonsen", alias: ["simonsen", "allan simonsen"], popularidad: 3 },
            { nombre: "Josef Masopust", alias: ["masopust", "josef masopust"], popularidad: 1 }
        ]
    },
    {
        id: 2,
        enunciado: "Equipos que han ganado la UEFA Champions League / Copa de Europa",
        respuestas: [
            { nombre: "Real Madrid", alias: ["real madrid", "madrid"], popularidad: 98 },
            { nombre: "FC Barcelona", alias: ["barcelona", "barca", "fc barcelona"], popularidad: 88 },
            { nombre: "Nottingham Forest", alias: ["nottingham", "nottingham forest"], popularidad: 15 },
            { nombre: "Steaua de Bucarest", alias: ["steaua", "steaua bucarest"], popularidad: 5 },
            { nombre: "Estrella Roja", alias: ["estrella roja", "crvena zvezda", "red star"], popularidad: 8 }
        ]
    }
];

let indicePregunta = 0;
let puntuacionTotal = 0;
let acertadasEnPregunta = new Set();

const questionTitle = document.getElementById("question-title");
const userInput = document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");
const feedbackMessage = document.getElementById("feedback-message");
const scoreEl = document.getElementById("score");
const correctList = document.getElementById("correct-list");
const questionCounter = document.getElementById("question-counter");
const nextBtn = document.getElementById("next-btn");

function cargarPregunta() {
    const actual = preguntas[indicePregunta];
    questionTitle.textContent = actual.enunciado;
    questionCounter.textContent = `Pregunta ${indicePregunta + 1} de ${preguntas.length}`;
    feedbackMessage.textContent = "";
    feedbackMessage.className = "feedback";
    userInput.value = "";
    correctList.innerHTML = "";
    acertadasEnPregunta.clear();
    nextBtn.classList.add("hidden");
}

function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function comprobarRespuesta() {
    const valor = normalizar(userInput.value);
    if (!valor) return;

    const actual = preguntas[indicePregunta];
    const encontrado = actual.respuestas.find(r => r.alias.some(a => normalizar(a) === valor));

    if (!encontrado) {
        feedbackMessage.textContent = "❌ Incorrecto o no figura en los registros de esta categoría.";
        feedbackMessage.className = "feedback error";
        return;
    }

    if (acertadasEnPregunta.has(encontrado.nombre)) {
        feedbackMessage.textContent = "⚠️ ¡Ya habías dado esta respuesta!";
        feedbackMessage.className = "feedback error";
        return;
    }

    acertadasEnPregunta.add(encontrado.nombre);
    
    // Fórmula de rareza inversa: menor popularidad = más puntos
    const puntosObtenidos = (100 - encontrado.popularidad) + 10;
    puntuacionTotal += puntosObtenidos;
    scoreEl.textContent = puntuacionTotal;

    feedbackMessage.textContent = `🎉 ¡Correcto! ${encontrado.nombre} (Rareza: ${encontrado.popularidad}%) -> +${puntosObtenidos} pts`;
    feedbackMessage.className = "feedback success";

    const li = document.createElement("li");
    li.innerHTML = `<span>${encontrado.nombre}</span> <strong>+${puntosObtenidos} pts</strong>`;
    correctList.appendChild(li);
    userInput.value = "";

    // Si ya acertó todas o queremos permitir avanzar
    if (acertadasEnPregunta.size >= 2) {
        nextBtn.classList.remove("hidden");
    }
}

submitBtn.addEventListener("click", comprobarRespuesta);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") comprobarRespuesta();
});

nextBtn.addEventListener("click", () => {
    indicePregunta++;
    if (indicePregunta < preguntas.length) {
        cargarPregunta();
    } else {
        questionTitle.textContent = "🏆 ¡Juego completado!";
        userInput.style.display = "none";
        submitBtn.style.display = "none";
        nextBtn.style.display = "none";
        feedbackMessage.textContent = `Has terminado con una puntuación final de ${puntuacionTotal} puntos. ¡Impresionante cultura futbolística!`;
        feedbackMessage.className = "feedback success";
    }
});

cargarPregunta();