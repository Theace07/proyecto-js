function jugarppt() {
  alert(
    "Bienvenido a un clasico juego de piedra papel o tijera, Al primero de 3 rondas gana el juego"
  );
  let userName=prompt("Cual es tu nombre?");
  let userConfirm = confirm(`Hola ${userName}, estas listo para jugar?`);
  let userpoints = 0;
  let computepoints = 0;
  const opciones = ["piedra", "papel", "tijera"];
  while (userpoints < 3 && computepoints < 3) {
    const userOption = prompt("Elige piedra, papel o tijera");
    if (!userOption) {
      alert("Juego terminado");
      return;
    }
    const userSelection = userOption.toLowerCase();
    console.log(userSelection);
    if (!opciones.includes(userSelection)) {
      alert("Opcion no valida, intentelo otra vez");
      continue;
    }
    const computerSelection =opciones[Math.floor(Math.random() * 3)];
    alert("La computadora eligió: " + computerSelection);
    if (userSelection === computerSelection) {
      alert("Empate");
    } else if (
      (userSelection === "piedra" && computerSelection === "tijera") ||
      (userSelection === "papel" && computerSelection === "piedra") ||
      (userSelection === "tijera" && computerSelection === "papel")
    ) {
      alert("Ganaste esta ronda");
      userpoints++;
    } else {
      alert("Perdiste esta ronda");
      computepoints++;
    }
    alert( `Puntuacion: ${userName}: ${userpoints} - Cpu: ${computepoints}`  );
  }
    if (userpoints === 3) {
    alert(`Felicidades ${userName}, ganaste el juego!`);
    } else {
    alert("Lo siento, la computadora ganó el juego.");
    }
    confirm("Quieres jugar otra vez?") ? jugarppt() : alert("Gracias por jugar!");
}
jugarppt();
