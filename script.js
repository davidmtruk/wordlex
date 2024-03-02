document.addEventListener("DOMContentLoaded", function() {
    const contenedorWordle = document.getElementById("wordle-container");
    const resultDisplay = document.getElementById("result");
    const input = document.getElementById("guess-input");
    const keyboard = document.getElementById("keyboard");
    let intentos = 5;
    let palabraSecreta = "";

    // Función para obtener palabras aleatorias de 4 a 6 letras desde el API
    async function obtenerPalabra() {
        try {
            const longitud = Math.floor(Math.random() * 3) + 4; // Genera un número aleatorio entre 4 y 6
            const response = await fetch(`https://random-word-api.herokuapp.com/word?number=1&length=${longitud}`);
            if (!response.ok) {
                throw new Error("Error al obtener la palabra aleatoria");
            }
            const data = await response.json();
            return data[0].toUpperCase(); // Convertimos la palabra a mayúsculas
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    // Función para mostrar la palabra a adivinar
    async function mostrarPalabra() {
        palabraSecreta = await obtenerPalabra();
        if (palabraSecreta) {
            palabraSecreta.split("").forEach(letra => {
                const letterDiv = document.createElement("div");
                letterDiv.textContent = letra;
                letterDiv.classList.add("letter", "hidden");
                contenedorWordle.appendChild(letterDiv);
            });
        } else {
            resultDisplay.textContent = "Error al obtener la palabra. Por favor, inténtalo de nuevo.";
            resultDisplay.style.color = "red";
        }
    }

    mostrarPalabra();

    // Letras del teclado organizadas como un teclado QWERTY
    const qwertyLetters = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Z", "X", "C", "V", "B", "N", "M", "⌫"]
    ];

    // Generar teclado virtual
    qwertyLetters.forEach(rowLetters => {
        const row = document.createElement("div");
        row.classList.add("keyboard-row");
        rowLetters.forEach(letter => {
            const button = document.createElement("button");
            button.textContent = letter;
            button.classList.add("keyboard-btn");
            button.addEventListener("click", function() {
                input.value += letter;
            });
            row.appendChild(button);
        });
        keyboard.appendChild(row);
    });

    // Event listener para el botón de verificar
    document.getElementById("check-btn").addEventListener("click", function() {
        const conjetura = input.value.toUpperCase();
        if (conjetura.length < 4 || conjetura.length > 6 || !/^[A-Z]+$/.test(conjetura)) {
            alert("¡Entrada inválida! Por favor, ingresa una palabra de 4 a 6 letras.");
            return;
        }

        const letrasConjetura = conjetura.split("");
        const letrasPalabraSecreta = palabraSecreta.split("");

        // Inicializamos los arrays para el resultado
        const resultado = new Array(letrasConjetura.length).fill("gray");

        // Verificamos las letras en su posición
        for (let i = 0; i < letrasConjetura.length; i++) {
            if (letrasConjetura[i] === letrasPalabraSecreta[i]) {
                resultado[i] = "green"; // Letra correcta en su lugar
            }
        }

       
        for (let i = 0; i < letrasConjetura.length; i++) {
            if (resultado[i] !== "green") {
                const index = letrasPalabraSecreta.indexOf(letrasConjetura[i]);
                if (index !== -1 && index !== i) {
                    resultado[i] = "yellow"; // Letra correcta pero no en su lugar
                }
            }
        }

      
        contenedorWordle.innerHTML = "";
        resultado.forEach((color, i) => {
            const letterDiv = document.createElement("div");
            letterDiv.textContent = letrasConjetura[i];
            letterDiv.classList.add("letter");
            letterDiv.style.backgroundColor = color;
            contenedorWordle.appendChild(letterDiv);
        });

       
        intentos--;
        if (intentos === 0) {
            resultDisplay.textContent = `¡Perdiste! La palabra era: ${palabraSecreta}`;
            resultDisplay.style.color = "red";
            document.getElementById("check-btn").disabled = true;
        } else {
            resultDisplay.textContent = `Te quedan ${intentos} intentos`;
            resultDisplay.style.color = "black";
        }

       
        input.value = "";
    });
});
