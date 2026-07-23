function calcular() {
    let inputsIngresos = document.querySelectorAll('.in-ingreso');
    let inputsGastos = document.querySelectorAll('.in-gasto');

    let totalIngresos = 0;
    inputsIngresos.forEach(input => {
        totalIngresos += parseFloat(input.value) || 0;
    });

    let totalGastos = 0;
    inputsGastos.forEach(input => {
        totalGastos += parseFloat(input.value) || 0;
    });

    let balance = totalIngresos - totalGastos;

    // Formatear a moneda con comas
    let fmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

    document.getElementById('total-ingresos').innerText = fmt.format(totalIngresos);
    document.getElementById('subtotal-ingresos').innerText = fmt.format(totalIngresos);
    document.getElementById('total-gastos').innerText = fmt.format(totalGastos);
    document.getElementById('total-balance').innerText = fmt.format(balance);

    let statusTag = document.getElementById('status-tag');
    if (balance >= 0) {
        statusTag.innerText = '✓ Te queda dinero a favor';
        statusTag.style.color = '#2e7d32';
    } else {
        statusTag.innerText = '⚠️ Estás gastando más de lo que ingresas';
        statusTag.style.color = '#c62828';
    }
}
