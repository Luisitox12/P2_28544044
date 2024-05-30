function verificarCaptcha(event) {
    let response = grecaptcha.getResponse();
    if (response.length === 0) {
        console.log("Por favor, complete correctamente el captcha.");
        event.preventDefault();
    }
}
document.getElementById("formulario").addEventListener("submit", verificarCaptcha);