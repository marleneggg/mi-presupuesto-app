function inicializarGrafica() {
    const ctx = document.getElementById('gastosChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                // Tonos Pastel: Morados, Lilas, Azules Cielo y Azules Acero
                backgroundColor: ['#c4b5fd', '#93c5fd', '#a78bfa', '#60a5fa', '#ddd6fe', '#bfdbfe', '#818cf8', '#a5b4fc']
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
