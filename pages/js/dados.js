const dados = [
    {
        data: "2026-09-15",
        hora: "10:45",
        preco: "R$ 30,00",
        "evento-novo": "Musicais"
    },
    {
        data: "2026-09-16",
        hora: "14:30",
        preco: "R$ 50,00",
        "evento-novo": "Teatro"
    },
    {
        data: "2026-09-17",
        hora: "19:00",
        preco: "R$ 70,00",
        "evento-novo": "Cinema"
    },
    {
        data: "2026-09-18",
        hora: "20:00",
        preco: "R$ 90,00",
        "evento-novo": "Stand-up Comedy"
    },
];

const eventos = document.getElementById(".banner-novo");
const pesquisaInput = document.getElementById("#pesquisa");

const displayEventos = (dados) => {
    eventos.innerHTML = "";
    dados.forEach(e => {
        eventos.innerHTML += `
            <div class="banner-novo">
                <h5 class="data">${e.data}</h5>
                <h5 class="hora">${e.hora}</h5>
                <h6 class="preco">${e.preco}</h6>
                <h2 class="evento-novo">${e["evento-novo"]}</h2>
            </div>
        `;
    })
}

pesquisaInput.addEventListener("input", (e) => {
    const pesquisa = e.target.value.toLowerCase();
    const eventosFiltrados = dados.filter(e => e["evento-novo"].toLowerCase().includes(pesquisa));
    displayEventos(eventosFiltrados);
});

window.addEventListener("load", displayEventos.bind(null, dados));