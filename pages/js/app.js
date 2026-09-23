// ==========================================
// 1. CALENDÁRIO
// ==========================================

const agenda = document.getElementById("agenda");
const calendario = document.querySelector(".calendar");
const fechar = document.getElementById("fechar");

if (agenda && calendario) {
    agenda.onclick = function (event) {
        event.preventDefault();
        calendario.style.display = "block";
    };
}

if (fechar && calendario) {
    fechar.onclick = function () {
        calendario.style.display = "none";
    };
}

const mesAno = document.getElementById("mes-ano");
const dias = document.getElementById("dias-calendario");
const eventosCalElm = document.getElementById("eventos");

let dataHoje = new Date();
let ano = dataHoje.getFullYear();
let mes = dataHoje.getMonth();

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
];

function formatarData(data) {
    let partes = data.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

const eventosCalendario = {};

dados.forEach(function (evento) {
    eventosCalendario[evento.data] = evento["evento-novo"];
});

function carregarCalendario() {

    if (!mesAno || !dias) return;

    mesAno.textContent = meses[mes] + " de " + ano;

    let primeiroDia = new Date(ano, mes, 1).getDay();
    let ultimoDia = new Date(ano, mes + 1, 0).getDate();

    dias.innerHTML = "";

    for (let i = 0; i < primeiroDia; i++) {
        dias.innerHTML += "<div></div>";
    }

    for (let dia = 1; dia <= ultimoDia; dia++) {

        let diaFormatado = String(dia).padStart(2, "0");
        let mesFormatado = String(mes + 1).padStart(2, "0");
        let dataCompleta = ano + "-" + mesFormatado + "-" + diaFormatado;

        let elemento = document.createElement("div");
        elemento.textContent = dia;

        if (eventosCalendario[dataCompleta]) {
            elemento.classList.add("evento");
        }

        elemento.onclick = function () {
            clicarDia(dataCompleta);
        };

        dias.appendChild(elemento);
    }
}

function clicarDia(data) {

    if (!eventosCalElm) return;

    if (eventosCalendario[data]) {
        eventosCalElm.textContent = "Evento em " + formatarData(data) + ": " + eventosCalendario[data];
        return;
    }

    let novoEvento = prompt("Adicionar evento para " + formatarData(data) + ":");

    if (novoEvento) {
        eventosCalendario[data] = novoEvento;
        carregarCalendario();
        eventosCalElm.textContent = "Evento em " + formatarData(data) + ": " + novoEvento;
    }
}

const btnAnterior = document.getElementById("btn-anterior");
if (btnAnterior) {
    btnAnterior.onclick = function () {
        mes--;
        if (mes < 0) { mes = 11; ano--; }
        carregarCalendario();
    };
}

const btnProximo = document.getElementById("btn-proximo");
if (btnProximo) {
    btnProximo.onclick = function () {
        mes++;
        if (mes > 11) { mes = 0; ano++; }
        carregarCalendario();
    };
}

carregarCalendario();


// ==========================================
// 2. RESERVAS — funções compartilhadas (localStorage)
// ==========================================

const CHAVE_RESERVAS = "reservasViva";

function obterReservas() {
    let salvo = localStorage.getItem(CHAVE_RESERVAS);
    return salvo ? JSON.parse(salvo) : [];
}

function salvarReservas(lista) {
    localStorage.setItem(CHAVE_RESERVAS, JSON.stringify(lista));
}

// soma quantos ingressos já foram reservados para um evento
function ingressosReservados(eventoId) {
    return obterReservas()
        .filter(function (r) { return r.eventoId === eventoId; })
        .reduce(function (total, r) { return total + r.ingressos; }, 0);
}

// null = evento sem limite ("Ilimitada" / "Livre ao público.")
function vagasRestantes(evento) {
    if (typeof evento.vaga !== "number") return null;
    return evento.vaga - ingressosReservados(evento.id);
}

function precoParaNumero(preco) {
    return Number(
        preco.replace("R$", "").trim().replace(/\./g, "").replace(",", ".")
    );
}

function numeroParaPreco(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

function gerarCodigoIngresso() {
    return "VA-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}


// ==========================================
// 3. LISTAGEM, PESQUISA E FILTROS (inicio.html)
// ==========================================

const listaEventos = document.getElementById("lista-eventos");
const pesquisa = document.getElementById("pesquisa");
const btnPesquisa = document.getElementById("btn-pesquisa");

function mostrarEventos(lista) {

    if (!listaEventos) return;

    listaEventos.innerHTML = "";

    if (lista.length === 0) {
        listaEventos.innerHTML = "<p style='color: #fff;'>Nenhum evento encontrado.</p>";
        return;
    }

    lista.forEach(function (evento) {

        const restantes = vagasRestantes(evento);
        const lotado = restantes !== null && restantes <= 0;

        listaEventos.innerHTML += `
            <div class="banner-novo">
                <img src="${evento.imagem}" alt="${evento["evento-novo"]}">
                <h5 class="data">${formatarData(evento.data)}</h5>
                <h5 class="hora">${evento.hora}</h5>
                <h6 class="preco">${evento.preco}</h6>
                <h2 class="evento-novo">${evento["evento-novo"]}</h2>

                ${lotado ? '<span class="badge-lotado">Lotado</span>' : ""}

                <button class="btn-saiba-mais" data-id="${evento.id}">
                    Saiba mais
                </button>
            </div>
        `;
    });
}

function pesquisar() {
    let texto = pesquisa.value.toLowerCase();
    let resultado = dados.filter(function (evento) {
        return evento["evento-novo"].toLowerCase().includes(texto);
    });
    mostrarEventos(resultado);
}

if (btnPesquisa) btnPesquisa.onclick = pesquisar;
if (pesquisa) pesquisa.oninput = pesquisar;

if (listaEventos) mostrarEventos(dados);

const categorias = document.getElementById("categorias");

if (categorias) {
    categorias.onchange = function () {
        let categoria = categorias.value.toLowerCase();
        let resultado = dados.filter(function (evento) {
            if (categoria === "todas") return true;
            return evento.categoria.toLowerCase() === categoria;
        });
        mostrarEventos(resultado);
    };
}

if (listaEventos) {
    listaEventos.onclick = function (event) {
        if (!event.target.classList.contains("btn-saiba-mais")) return;

        let id = Number(event.target.dataset.id);
        let evento = dados.find(function (item) { return item.id === id; });

        mostrarDetalhes(evento);
    };
}


// ==========================================
// 4. DETALHES DO EVENTO
// ==========================================

let eventoAtual = null;

function mostrarDetalhes(evento) {

    eventoAtual = evento;

    document.getElementById("detalhes-titulo").textContent = evento["evento-novo"];
    document.getElementById("detalhes-imagem").src = evento.imagem;
    document.getElementById("detalhes-descricao").textContent = evento.detalhes;
    document.getElementById("detalhes-data").textContent = formatarData(evento.data);
    document.getElementById("detalhes-hora").textContent = evento.hora;
    document.getElementById("detalhes-preco").textContent = evento.preco;

    const restantes = vagasRestantes(evento);
    const lotado = restantes !== null && restantes <= 0;

    document.getElementById("detalhes-vagas").textContent =
        restantes === null ? evento.vaga : restantes;

    const avisoLotado = document.getElementById("detalhes-lotado");
    const inputQuantidade = document.getElementById("quantidade-ingressos");
    const btnReservar = document.getElementById("btn-reservar");

    if (avisoLotado) avisoLotado.hidden = !lotado;

    if (inputQuantidade) {
        inputQuantidade.value = lotado ? 0 : 1;
        inputQuantidade.disabled = lotado;
        if (restantes !== null) {
            inputQuantidade.max = restantes;
        } else {
            inputQuantidade.removeAttribute("max");
        }
    }

    if (btnReservar) {
        btnReservar.disabled = lotado;

        const icone = btnReservar.querySelector("i");
        const jaReservado = obterReservas().some(function (r) {
            return r.eventoId === evento.id;
        });
        if (icone) {
            icone.classList.toggle("reservado", jaReservado);
        }
    }

    document.getElementById("detalhes-evento").style.display = "block";
}

const btnFecharDetalhes = document.getElementById("btn-fechar-detalhes");
if (btnFecharDetalhes) {
    btnFecharDetalhes.onclick = function () {
        document.getElementById("detalhes-evento").style.display = "none";
    };
}


// ==========================================
// 5. RESERVAR
// ==========================================

const btnReservar = document.getElementById("btn-reservar");

if (btnReservar) {

    btnReservar.onclick = function () {

        if (!eventoAtual) return;

        const inputQuantidade = document.getElementById("quantidade-ingressos");
        const quantidade = inputQuantidade ? Number(inputQuantidade.value) : 1;
        const restantes = vagasRestantes(eventoAtual);

        if (!quantidade || quantidade < 1) {
            alert("Escolha ao menos 1 ingresso.");
            return;
        }

        if (restantes !== null && quantidade > restantes) {
            alert("Só restam " + restantes + " vaga(s) para este evento.");
            return;
        }

        const valorTotal = precoParaNumero(eventoAtual.preco) * quantidade;

        const reserva = {
            id: Date.now(),
            eventoId: eventoAtual.id,
            evento: eventoAtual["evento-novo"],
            data: eventoAtual.data,
            hora: eventoAtual.hora,
            local: eventoAtual.local,
            imagem: eventoAtual.imagem,
            ingressos: quantidade,
            valorTotal: valorTotal,
            codigo: gerarCodigoIngresso(),
        };

        const reservas = obterReservas();
        reservas.push(reserva);
        salvarReservas(reservas);

        const icone = btnReservar.querySelector("i");
        if (icone) icone.classList.add("reservado");

        alert(
            "Reserva confirmada!\n" +
            eventoAtual["evento-novo"] + " — " + quantidade + " ingresso(s)\n" +
            "Código: " + reserva.codigo
        );

        // atualiza o modal (vagas restantes) e a listagem (badge "Lotado")
        mostrarDetalhes(eventoAtual);
        if (listaEventos) mostrarEventos(dados);
    };
}


// ==========================================
// 6. MINHAS RESERVAS (minhas-reservas.html)
// ==========================================

const listaMinhasReservas = document.getElementById("lista-minhas-reservas");

if (listaMinhasReservas) {

    function renderizarMinhasReservas() {

        const reservas = obterReservas();

        if (reservas.length === 0) {
            listaMinhasReservas.innerHTML =
                "<p class='sem-reservas'>Você ainda não fez nenhuma reserva.</p>";
            return;
        }

        listaMinhasReservas.innerHTML = reservas.map(function (r) {

            const qrSrc =
                "https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=" +
                encodeURIComponent(r.codigo);

            return `
                <div class="reserva" data-reserva-id="${r.id}">
                    <div class="PNG-reserva">
                        <img src="${r.imagem}" alt="${r.evento}">
                    </div>

                    <section class="informacoes-reserva">
                        <div class="informacoes">
                            <div class="titulo-evento">
                                <h2>${r.evento} VIVA AI</h2>
                            </div>

                            <p>
                                <i class="fa-regular fa-calendar-days"></i>
                                <span>Data: ${formatarData(r.data)}</span>
                            </p>

                            <p>
                                <i class="fa-regular fa-clock"></i>
                                <span>Hora: ${r.hora}</span>
                            </p>

                            <p>
                                <i class="fa-solid fa-map-location-dot"></i>
                                <span>Local: ${r.local || "A definir"}</span>
                            </p>

                            <p>
                                <i class="fa-solid fa-ticket"></i>
                                <span>Quantidade de ingressos: ${r.ingressos}</span>
                            </p>

                            <p>
                                <i class="fa-solid fa-dollar-sign"></i>
                                <span>Valor total: ${numeroParaPreco(r.valorTotal)}</span>
                            </p>

                            <div class="ingresso-codigo">
                                <img class="qr-ingresso" src="${qrSrc}" alt="QR code do ingresso">
                                <span class="codigo-ingresso">Código: ${r.codigo}</span>
                            </div>

                            <span>Reservado com sucesso!</span>
                        </div>

                        <label>
                            <button type="button" class="btn-cancelar" data-reserva-id="${r.id}">
                                Cancelar reserva
                            </button>
                        </label>
                    </section>
                </div>
            `;
        }).join("");
    }

    listaMinhasReservas.onclick = function (event) {
        const botao = event.target.closest(".btn-cancelar");
        if (!botao) return;

        const id = Number(botao.dataset.reservaId);
        const reservas = obterReservas().filter(function (r) { return r.id !== id; });

        salvarReservas(reservas);
        renderizarMinhasReservas();
    };

    renderizarMinhasReservas();
}