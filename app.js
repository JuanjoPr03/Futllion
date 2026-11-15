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
let temporizador = null;
let tiempoRestante = 20;
let respondido = false;

const questionTitle = document.getElementById("question-title");
const userInput = document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");
const feedbackMessage = document.getElementById("feedback-message");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const questionCounter = document.getElementById("question-counter");

function iniciarTemporizador() {
    tiempoRestante = 20;
    timerEl.textContent = tiempoRestante;
    respondido = false;
    
    clearInterval(temporizador);
    temporizador = setInterval(() => {
        tiempoRestante--;
        timerEl.textContent = tiempoRestante;

        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            tiempoAgotado();
        }
    }, 1000);
}

function tiempoAgotado() {
    if (respondido) return;
    respondido = true;
    userInput.disabled = true;
    submitBtn.disabled = true;

    feedbackMessage.textContent = "⏰ ¡Se acabó el tiempo! Pasando a la siguiente...";
    feedbackMessage.className = "feedback error";

    setTimeout(() => {
        siguientePregunta();
    }, 2000);
}

function cargarPregunta() {
    if (indicePregunta >= preguntas.length) {
        finalizarJuego();
        return;
    }

    const actual = preguntas[indicePregunta];
    questionTitle.textContent = actual.enunciado;
    questionCounter.textContent = `Pregunta ${indicePregunta + 1} de ${preguntas.length}`;
    feedbackMessage.textContent = "";
    feedbackMessage.className = "feedback";
    userInput.value = "";
    userInput.disabled = false;
    submitBtn.disabled = false;
    userInput.focus();

    iniciarTemporizador();
}

function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function comprobarRespuesta() {
    if (respondido) return;

    const valor = normalizar(userInput.value);
    if (!valor) return;

    respondido = true;
    clearInterval(temporizador);
    userInput.disabled = true;
    submitBtn.disabled = true;

    const actual = preguntas[indicePregunta];
    const encontrado = actual.respuestas.find(r => r.alias.some(a => normalizar(a) === valor));

    if (!encontrado) {
        feedbackMessage.textContent = "❌ Incorrecto o no figura en los registros de esta categoría. (0 pts)";
        feedbackMessage.className = "feedback error";
    } else {
        // Fórmula de rareza inversa: menor popularidad = más puntos
        const puntosObtenidos = (100 - encontrado.popularidad) + 10;
        puntuacionTotal += puntosObtenidos;
        scoreEl.textContent = puntuacionTotal;

        feedbackMessage.textContent = `🎉 ¡Correcto! ${encontrado.nombre} (Rareza: ${encontrado.popularidad}%) -> +${puntosObtenidos} pts`;
        feedbackMessage.className = "feedback success";
    }

    setTimeout(() => {
        siguientePregunta();
    }, 2500);
}

function siguientePregunta() {
    indicePregunta++;
    cargarPregunta();
}

function finalizarJuego() {
    clearInterval(temporizador);
    document.querySelector(".game-card").innerHTML = `
        <div class="question-box" style="text-align: center;">
            <h2>🏆 ¡Juego completado!</h2>
            <p style="margin-top: 15px; font-size: 1.1rem;">Tu puntuación final es:</p>
            <p style="font-size: 2.5rem; color: #38bdf8; font-weight: bold; margin: 15px 0;">${puntuacionTotal} pts</p>
            <p style="color: #94a3b8;">¡Excelente cultura futbolística!</p>
            <button onclick="location.reload()" style="margin-top: 20px; width: 100%;">Volver a jugar 🔄</button>
        </div>
    `;
}

submitBtn.addEventListener("click", comprobarRespuesta);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") comprobarRespuesta();
});

cargarPregunta();
