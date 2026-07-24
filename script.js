let myChart = null;

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Poner el mes actual por defecto
    const hoy = new Date();
    const mesFormateado = hoy.toISOString().slice(0, 7);
    document.getElementById("select-mes").value = mesFormateado;

    inicializarGrafica();
    cargarDatos();
    calcular();
});

function calcular() {
    let inputsIngresos = document.querySelectorAll('.in-ingreso');
    let inputsGastos = document.querySelectorAll('.in-gasto');

    let totalIngresos = 0;
    inputsIngresos.forEach(input => {
        totalIngresos += parseFloat(input.value) || 0;
    });

    let totalGastos = 0;
    let gastosPorCategoria = {};

    inputsGastos.forEach(input => {
        let val = parseFloat(input.value) || 0;
        totalGastos += val;

        let cat = input.getAttribute('data-cat') || 'Otros';
        gastosPorCategoria[cat] = (gastosPorCategoria[cat] || 0) + val;
    });

    let balance = totalIngresos - totalGastos;

    // Formatear Moneda
    let fmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

    document.getElementById('total-ingresos').innerText = fmt.format(totalIngresos);
    document.getElementById('total-gastos').innerText = fmt.format(totalGastos);
    document.getElementById('total-balance').innerText = fmt.format(balance);

    // Alerta de Estado
    let statusTag = document.getElementById('status-tag');
    if (balance >= 0) {
        statusTag.innerText = '✓ Te queda dinero a favor';
        statusTag.style.color = '#2e7d32';
    } else {
        statusTag.innerText = '⚠️ Estás gastando más de lo que ingresas';
        statusTag.style.color = '#c62828';
    }

    actualizarGrafica(gastosPorCategoria);
    guardarDatos();
}

function agregarCampo(idGrupo, claseInput, categoria = '') {
    let grupo = document.getElementById(idGrupo);
    let nuevaFila = document.createElement('div');
    nuevaFila.className = 'input-row';
    
    nuevaFila.innerHTML = `
        <input type="text" placeholder="Nuevo concepto..." style="font-size:0.88rem; border-bottom: 1px dashed #ccc;">
        <input type="number" class="${claseInput}" data-cat="${categoria}" placeholder="0" oninput="calcular()">
    `;
    
    grupo.appendChild(nuevaFila);
}

// Inicializar Gráfica
function inicializarGrafica() {
    const ctx = document.getElementById('gastosChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#e91e63', '#f48fb1', '#ce93d8', '#ab47bc', '#8e24aa', '#d81b60']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function actualizarGrafica(gastosPorCat) {
    if (!myChart) return;
    
    let labels = Object.keys(gastosPorCat).filter(key => gastosPorCat[key] > 0);
    let data = labels.map(key => gastosPorCat[key]);

    myChart.data.labels = labels;
    myChart.data.datasets[0].data = data;
    myChart.update();
}

// GUARDADO AUTOMÁTICO EN EL NAVEGADOR
function guardarDatos() {
    let datos = [];
    document.querySelectorAll('input').forEach((input, i) => {
        if(input.type === 'number') {
            datos.push(input.value);
        }
    });
    localStorage.setItem('presupuesto_guardado', JSON.stringify(datos));
}

function cargarDatos() {
    let datosGuardados = localStorage.getItem('presupuesto_guardado');
    if (datosGuardados) {
        let datos = JSON.parse(datosGuardados);
        let inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach((input, index) => {
            if (datos[index] !== undefined) {
                input.value = datos[index];
            }
        });
    }
}

function limpiarTodo() {
    if (confirm("¿Segura que deseas borrar todos los montos cargados?")) {
        localStorage.clear();
        document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
        calcular();
    }
}
