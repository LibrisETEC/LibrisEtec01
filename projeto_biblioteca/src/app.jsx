import { useState, useEffect } from 'react';
import Login from './componentes/Login';
import Livro from './componentes/Livros';
import ModalAdicionar from './componentes/ModalAdicionar';
import Emprestimos from './componentes/Emprestimos';
import MeusEmprestimos from './componentes/MeusEmprestimos';
import { livrosIniciais, generos, paises, autores } from './dados/livros';
import { usuariosIniciais } from './dados/usuarios';
import { cores } from './estilos/cores';
import { hoje, addDias, PRAZO_DIAS } from './funcoes/datas';

function initStorage() {
  if (!localStorage.getItem('libris_usuarios')) {
    localStorage.setItem('libris_usuarios', JSON.stringify(usuariosIniciais));
  }
  if (!localStorage.getItem('libris_livros')) {
    localStorage.setItem('libris_livros', JSON.stringify(livrosIniciais));
  }
  if (!localStorage.getItem('libris_emprestimos')) {
    localStorage.setItem('libris_emprestimos', JSON.stringify([]));
  }
}

function useStorage(key, fallback) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch { return fallback; }
  });
  function setAndSave(v) {
    setVal(v);
    localStorage.setItem(key, JSON.stringify(v));
  }
  return [val, setAndSave];
}

export default function App() {
  useEffect(() => { initStorage(); }, []);

  const [usuario, setUsuario] = useState(null);
  const [aba, setAba] = useState('acervo'); // 'acervo' | 'emprestimos' | 'meus'
  const [livros, setLivros] = useStorage('libris_livros', livrosIniciais);
  const [emprestimos, setEmprestimos] = useStorage('libris_emprestimos', []);
  const [usuarios] = useStorage('libris_usuarios', usuariosIniciais);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [confirmarEmprestimo, setConfirmarEmprestimo] = useState(null);

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroAutor, setFiltroAutor] = useState('');
  const [filtroPais, setFiltroPais] = useState('');

  const livrosFiltrados = livros.filter(l => {
    const q = busca.toLowerCase();
    const matchBusca = !q || l.titulo.toLowerCase().includes(q) || l.autor.toLowerCase().includes(q);
    const matchGenero = !filtroGenero || l.genero === filtroGenero;
    const matchAutor = !filtroAutor || l.autor === filtroAutor;
    const matchPais = !filtroPais || l.pais === filtroPais;
    return matchBusca && matchGenero && matchAutor && matchPais;
  });

  const generosDisponiveis = [...new Set(livros.map(l => l.genero))].sort();
  const autoresDisponiveis = [...new Set(livros.map(l => l.autor))].sort();
  const paisesDisponiveis = [...new Set(livros.map(l => l.pais))].sort();

  function handleLogin(u) {
    setUsuario(u);
    setAba(u.tipo === 'admin' ? 'emprestimos' : 'acervo');
  }

  function handleLogout() {
    setUsuario(null);
    setAba('acervo');
  }

  function handleEmprestar(livro) {
    setConfirmarEmprestimo(livro);
  }

  function confirmarEmprestimoFn() {
    if (!confirmarEmprestimo || !usuario) return;
    const dataHoje = hoje();
    const novoEmprestimo = {
      id: 'emp-' + Date.now(),
      livroId: confirmarEmprestimo.id,
      alunoId: usuario.id,
      dataEmprestimo: dataHoje,
      dataDevolucao: addDias(dataHoje, PRAZO_DIAS),
      devolvido: false,
    };
    setEmprestimos([...emprestimos, novoEmprestimo]);
    setConfirmarEmprestimo(null);
  }

  function handleDevolver(emprestimoId) {
    setEmprestimos(emprestimos.map(e =>
      e.id === emprestimoId ? { ...e, devolvido: true, dataDevolvido: hoje() } : e
    ));
  }

  function handleAdicionarLivro(livro) {
    setLivros([...livros, livro]);
  }

  function handleRemoverLivro(livroId) {
    if (window.confirm('Remover este livro do acervo?')) {
      setLivros(livros.filter(l => l.id !== livroId));
    }
  }

  if (!usuario) return <Login onLogin={handleLogin} />;

  const selectStyle = {
    padding: '8px 12px',
    borderRadius: 8,
    border: `1.5px solid ${cores.azulPalido}`,
    fontSize: 13,
    fontFamily: "'Lora', serif",
    color: cores.azulEscuro,
    background: cores.branco,
    outline: 'none',
    cursor: 'pointer',
  };

  const tabAtiva = (tab) => aba === tab;

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(160deg, ${cores.azulSuave} 0%, ${cores.branco} 55%, ${cores.amareloPalido} 100%)`,
      fontFamily: "'Lora', serif",
    }}>
      {/* HEADER */}
      <header style={{
        background: `linear-gradient(90deg, ${cores.azulEscuro} 0%, ${cores.azulMedio} 100%)`,
        boxShadow: '0 2px 16px rgba(26,58,92,0.2)',
      }}>
        <div style={{
          maxWidth: 1300,
          margin: '0 auto',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 68,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>📚</span>
            <div>
              <div style={{
                fontSize: 22,
                fontWeight: 700,
                color: cores.branco,
                fontFamily: "'Playfair Display', Georgia, serif",
                lineHeight: 1,
              }}>
                Libris Etec
              </div>
              <div style={{ fontSize: 10, color: cores.amareloClaro, letterSpacing: 2, textTransform: 'uppercase' }}>
                Sistema de Biblioteca
              </div>
            </div>
          </div>

          {/* Nav tabs */}
          <nav style={{ display: 'flex', gap: 4 }}>
            {usuario.tipo === 'aluno' && [
              { id: 'acervo', label: '📖 Acervo' },
              { id: 'meus', label: '📋 Meus Empréstimos' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setAba(tab.id)} style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Lora', serif",
                fontWeight: 600,
                fontSize: 13,
                transition: 'all 0.15s',
                background: tabAtiva(tab.id) ? cores.amareloForte : 'transparent',
                color: tabAtiva(tab.id) ? cores.azulEscuro : 'rgba(255,255,255,0.8)',
              }}>
                {tab.label}
              </button>
            ))}

            {usuario.tipo === 'admin' && [
              { id: 'acervo', label: '📖 Acervo' },
              { id: 'emprestimos', label: '📋 Empréstimos' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setAba(tab.id)} style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Lora', serif",
                fontWeight: 600,
                fontSize: 13,
                transition: 'all 0.15s',
                background: tabAtiva(tab.id) ? cores.amareloForte : 'transparent',
                color: tabAtiva(tab.id) ? cores.azulEscuro : 'rgba(255,255,255,0.8)',
              }}>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: cores.branco }}>{usuario.nome}</div>
              <div style={{ fontSize: 11, color: cores.amareloClaro }}>
                {usuario.tipo === 'aluno' ? `RM: ${usuario.rm}` : '👑 Administrador'}
              </div>
            </div>
            <button onClick={handleLogout} style={{
              padding: '7px 14px',
              background: 'rgba(255,255,255,0.15)',
              color: cores.branco,
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8,
              cursor: 'pointer',
              fontFamily: "'Lora', serif",
              fontSize: 12,
              fontWeight: 600,
            }}>
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 28px' }}>

        {/* ABA ACERVO */}
        {aba === 'acervo' && (
          <div>
            {/* Cabeçalho da seção */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 24,
              flexWrap: 'wrap',
              gap: 16,
            }}>
              <div>
                <h1 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: cores.azulEscuro,
                  fontSize: 28,
                  margin: 0,
                }}>Acervo Literário</h1>
                <p style={{ color: cores.cinzaMedio, margin: '4px 0 0', fontSize: 14 }}>
                  {livrosFiltrados.length} livro{livrosFiltrados.length !== 1 ? 's' : ''} encontrado{livrosFiltrados.length !== 1 ? 's' : ''}
                </p>
              </div>
              {usuario.tipo === 'admin' && (
                <button onClick={() => setMostrarModal(true)} style={{
                  padding: '10px 22px',
                  background: `linear-gradient(90deg, ${cores.amareloForte}, #f0b90b)`,
                  color: cores.azulEscuro,
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: "'Lora', serif",
                  boxShadow: '0 3px 12px rgba(245,197,24,0.3)',
                }}>
                  ➕ Adicionar Livro
                </button>
              )}
            </div>

            {/* Filtros */}
            <div style={{
              background: cores.branco,
              borderRadius: 14,
              padding: '18px 20px',
              marginBottom: 24,
              boxShadow: '0 2px 12px rgba(26,58,92,0.07)',
              border: `1.5px solid ${cores.azulPalido}`,
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <input
                type="text"
                placeholder="🔍 Buscar por título ou autor..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                style={{
                  ...selectStyle,
                  flex: '1 1 220px',
                  padding: '9px 14px',
                }}
              />
              <select style={{ ...selectStyle, flex: '1 1 150px' }} value={filtroGenero} onChange={e => setFiltroGenero(e.target.value)}>
                <option value="">📚 Todos os gêneros</option>
                {generosDisponiveis.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select style={{ ...selectStyle, flex: '1 1 150px' }} value={filtroPais} onChange={e => setFiltroPais(e.target.value)}>
                <option value="">🌍 Todos os países</option>
                {paisesDisponiveis.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select style={{ ...selectStyle, flex: '1 1 180px' }} value={filtroAutor} onChange={e => setFiltroAutor(e.target.value)}>
                <option value="">✍️ Todos os autores</option>
                {autoresDisponiveis.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              {(busca || filtroGenero || filtroPais || filtroAutor) && (
                <button onClick={() => { setBusca(''); setFiltroGenero(''); setFiltroPais(''); setFiltroAutor(''); }}
                  style={{
                    padding: '8px 14px', background: cores.cinzaClaro, color: cores.cinzaMedio,
                    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: "'Lora', serif",
                  }}>
                  ✕ Limpar
                </button>
              )}
            </div>

            {/* Grid de livros */}
            {livrosFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: cores.cinzaMedio }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <p>Nenhum livro encontrado com esses filtros.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                gap: 20,
              }}>
                {livrosFiltrados.map(livro => (
                  <div key={livro.id} style={{ position: 'relative' }}>
                    <Livro
                      livro={livro}
                      onEmprestar={handleEmprestar}
                      usuario={usuario}
                      emprestimos={emprestimos}
                    />
                    {usuario.tipo === 'admin' && (
                      <button
                        onClick={() => handleRemoverLivro(livro.id)}
                        title="Remover livro"
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: cores.vermelho,
                          color: cores.branco,
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 13,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          boxShadow: '0 2px 6px rgba(220,53,69,0.3)',
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA EMPRÉSTIMOS (admin) */}
        {aba === 'emprestimos' && usuario.tipo === 'admin' && (
          <Emprestimos
            emprestimos={emprestimos}
            livros={livros}
            usuarios={usuarios}
            onDevolver={handleDevolver}
          />
        )}

        {/* ABA MEUS EMPRÉSTIMOS (aluno) */}
        {aba === 'meus' && usuario.tipo === 'aluno' && (
          <MeusEmprestimos
            emprestimos={emprestimos}
            livros={livros}
            usuario={usuario}
            onDevolver={handleDevolver}
          />
        )}
      </main>

      {/* MODAL ADICIONAR */}
      {mostrarModal && (
        <ModalAdicionar
          onFechar={() => setMostrarModal(false)}
          onAdicionar={handleAdicionarLivro}
        />
      )}

      {/* MODAL CONFIRMAR EMPRÉSTIMO */}
      {confirmarEmprestimo && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,58,92,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }}
          onClick={e => e.target === e.currentTarget && setConfirmarEmprestimo(null)}
        >
          <div style={{
            background: cores.branco, borderRadius: 18, padding: '36px 40px',
            maxWidth: 400, width: '100%',
            boxShadow: '0 16px 64px rgba(26,58,92,0.2)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{confirmarEmprestimo.capa}</div>
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: cores.azulEscuro, fontSize: 20, marginBottom: 6,
            }}>
              {confirmarEmprestimo.titulo}
            </h3>
            <p style={{ color: cores.cinzaMedio, fontSize: 14, marginBottom: 20 }}>
              {confirmarEmprestimo.autor}
            </p>
            <div style={{
              background: cores.azulSuave, borderRadius: 10,
              padding: '12px 16px', marginBottom: 24, fontSize: 13, color: cores.azulEscuro,
            }}>
              📅 Prazo de devolução: <strong>{PRAZO_DIAS} dias</strong><br/>
              💰 Multa por atraso: <strong>R$ 1,50/dia</strong>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmarEmprestimo(null)} style={{
                flex: 1, padding: '11px', borderRadius: 9,
                border: `1.5px solid ${cores.cinzaClaro}`,
                background: cores.branco, color: cores.cinzaMedio,
                cursor: 'pointer', fontFamily: "'Lora', serif", fontWeight: 600,
              }}>
                Cancelar
              </button>
              <button onClick={confirmarEmprestimoFn} style={{
                flex: 1, padding: '11px', borderRadius: 9, border: 'none',
                background: `linear-gradient(90deg, ${cores.azulEscuro}, ${cores.azulMedio})`,
                color: cores.branco, cursor: 'pointer',
                fontFamily: "'Lora', serif", fontWeight: 700,
                boxShadow: '0 3px 12px rgba(37,99,168,0.25)',
              }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}