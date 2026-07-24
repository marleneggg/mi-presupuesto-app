let myChart = null;

document.addEventListener("DOMContentLoaded", () => {
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

    let fmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

    document.getElementById('total-ingresos').innerText = fmt.format(totalIngresos);
    document.getElementById('total-gastos').innerText = fmt.format(totalGastos);
    document.getElementById('total-balance').innerText = fmt.format(balance);

    let statusTag = document.getElementById('status-tag');
    if (balance >= 0) {
        statusTag.innerText = '✓ Balance al día';
        statusTag.style.color = '#16a34a';
    } else {
        statusTag.innerText = '⚠️ Déficit en presupuesto';
        statusTag.style.color = '#dc2626';
    }

    // Actualizar Subtotales y Porcentajes por categoría
    let tarjetasGastos = document.querySelectorAll('.categoria-box[data-cat]');
    tarjetasGastos.forEach(tarjeta => {
        let catNombre = tarjeta.getAttribute('data-cat');
        let sumaCat = gastosPorCategoria[catNombre] || 0;
        
        let subEl = document.getElementById(`sub-${catNombre}`);
        let pctEl = document.getElementById(`pct-${catNombre}`);

        if (subEl) subEl.innerText = fmt.format(sumaCat);
        
        if (pctEl) {
            let pct = totalIngresos > 0 ? Math.round((sumaCat / totalIngresos) * 100) : 0;
            pctEl.innerText = `${pct}% del ingreso`;
        }
    });

    actualizarGrafica(gastosPorCategoria);
    guardarDatos();
}

function agregarCampo(idGrupo, claseInput, categoria = '') {
    let grupo = document.getElementById(idGrupo);
    let nuevaFila = document.createElement('div');
    nuevaFila.className = 'input-row';
    
    let attrCat = categoria ? `data-cat="${categoria}"` : '';

    nuevaFila.innerHTML = `
        <input type="text" placeholder="Nuevo..." style="font-size:0.88rem;">
        <span class="symbol">$</span>
        <input type="number" class="${claseInput}" ${attrCat} placeholder="0" oninput="calcular()">
        <button class="btn-remove" onclick="eliminarFila(this)">✕</button>
    `;
    
    grupo.appendChild(nuevaFila);
}

function eliminarFila(boton) {
    boton.parentElement.remove();
    calcular();
}

function inicializarGrafica() {
    const ctx = document.getElementById('gastosChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                // Tonos pastel: Morados y Azules
                backgroundColor: ['#c4b5fd', '#93c5fd', '#a78bfa', '#60a5fa', '#ddd6fe', '#bfdbfe', '#818cf8', '#a5b4fc', '#c7d2fe']
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

function guardarDatos() {
    let datos = [];
    document.querySelectorAll('input[type="number"]').forEach((input) => {
        datos.push(input.value);
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
    if (confirm("¿Segura que deseas reiniciar el formato y borrar los valores?")) {
        localStorage.clear();
        document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
        calcular();
    }
}
