function calcular() {
    let ingresos = document.querySelectorAll('.input-ingreso');
    let gastos = document.querySelectorAll('.input-gasto');

    let totalIngresos = 0;
    ingresos.forEach(input => {
        totalIngresos += parseFloat(input.value) || 0;
    });

    let totalGastos = 0;
    gastos.forEach(input => {
        totalGastos += parseFloat(input.value) || 0;
    });

    let balance = totalIngresos - totalGastos;

    document.getElementById('total-ingresos').innerText = `$${totalIngresos.toFixed(2)}`;
    document.getElementById('total-gastos').innerText = `$${totalGastos.toFixed(2)}`;
    document.getElementById('balance-total').innerText = `$${balance.toFixed(2)}`;
}