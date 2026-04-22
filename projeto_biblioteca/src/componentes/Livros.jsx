import { cores } from '../estilos/cores';

export default function Livro({ livro, onEmprestar, usuario, emprestimos }) {
  const emprestimosAtivos = emprestimos.filter(
    e => e.livroId === livro.id && !e.devolvido
  );
  const disponiveis = livro.exemplares - emprestimosAtivos.length;

  const meuEmprestimo = usuario?.tipo === 'aluno'
    ? emprestimos.find(e => e.livroId === livro.id && e.alunoId === usuario.id && !e.devolvido)
    : null;

  const generoColors = {
    'Romance': { bg: '#fce7f3', txt: '#9d174d' },
    'Naturalismo': { bg: '#ecfdf5', txt: '#065f46' },
    'Modernismo': { bg: '#fef3c7', txt: '#92400e' },
    'Distopia': { bg: '#f0fdf4', txt: '#166534' },
    'Aventura': { bg: '#fffbeb', txt: '#78350f' },
    'Teatro': { bg: '#ede9fe', txt: '#4c1d95' },
    'Mistério': { bg: '#f1f5f9', txt: '#334155' },
    'Poesia Épica': { bg: '#fef9c3', txt: '#713f12' },
    'Contos': { bg: '#e0f2fe', txt: '#075985' },
    'Conto': { bg: '#e0f2fe', txt: '#075985' },
    'Novela': { bg: '#f0fdf4', txt: '#14532d' },
    'Realismo Mágico': { bg: '#fdf4ff', txt: '#701a75' },
    default: { bg: cores.azulPalido, txt: cores.azulEscuro },
  };
  const gc = generoColors[livro.genero] || generoColors.default;

  return (
    <div style={{
      background: cores.branco,
      borderRadius: 16,
      boxShadow: '0 2px 16px rgba(26,58,92,0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.18s, box-shadow 0.18s',
      border: `1.5px solid ${cores.azulPalido}`,
    }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(26,58,92,0.14)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(26,58,92,0.08)';
      }}
    >
      {/* Capa decorativa */}
      <div style={{
        background: `linear-gradient(135deg, ${cores.azulEscuro} 0%, ${cores.azulMedio} 100%)`,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 42,
        position: 'relative',
      }}>
        {livro.capa}
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: disponiveis > 0 ? cores.amareloForte : cores.vermelho,
          color: disponiveis > 0 ? cores.azulEscuro : cores.branco,
          borderRadius: 20,
          padding: '3px 10px',
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "'Lora', serif",
        }}>
          {disponiveis > 0 ? `${disponiveis} disp.` : 'Indisponível'}
        </div>
      </div>

      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{
            background: gc.bg,
            color: gc.txt,
            borderRadius: 20,
            padding: '2px 9px',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'Lora', serif",
          }}>
            {livro.genero}
          </span>
        </div>

        <h3 style={{
          fontSize: 15,
          fontWeight: 700,
          color: cores.azulEscuro,
          margin: '0 0 4px',
          fontFamily: "'Playfair Display', Georgia, serif",
          lineHeight: 1.3,
        }}>
          {livro.titulo}
        </h3>

        <p style={{ fontSize: 13, color: cores.azulMedio, margin: '0 0 4px', fontWeight: 600 }}>
          {livro.autor}
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: cores.cinzaMedio }}>🌍 {livro.pais}</span>
          <span style={{ fontSize: 11, color: cores.cinzaMedio }}>📅 {livro.ano > 0 ? livro.ano : `${Math.abs(livro.ano)} a.C.`}</span>
        </div>

        <p style={{
          fontSize: 12,
          color: cores.cinzaMedio,
          lineHeight: 1.5,
          flex: 1,
          margin: '0 0 14px',
        }}>
          {livro.sinopse}
        </p>

        {usuario?.tipo === 'aluno' && (
          <div>
            {meuEmprestimo ? (
              <div style={{
                background: cores.verdeClaro,
                color: cores.verde,
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 600,
                textAlign: 'center',
              }}>
                ✅ Você já tem este livro
              </div>
            ) : (
              <button
                disabled={disponiveis === 0}
                onClick={() => onEmprestar(livro)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: disponiveis > 0
                    ? `linear-gradient(90deg, ${cores.azulEscuro}, ${cores.azulMedio})`
                    : cores.cinzaClaro,
                  color: disponiveis > 0 ? cores.branco : cores.cinzaMedio,
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: disponiveis > 0 ? 'pointer' : 'not-allowed',
                  fontFamily: "'Lora', serif",
                  transition: 'opacity 0.15s',
                }}
                onMouseOver={e => disponiveis > 0 && (e.target.style.opacity = '0.88')}
                onMouseOut={e => (e.target.style.opacity = '1')}
              >
                {disponiveis > 0 ? '📚 Pegar Emprestado' : '❌ Indisponível'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}