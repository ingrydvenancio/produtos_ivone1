/**
 * ============================================================================
 * LOJAS IVONE - SISTEMA DE E-COMMERCE HAUTE COSMÉTIQUE
 * Arquivo: app.js
 * Descrição: Modelagem orientada a objetos, gerenciamento de estado, 
 *            validações, manipulação dinâmica do DOM e simulação assíncrona.
 * ============================================================================
 */

// ==========================================
// 1. MODELAGEM ORIENTADA A OBJETOS (ES6+)
// ==========================================

/**
 * Representa um Produto no catálogo da Loja Ivone.
 */
class Produto {
    #id;
    #nome;
    #categoria;
    #preco;
    #precoAntigo;
    #estoque;
    #descricao;
    #icone;

    constructor(id, nome, categoria, preco, precoAntigo, estoque, descricao, icone) {
        this.#id = id;
        this.#nome = nome;
        this.#categoria = categoria;
        this.#preco = Number(preco);
        this.#precoAntigo = Number(precoAntigo);
        this.#estoque = Number(estoque);
        this.#descricao = descricao;
        this.#icone = icone;
    }

    // Getters para encapsulamento
    get id() { return this.#id; }
    get nome() { return this.#nome; }
    get categoria() { return this.#categoria; }
    get preco() { return this.#preco; }
    get precoAntigo() { return this.#precoAntigo; }
    get estoque() { return this.#estoque; }
    get descricao() { return this.#descricao; }
    get icone() { return this.#icone; }

    formatarPreco(valor) {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }

    obterResumo() {
        return {
            id: this.#id,
            nome: this.#nome,
            precoFormatado: this.formatarPreco(this.#preco)
        };
    }
}

/**
 * Representa um Item individual dentro do Carrinho de Compras.
 */
class ItemCarrinho {
    #produto;
    #quantidade;

    constructor(produto, quantidade = 1) {
        this.#produto = produto;
        this.#quantidade = Number(quantidade);
    }

    get produto() { return this.#produto; }
    get quantidade() { return this.#quantidade; }

    set quantidade(novaQtd) {
        if (novaQtd >= 0) {
            this.#quantidade = novaQtd;
        }
    }

    incrementar() {
        this.#quantidade++;
    }

    decrementar() {
        if (this.#quantidade > 1) {
            this.#quantidade--;
        }
    }

    calcularSubtotal() {
        return this.#produto.preco * this.#quantidade;
    }
}

/**
 * Gerencia o estado e as operações do Carrinho de Compras.
 */
class CarrinhoCompras {
    #itens;
    #cupomAplicado;
    #descontoPercentual;

    constructor() {
        this.#itens = [];
        this.#cupomAplicado = null;
        this.#descontoPercentual = 0;
    }

    get itens() { return [...this.#itens]; }
    get cupomAplicado() { return this.#cupomAplicado; }

    adicionarProduto(produto, quantidade = 1) {
        try {
            if (!produto instanceof Produto) {
                throw new Error("Item inválido para adição ao carrinho.");
            }

            const itemExistente = this.#itens.find(item => item.produto.id === produto.id);

            if (itemExistente) {
                itemExistente.incrementar();
            } else {
                this.#itens.push(new ItemCarrinho(produto, quantidade));
            }
            return true;
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error.message);
            return false;
        }
    }

    removerProduto(produtoId) {
        this.#itens = this.#itens.filter(item => item.produto.id !== produtoId);
    }

    calcularTotalItens() {
        return this.#itens.reduce((total, item) => total + item.quantidade, 0);
    }

    calcularSubtotalGeral() {
        return this.#itens.reduce((total, item) => total + item.calcularSubtotal(), 0);
    }

    aplicarCupom(codigo) {
        const codigoFormatado = codigo.trim().toUpperCase();
        if (codigoFormatado === "IVONESUBLIME") {
            this.#cupomAplicado = "IVONESUBLIME";
            this.#descontoPercentual = 0.10; // 10% de desconto
            return { sucesso: true, mensagem: "Cupom aplicado com sucesso! 10% OFF." };
        }
        return { sucesso: false, mensagem: "Cupom inválido ou expirado." };
    }

    calcularTotalFinal() {
        const subtotal = this.calcularSubtotalGeral();
        const desconto = subtotal * this.#descontoPercentual;
        const frete = subtotal >= 150 || subtotal === 0 ? 0 : 20.00;
        return {
            subtotal,
            desconto,
            frete,
            total: (subtotal - desconto) + frete
        };
    }

    limpar() {
        this.#itens = [];
        this.#cupomAplicado = null;
        this.#descontoPercentual = 0;
    }
}

// ==========================================
// 2. DADOS INICIAIS E INSTANCIAÇÃO
// ==========================================

const catalogoProdutos = [
    new Produto(1, "Perfume Ivone Sublime Eau de Parfum", "perfumes", 289.90, 349.90, 15, "Fragrância marcante com notas de orquídea negra, ameixa aveludada e fundo ambarado.", "fa-spray-can-sparkles"),
    new Produto(2, "Óleo Corporal Hidratante Ouro e Vinho", "corpo", 119.90, 149.90, 20, "Nutrição profunda com toque seco, extrato de uva e partículas iluminadoras sutis.", "fa-bottle-droplet"),
    new Produto(3, "Batom Matte Velvet Vinho Intenso", "maquiagem", 69.90, 89.90, 30, "Textura aveludada de alta fixação que não resseca os lábios. Cor elegante e duradoura.", "fa-wand-magic-sparkles"),
    new Produto(4, "Kit Presenteável Essência da Noite", "kits", 199.90, 249.90, 10, "Contém colônia 100ml, loção acetinada 250ml em elegante caixa de presente colecionável.", "fa-gift"),
    new Produto(5, "Sérum Facial Antienvelhecimento Gold 24k", "corpo", 210.00, 260.00, 12, "Sérum concentrado com peptídeos e partículas de ouro para firmeza e viço imediato.", "fa-gem"),
    new Produto(6, "Colônia Delicada Senhora Ivone Classic", "perfumes", 159.90, 189.90, 25, "A essência tradicional que atravessa gerações. Notas florais suaves e reconfortantes.", "fa-wine-bottle")
];

const meuCarrinho = new CarrinhoCompras();
let listaDesejos = [];

// ==========================================
// 3. MANIPULAÇÃO DINÂMICA DO DOM E INTERFACE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    renderizarVitrine(catalogoProdutos);
    configurarEventosBusca();
});

/**
 * Renderiza os produtos na vitrine utilizando template literals e métodos de array.
 */
function renderizarVitrine(produtos) {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    if (produtos.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <i class="fa-solid fa-face-frown text-4xl text-vinhoRosado mb-3"></i>
                <p class="text-pretoAmeixa font-medium">Nenhum produto encontrado correspondente à sua busca.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = produtos.map(prod => `
        <div class="bg-white rounded-2xl p-4 border border-begeNude shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative">
            <div class="absolute top-6 left-6 z-10">
                <span class="bg-vinhoProfundo text-douradoChampagne text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full shadow">
                    Exclusivo
                </span>
            </div>

            <button onclick="alternarFavorito(${prod.id})" class="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-offWhiteCremoso hover:bg-vinhoRosado hover:text-white text-vinhoProfundo flex items-center justify-center transition shadow">
                <i class="${listaDesejos.includes(prod.id) ? 'fa-solid text-vinhoRosado hover:text-white' : 'fa-regular'} fa-heart"></i>
            </button>

            <div class="w-full h-56 rounded-xl bg-card-placeholder border border-begeNude/60 flex items-center justify-center mb-4 relative overflow-hidden group-hover:bg-begeNude/40 transition">
                <i class="fa-solid ${prod.icone} text-5xl text-vinhoProfundo group-hover:scale-110 transition duration-300"></i>
            </div>

            <div class="space-y-2 flex-grow flex flex-col justify-between">
                <div>
                    <div class="flex items-center space-x-1 text-amber-500 text-xs mb-1">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        <span class="text-gray-400 text-[11px] ml-1">(4.8)</span>
                    </div>
                    <h3 class="font-heading font-bold text-xl text-pretoAmeixa leading-snug group-hover:text-vinhoRosado transition">${prod.nome}</h3>
                    <p class="text-xs text-gray-500 line-clamp-2 mt-1">${prod.descricao}</p>
                </div>

                <div class="pt-4 flex items-center justify-between border-t border-begeNude/50 mt-4">
                    <div>
                        <span class="text-xs text-gray-400 line-through block">${prod.formatarPreco(prod.precoAntigo)}</span>
                        <span class="text-lg font-bold text-vinhoProfundo">${prod.formatarPreco(prod.preco)}</span>
                    </div>
                    <button onclick="adicionarAoCarrinho(${prod.id})" class="bg-vinhoProfundo hover:bg-vinhoRosado text-douradoChampagne hover:text-white text-xs font-bold px-4 py-2.5 rounded-full shadow transition-all flex items-center">
                        <i class="fa-solid fa-bag-shopping mr-1.5"></i> Adicionar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==========================================
// 4. AÇÕES E EVENTOS ASSÍNCRONOS (FETCH API)
// ==========================================

/**
 * Adiciona produto ao carrinho e atualiza contadores visuais.
 */
function adicionarAoCarrinho(produtoId) {
    try {
        const produto = catalogoProdutos.find(p => p.id === produtoId);
        if (!produto) throw new Error("Produto não localizado no catálogo.");

        meuCarrinho.adicionarProduto(produto);
        atualizarInterfaceCarrinho();
        exibirToast(`"${produto.nome}" adicionado à sacola.`);
    } catch (error) {
        exibirToast(`Erro: ${error.message}`, "erro");
    }
}

function atualizarInterfaceCarrinho() {
    const contadorBadge = document.getElementById("cartCount");
    if (contadorBadge) {
        contadorBadge.innerText = meuCarrinho.calcularTotalItens();
    }
}

/**
 * Gerencia a Lista de Desejos (Favoritos).
 */
function alternarFavorito(produtoId) {
    const index = listaDesejos.indexOf(produtoId);
    if (index > -1) {
        listaDesejos.splice(index, 1);
        exibirToast("Produto removido dos favoritos.");
    } else {
        listaDesejos.push(produtoId);
        exibirToast("Produto adicionado aos favoritos.");
    }
    
    const wishlistCount = document.getElementById("wishlistCount");
    if (wishlistCount) wishlistCount.innerText = listaDesejos.length;

    // Atualiza vitrine mantendo o filtro atual
    filtrarPorCategoria();
}

/**
 * Filtro por categoria usando métodos funcionais (filter).
 */
function filtrarPorCategoria() {
    const select = document.getElementById("categoryFilter");
    if (!select) return;

    const categoriaSelecionada = select.value;
    if (categoriaSelecionada === "todos") {
        renderizarVitrine(catalogoProdutos);
    } else {
        const filtrados = catalogoProdutos.filter(p => p.categoria === categoriaSelecionada);
        renderizarVitrine(filtrados);
    }
}

/**
 * Filtro por termo de pesquisa em tempo real.
 */
function configurarEventosBusca() {
    const inputBusca = document.getElementById("searchInput");
    if (!inputBusca) return;

    inputBusca.addEventListener("keyup", (e) => {
        const termo = e.target.value.toLowerCase().trim();
        const resultados = catalogoProdutos.filter(p => 
            p.nome.toLowerCase().includes(termo) || 
            p.descricao.toLowerCase().includes(termo)
        );
        renderizarVitrine(resultados);
    });
}

/**
 * Exemplo de comunicação assíncrona (Fetch API) simulando o backend Flask.
 */
async function simularRequisicaoBackend(dadosPedido) {
    try {
        exibirToast("Processando pedido na API...", "info");
        
        // Simulação de chamada Fetch assíncrona (substituir pela URL real do Flask em produção)
        // const resposta = await fetch('http://127.0.0.1:5000/api/checkout', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(dadosPedido)
        // });
        // const resultado = await resposta.json();

        // Simulação de delay de rede bem-sucedido
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        exibirToast("Pedido processado com sucesso pelo servidor!", "sucesso");
        meuCarrinho.limpar();
        atualizarInterfaceCarrinho();
    } catch (erro) {
        exibirToast("Falha na comunicação com o servidor.", "erro");
        console.error("Erro Fetch API:", erro);
    }
}

// ==========================================
// 5. SISTEMA DE NOTIFICAÇÕES (TOAST FEEDBACK)
// ==========================================

function exibirToast(mensagem, tipo = "sucesso") {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "fixed bottom-5 right-5 z-50 space-y-2";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const corFundo = tipo === "erro" ? "bg-red-900 text-white" : "bg-pretoAmeixa text-douradoChampagne";
    
    toast.className = `${corFundo} border border-douradoChampagne/40 px-5 py-3 rounded-xl shadow-2xl text-xs flex items-center space-x-3 transform translate-y-10 opacity-0 transition-all duration-300`;
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${mensagem}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => toast.classList.remove("translate-y-10", "opacity-0"), 50);
    setTimeout(() => {
        toast.classList.add("translate-y-10", "opacity-0");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}