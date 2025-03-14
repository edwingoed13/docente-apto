document.addEventListener('DOMContentLoaded', function () {
    generarCaptcha(); // Generar el CAPTCHA al cargar la página
});

function generarCaptcha() {
    const num = Math.floor(Math.random() * 9000) + 1000; // Número aleatorio de 4 dígitos
    document.getElementById('captchaText').innerText = num; // Mostrar el número en el HTML
    return num;
}

let captcha = generarCaptcha(); // Guardar el CAPTCHA generado

function consultarEstado() {
    const dni = document.getElementById('dni').value;
    const captchaInput = document.getElementById('captchaInput').value;
    const resultadoDiv = document.getElementById('resultado');

    // Validar CAPTCHA
    if (captchaInput != captcha) {
        alert('CAPTCHA incorrecto. Intenta de nuevo.');
        captcha = generarCaptcha(); // Generar un nuevo CAPTCHA
        return;
    }

    fetch('https://consulta-back-docente-2025.onrender.com/api/datos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los datos desde el servidor.');
            }
            return response.json();
        })
        .then(data => {
            const usuario = data.find(user => user.nro_documento === dni);
            if (usuario) {
                if (usuario.Estado === "Apto") {
                    resultadoDiv.innerHTML = `
                        <p>Nombre: <strong>${usuario.Nombres_y_Apellidos}</strong></p>
                        <p>Estado: <strong>${usuario.Estado}</strong></p>
                        <p>Asignación de carga horaria será paulatinamente mientras los estudiantes se vayan inscribiendo al nuevo ciclo del CEPREUNA. No todos los APTO tendrán carga horaria inmediatamente, pero son elegibles para ello.</p>
                    `;
                } else {
                    resultadoDiv.innerHTML = `
                        <p>Nombre: <strong>${usuario.Nombres_y_Apellidos}</strong></p>
                        <p>Estado: <strong>${usuario.Estado}</strong></p>
                        <p>Gracias por tu participación en el proceso de convocatoria.</p>
                    `;
                }
            } else {
                resultadoDiv.innerHTML = `<p>Error: El DNI no existe.</p>`;
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos desde el servidor:', error);
            resultadoDiv.innerHTML = `<p>Error: No se pudo cargar la información.</p>`;
        });
}


