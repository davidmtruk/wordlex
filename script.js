document.addEventListener("DOMContentLoaded", function() {
    const PALABRA = "APPLE";
    const button = document.getElementById("guess-button");
    let numIntentos = 6;

    button.addEventListener("click", () => {
        let intento = leerIntento();
        finalJuego(intento);
        if(intento.length === PALABRA.length) {
            for (let i in PALABRA){
                if(PALABRA[i]===intento[i]){
                    console.log(intento[i],"verde");
                } else if(PALABRA.includes(intento[i])){
                    console.log(intento[i],"amarillo");
                } else {
                    console.log(intento[i],"gris");
                }
            }
        } else {
            console.log("El intento y la palabra deben tener la misma longitud");
        }
    });

    function leerIntento(){
        const input = document.getElementById("guess-input");
        const valor = input.value.toUpperCase();
        return valor;
    }

    function finalJuego(intento){
        if(PALABRA === intento){
            alert("Ganaste");
        } else {
            numIntentos--;
            if(numIntentos === 0){
                alert("Perdiste");
            }
        }
    }
});