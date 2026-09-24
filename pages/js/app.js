// ==================== CALENDÁRIO ====================

const agenda = document.getElementById("agenda");
const calendario = document.querySelector(".calendar");
const fechar = document.getElementById("fechar");

agenda?.addEventListener("click", e => {
    e.preventDefault();
    calendario.style.display = "block";
});

fechar?.addEventListener("click", () => {
    calendario.style.display = "none";
});

const mesAno = document.getElementById("mes-ano");
const dias = document.getElementById("dias-calendario");
const eventos = document.getElementById("eventos");
const btnAnterior = document.getElementById("btn-anterior");
const btnProximo = document.getElementById("btn-proximo");

let data = new Date();
let ano = data.getFullYear();
let mes = data.getMonth();

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
];

const formatarData = data => data.split("-").reverse().join("/");

const eventosCalendario = {};
dados.forEach(e => eventosCalendario[e.data] = e["evento-novo"]);

function carregarCalendario() {
    if (!mesAno || !dias) return;

    mesAno.textContent = `${meses[mes]} de ${ano}`;
    dias.innerHTML = "";

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < primeiroDia; i++)
        dias.innerHTML += "<div></div>";

    for (let dia = 1; dia <= ultimoDia; dia++) {
        const dataCompleta =
            `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        const elemento = document.createElement("div");
        elemento.textContent = dia;

        if (eventosCalendario[dataCompleta])
            elemento.classList.add("evento");

        elemento.onclick = () => clicarDia(dataCompleta);
        dias.appendChild(elemento);
    }
}

function clicarDia(data) {
    if (eventosCalendario[data]) {
        eventos.textContent =
            `Evento em ${formatarData(data)}: ${eventosCalendario[data]}`;
        return;
    }

    const novoEvento = prompt(
        `Adicionar evento para ${formatarData(data)}:`
    );

    if (!novoEvento) return;

    eventosCalendario[data] = novoEvento;
    carregarCalendario();

    eventos.textContent =
        `Evento em ${formatarData(data)}: ${novoEvento}`;
}

btnAnterior?.addEventListener("click", () => {
    if (--mes < 0) {
        mes = 11;
        ano--;
    }
    carregarCalendario();
});

btnProximo?.addEventListener("click", () => {
    if (++mes > 11) {
        mes = 0;
        ano++;
    }
    carregarCalendario();
});

carregarCalendario();


// ==================== LISTA DE EVENTOS ====================

const listaEventos = document.getElementById("lista-eventos");
const pesquisa = document.getElementById("pesquisa");
const btnPesquisa = document.getElementById("btn-pesquisa");
const select = document.getElementById("categorias");

function mostrarEventos(lista) {
    if (!listaEventos) return;

    listaEventos.innerHTML = lista.length
        ? lista.map(evento => `
            <div class="banner-novo">
                <img src="${evento.imagem}" alt="${evento["evento-novo"]}">
                <h5 class="data">${formatarData(evento.data)}</h5>
                <h5 class="hora">${evento.hora}</h5>
                <h6 class="preco">${evento.preco}</h6>
                <h2 class="evento-novo">${evento["evento-novo"]}</h2>
                <button class="btn-saiba-mais" data-id="${evento.id}">
                    Saiba mais
                </button>
            </div>
        `).join("")
        : "<p>Nenhum evento encontrado.</p>";
}

function pesquisar() {
    const texto = pesquisa.value.toLowerCase();

    mostrarEventos(
        dados.filter(e =>
            e["evento-novo"].toLowerCase().includes(texto)
        )
    );
}

btnPesquisa?.addEventListener("click", pesquisar);
pesquisa?.addEventListener("input", pesquisar);

select?.addEventListener("change", () => {
    const categoria = select.value;

    mostrarEventos(
        categoria === "Todas"
            ? dados
            : dados.filter(e => e.categoria === categoria)
    );
});

listaEventos?.addEventListener("click", e => {
    if (!e.target.classList.contains("btn-saiba-mais")) return;

    const evento = dados.find(
        item => item.id === Number(e.target.dataset.id)
    );

    if (evento) mostrarDetalhes(evento);
});

mostrarEventos(dados);


// ==================== DETALHES ====================

function mostrarDetalhes(evento) {
    document.getElementById("detalhes-titulo").textContent = evento["evento-novo"];
    document.getElementById("detalhes-imagem").src = evento.imagem;
    document.getElementById("detalhes-descricao").textContent = evento.detalhes;
    document.getElementById("detalhes-data").textContent = formatarData(evento.data);
    document.getElementById("detalhes-hora").textContent = evento.hora;
    document.getElementById("detalhes-preco").textContent = evento.preco;
    document.getElementById("detalhes-vagas").textContent = evento.vaga;

    const favorito = document.getElementById("btn-favorito");

    if (favorito) {
        favorito.dataset.id = evento.id;
        favorito.checked = verificarFavorito(evento.id);
    }

    document.getElementById("detalhes-evento").style.display = "block";
}

document.getElementById("btn-fechar-detalhes")?.addEventListener("click", () => {
    document.getElementById("detalhes-evento").style.display = "none";
});


// ==================== FAVORITOS ====================

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const salvarFavoritos = () =>
    localStorage.setItem("favoritos", JSON.stringify(favoritos));

const verificarFavorito = id => favoritos.includes(id);

function favoritar(id) {
    favoritos = favoritos.includes(id)
        ? favoritos.filter(f => f !== id)
        : [...favoritos, id];

    salvarFavoritos();
}

const btnFavorito = document.getElementById("btn-favorito");

btnFavorito?.addEventListener("change", function () {
    favoritar(Number(this.dataset.id));
});


// ==================== PÁGINA DE FAVORITOS ====================

const listaFavoritos = document.getElementById("lista-favoritos");

if (listaFavoritos) {
    const eventosFavoritos = dados.filter(e => favoritos.includes(e.id));

    listaFavoritos.innerHTML = eventosFavoritos.length
        ? eventosFavoritos.map(evento => `
            <div class="banner-novo">
                <img src="${evento.imagem}" alt="${evento["evento-novo"]}">
                <h5>${formatarData(evento.data)}</h5>
                <h5>${evento.hora}</h5>
                <h6>${evento.preco}</h6>
                <h2>${evento["evento-novo"]}</h2>
            </div>
        `).join("")
        : "<p>Nenhum evento favoritado.</p>";
}
