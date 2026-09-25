// ==================== CALENDÁRIO ====================

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

const btnAnterior = document.getElementById("btn-anterior");
const btnProximo = document.getElementById("btn-proximo");

let dataHoje = new Date();
let ano = dataHoje.getFullYear();
let mes = dataHoje.getMonth();

const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

const formatarData = (data) => {
    if (!data) return "";
    return data.split("-").reverse().join("/");
};


// ==================== EVENTOS DO CALENDÁRIO ====================

const eventosCalendario = {};

if (typeof dados !== "undefined" && Array.isArray(dados)) {
    dados.forEach((e) => {
        if (e.data) {
            eventosCalendario[e.data] = e["evento-novo"];
        }
    });
}


function carregarCalendario() {
    if (!mesAno || !dias) return;

    mesAno.textContent = `${meses[mes]} de ${ano}`;
    dias.innerHTML = "";

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    // Espaços antes do primeiro dia do mês
    for (let i = 0; i < primeiroDia; i++) {
        const espaco = document.createElement("div");
        espaco.classList.add("dia-vazio");
        dias.appendChild(espaco);
    }

    // Dias do mês
    for (let dia = 1; dia <= ultimoDia; dia++) {
        const dataCompleta =
            `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        const elemento = document.createElement("div");

        elemento.textContent = dia;
        elemento.classList.add("dia");

        if (eventosCalendario[dataCompleta]) {
            elemento.classList.add("evento");
        }

        elemento.onclick = () => clicarDia(dataCompleta);

        dias.appendChild(elemento);
    }
}


function clicarDia(data) {
    if (!eventosCalElm) return;

    if (eventosCalendario[data]) {
        eventosCalElm.textContent =
            `Evento em ${formatarData(data)}: ${eventosCalendario[data]}`;

        return;
    }

    const novoEvento = prompt(
        `Adicionar evento para ${formatarData(data)}:`
    );

    if (!novoEvento) return;

    eventosCalendario[data] = novoEvento;

    carregarCalendario();

    eventosCalElm.textContent =
        `Evento em ${formatarData(data)}: ${novoEvento}`;
}


// Botão mês anterior
if (btnAnterior) {
    btnAnterior.addEventListener("click", () => {
        mes--;

        if (mes < 0) {
            mes = 11;
            ano--;
        }

        carregarCalendario();
    });
}


// Botão próximo mês
if (btnProximo) {
    btnProximo.addEventListener("click", () => {
        mes++;

        if (mes > 11) {
            mes = 0;
            ano++;
        }

        carregarCalendario();
    });
}

carregarCalendario();


// ==========================================
// 2. RESERVAS — FUNÇÕES COMPARTILHADAS
// ==========================================

const CHAVE_RESERVAS = "reservasViva";


function obterReservas() {
    const salvo = localStorage.getItem(CHAVE_RESERVAS);

    try {
        return salvo ? JSON.parse(salvo) : [];
    } catch (erro) {
        console.error("Erro ao ler reservas:", erro);
        return [];
    }
}


function salvarReservas(lista) {
    localStorage.setItem(
        CHAVE_RESERVAS,
        JSON.stringify(lista)
    );
}


// Soma quantos ingressos já foram reservados para um evento
function ingressosReservados(eventoId) {
    return obterReservas()
        .filter((r) => r.eventoId === eventoId)
        .reduce(
            (total, r) => total + Number(r.ingressos || 0),
            0
        );
}


// null = evento sem limite
function vagasRestantes(evento) {
    if (typeof evento.vaga !== "number") {
        return null;
    }

    return evento.vaga - ingressosReservados(evento.id);
}


function precoParaNumero(preco) {
    if (typeof preco === "number") {
        return preco;
    }

    if (!preco) {
        return 0;
    }

    return Number(
        String(preco)
            .replace("R$", "")
            .trim()
            .replace(/\./g, "")
            .replace(",", ".")
    );
}


function numeroParaPreco(valor) {
    return (
        "R$ " +
        Number(valor || 0)
            .toFixed(2)
            .replace(".", ",")
    );
}


function gerarCodigoIngresso() {
    return (
        "VA-" +
        Math.random()
            .toString(36)
            .slice(2, 8)
            .toUpperCase()
    );
}


// ==========================================
// 3. LISTAGEM, PESQUISA E FILTROS
// ==========================================

const listaEventos = document.getElementById("lista-eventos");
const pesquisa = document.getElementById("pesquisa");
const btnPesquisa = document.getElementById("btn-pesquisa");
const select = document.getElementById("categorias");


function mostrarEventos(lista) {
    if (!listaEventos) return;

    listaEventos.innerHTML = "";

    if (!Array.isArray(lista) || lista.length === 0) {
        listaEventos.innerHTML =
            "<p style='color: #fff;'>Nenhum evento encontrado.</p>";

        return;
    }

    lista.forEach(function (evento) {
        const restantes = vagasRestantes(evento);
        const lotado =
            restantes !== null && restantes <= 0;

        const card = document.createElement("div");

        card.className = "banner-novo";

        card.innerHTML = `
            <img 
                src="${evento.imagem}" 
                alt="${evento["evento-novo"]}"
            >

            <h5 class="data">
                ${formatarData(evento.data)}
            </h5>

            <h5 class="hora">
                ${evento.hora || ""}
            </h5>

            <h6 class="preco">
                ${evento.preco || ""}
            </h6>

            <h2 class="evento-novo">
                ${evento["evento-novo"] || ""}
            </h2>

            ${
                lotado
                    ? `<span class="lotado">LOTADO</span>`
                    : ""
            }

            <button
                class="btn-saiba-mais"
                data-id="${evento.id}"
                type="button"
            >
                Saiba mais
            </button>
        `;

        listaEventos.appendChild(card);
    });
}


// Pesquisa
function pesquisar() {
    if (!pesquisa) return;

    const texto = pesquisa.value
        .toLowerCase()
        .trim();

    const resultado = dados.filter((e) =>
        String(e["evento-novo"] || "")
            .toLowerCase()
            .includes(texto)
    );

    mostrarEventos(resultado);
}


if (btnPesquisa) {
    btnPesquisa.addEventListener(
        "click",
        pesquisar
    );
}


if (pesquisa) {
    pesquisa.addEventListener(
        "input",
        pesquisar
    );
}


// Filtro por categoria
if (select) {
    select.addEventListener("change", () => {
        const categoria = select.value;

        if (categoria === "Todas") {
            mostrarEventos(dados);
            return;
        }

        mostrarEventos(
            dados.filter(
                (e) => e.categoria === categoria
            )
        );
    });
}


// Clique em "Saiba mais"
if (listaEventos) {
    listaEventos.addEventListener("click", (e) => {
        const botao = e.target.closest(
            ".btn-saiba-mais"
        );

        if (!botao) return;

        const evento = dados.find(
            (item) =>
                item.id === Number(botao.dataset.id)
        );

        if (evento) {
            mostrarDetalhes(evento);
        }
    });
}


// Mostra os eventos inicialmente
if (typeof dados !== "undefined") {
    mostrarEventos(dados);
}


// ==========================================
// 4. DETALHES DO EVENTO
// ==========================================

let eventoAtual = null;


function mostrarDetalhes(evento) {
    eventoAtual = evento;

    const titulo =
        document.getElementById(
            "detalhes-titulo"
        );

    const imagem =
        document.getElementById(
            "detalhes-imagem"
        );

    const descricao =
        document.getElementById(
            "detalhes-descricao"
        );

    const data =
        document.getElementById(
            "detalhes-data"
        );

    const hora =
        document.getElementById(
            "detalhes-hora"
        );

    const preco =
        document.getElementById(
            "detalhes-preco"
        );

    const vagas =
        document.getElementById(
            "detalhes-vagas"
        );

    const modal =
        document.getElementById(
            "detalhes-evento"
        );


    if (titulo) {
        titulo.textContent =
            evento["evento-novo"];
    }

    if (imagem) {
        imagem.src = evento.imagem;
    }

    if (descricao) {
        descricao.textContent =
            evento.detalhes || "";
    }

    if (data) {
        data.textContent =
            formatarData(evento.data);
    }

    if (hora) {
        hora.textContent =
            evento.hora || "";
    }

    if (preco) {
        preco.textContent =
            evento.preco || "";
    }


    // Favorito
    const favorito =
        document.getElementById(
            "btn-favorito"
        );

    if (favorito) {
        favorito.dataset.id = evento.id;
        favorito.checked =
            verificarFavorito(evento.id);
    }


    // Vagas
    const restantes =
        vagasRestantes(evento);

    const lotado =
        restantes !== null &&
        restantes <= 0;

    if (vagas) {
        vagas.textContent =
            restantes === null
                ? evento.vaga || "Livre"
                : restantes;
    }


    // Aviso de lotação
    const avisoLotado =
        document.getElementById(
            "detalhes-lotado"
        );

    if (avisoLotado) {
        avisoLotado.hidden = !lotado;
    }


    // Quantidade de ingressos
    const inputQuantidade =
        document.getElementById(
            "quantidade-ingressos"
        );

    if (inputQuantidade) {
        inputQuantidade.value =
            lotado ? 0 : 1;

        inputQuantidade.disabled =
            lotado;

        if (restantes !== null) {
            inputQuantidade.max =
                Math.max(0, restantes);
        } else {
            inputQuantidade.removeAttribute(
                "max"
            );
        }
    }


    // Botão reservar
    const btnReservar =
        document.getElementById(
            "btn-reservar"
        );

    if (btnReservar) {
        btnReservar.disabled = lotado;

        const icone =
            btnReservar.querySelector("i");

        const jaReservado =
            obterReservas().some(
                (r) =>
                    r.eventoId === evento.id
            );

        if (icone) {
            icone.classList.toggle(
                "reservado",
                jaReservado
            );
        }
    }


    if (modal) {
        modal.style.display = "block";
    }
}


// Fechar detalhes
const btnFecharDetalhes =
    document.getElementById(
        "btn-fechar-detalhes"
    );

if (btnFecharDetalhes) {
    btnFecharDetalhes.onclick = function () {
        const modal =
            document.getElementById(
                "detalhes-evento"
            );

        if (modal) {
            modal.style.display = "none";
        }
    };
}


// ==========================================
// 5. FAVORITOS
// ==========================================

let favoritos = [];


try {
    favoritos =
        JSON.parse(
            localStorage.getItem(
                "favoritos"
            )
        ) || [];
} catch (erro) {
    favoritos = [];
}


const salvarFavoritos = () => {
    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );
};


const verificarFavorito = (id) =>
    favoritos.includes(id);


function favoritar(id) {
    if (favoritos.includes(id)) {
        favoritos =
            favoritos.filter(
                (f) => f !== id
            );
    } else {
        favoritos.push(id);
    }

    salvarFavoritos();
}


const btnFavorito =
    document.getElementById(
        "btn-favorito"
    );


if (btnFavorito) {
    btnFavorito.addEventListener(
        "change",
        function () {
            favoritar(
                Number(this.dataset.id)
            );
        }
    );
}


// ==========================================
// 6. PÁGINA DE FAVORITOS
// ==========================================

const listaFavoritos =
    document.getElementById(
        "lista-favoritos"
    );


if (listaFavoritos) {
    const eventosFavoritos =
        dados.filter((e) =>
            favoritos.includes(e.id)
        );


    listaFavoritos.innerHTML =
        eventosFavoritos.length
            ? eventosFavoritos
                  .map(
                      (evento) => `
                <div class="banner-novo">

                    <img
                        src="${evento.imagem}"
                        alt="${evento["evento-novo"]}"
                    >

                    <h5>
                        ${formatarData(evento.data)}
                    </h5>

                    <h5>
                        ${evento.hora || ""}
                    </h5>

                    <h6>
                        ${evento.preco || ""}
                    </h6>

                    <h2>
                        ${evento["evento-novo"] || ""}
                    </h2>

                </div>
            `
                  )
                  .join("")
            : "<p>Nenhum evento favoritado.</p>";
}


// ==========================================
// 7. RESERVAR
// ==========================================

const btnReservar =
    document.getElementById(
        "btn-reservar"
    );


if (btnReservar) {
    btnReservar.onclick = function () {

        if (!eventoAtual) {
            return;
        }


        const inputQuantidade =
            document.getElementById(
                "quantidade-ingressos"
            );


        const quantidade =
            inputQuantidade
                ? Number(
                      inputQuantidade.value
                  )
                : 1;


        const restantes =
            vagasRestantes(
                eventoAtual
            );


        // Quantidade inválida
        if (
            !quantidade ||
            quantidade < 1
        ) {
            alert(
                "Escolha ao menos 1 ingresso."
            );

            return;
        }


        // Mais ingressos que vagas disponíveis
        if (
            restantes !== null &&
            quantidade > restantes
        ) {
            alert(
                "Só restam " +
                    restantes +
                    " vaga(s) para este evento."
            );

            return;
        }


        // Calcula valor
        const valorTotal =
            precoParaNumero(
                eventoAtual.preco
            ) * quantidade;


        // Cria reserva
        const reserva = {
            id: Date.now(),

            eventoId:
                eventoAtual.id,

            evento:
                eventoAtual[
                    "evento-novo"
                ],

            data:
                eventoAtual.data,

            hora:
                eventoAtual.hora,

            local:
                eventoAtual.local,

            imagem:
                eventoAtual.imagem,

            ingressos:
                quantidade,

            valorTotal:
                valorTotal,

            codigo:
                gerarCodigoIngresso()
        };


        // Salva
        const reservas =
            obterReservas();

        reservas.push(reserva);

        salvarReservas(reservas);


        // Atualiza ícone
        const icone =
            btnReservar.querySelector(
                "i"
            );

        if (icone) {
            icone.classList.add(
                "reservado"
            );
        }


        // Confirmação
        alert(
            "Reserva confirmada!\n\n" +
            eventoAtual[
                "evento-novo"
            ] +
            " — " +
            quantidade +
            " ingresso(s)\n" +
            "Código: " +
            reserva.codigo
        );


        // Atualiza modal
        mostrarDetalhes(
            eventoAtual
        );


        // Atualiza listagem
        if (listaEventos) {
            mostrarEventos(dados);
        }
    };
}


// ==========================================
// 8. MINHAS RESERVAS
// ==========================================

const listaMinhasReservas =
    document.getElementById(
        "lista-minhas-reservas"
    );


if (listaMinhasReservas) {

    function renderizarMinhasReservas() {

        const reservas =
            obterReservas();


        if (reservas.length === 0) {

            listaMinhasReservas.innerHTML =
                `
                <p class="sem-reservas">
                    Você ainda não fez nenhuma reserva.
                </p>
                `;

            return;
        }


        listaMinhasReservas.innerHTML =
            reservas
                .map(function (r) {

                    const qrSrc =
                        "https://api.qrserver.com/v1/create-qr-code/?size=110x110&data="  +
                        encodeURIComponent(
                            r.codigo
                        );


                    return `
                        <div
                            class="reserva"
                            data-reserva-id="${r.id}"
                        >

                            <div class="PNG-reserva">
                                <img
                                    src="${r.imagem}"
                                    alt="${r.evento}"
                                >
                            </div>


                            <section
                                class="informacoes-reserva"
                            >

                                <div class="informacoes">

                                    <div
                                        class="titulo-evento"
                                    >
                                        <h2>
                                            ${r.evento}
                                            VIVA AI
                                        </h2>
                                    </div>


                                    <p>
                                        <i class="fa-regular fa-calendar-days"></i>

                                        <span>
                                            Data:
                                            ${formatarData(r.data)}
                                        </span>
                                    </p>


                                    <p>
                                        <i class="fa-regular fa-clock"></i>

                                        <span>
                                            Hora:
                                            ${r.hora || "A definir"}
                                        </span>
                                    </p>


                                    <p>
                                        <i class="fa-solid fa-map-location-dot"></i>

                                        <span>
                                            Local:
                                            ${r.local || "A definir"}
                                        </span>
                                    </p>


                                    <p>
                                        <i class="fa-solid fa-ticket"></i>

                                        <span>
                                            Quantidade de ingressos:
                                            ${r.ingressos}
                                        </span>
                                    </p>


                                    <p>
                                        <i class="fa-solid fa-dollar-sign"></i>

                                        <span>
                                            Valor total:
                                            ${numeroParaPreco(
                                                r.valorTotal
                                            )}
                                        </span>
                                    </p>


                                    <div
                                        class="ingresso-codigo"
                                    >

                                        <img
                                            class="qr-ingresso"
                                            src="${qrSrc}"
                                            alt="QR code do ingresso"
                                        >

                                        <span
                                            class="codigo-ingresso"
                                        >
                                            Código:
                                            ${r.codigo}
                                        </span>

                                    </div>


                                    <span>
                                        Reservado com sucesso!
                                    </span>

                                </div>


                                <label>

                                    <button
                                        type="button"
                                        class="btn-cancelar"
                                        data-reserva-id="${r.id}"
                                    >
                                        Cancelar reserva
                                    </button>

                                </label>

                            </section>

                        </div>
                    `;
                })
                .join("");
    }


    // Cancelar reserva
    listaMinhasReservas.onclick =
        function (event) {

            const botao =
                event.target.closest(
                    ".btn-cancelar"
                );


            if (!botao) {
                return;
            }


            const id =
                Number(
                    botao.dataset
                        .reservaId
                );


            const reservas =
                obterReservas().filter(
                    function (r) {
                        return r.id !== id;
                    }
                );


            salvarReservas(
                reservas
            );


            renderizarMinhasReservas();
        };


    renderizarMinhasReservas();
}
