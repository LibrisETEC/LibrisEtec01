import { cores } from '../estilos/cores';
import { formatarData, calcularMulta, statusEmprestimo, diasAtraso } from '../funcoes/datas';

export default function MeusEmprestimos({ emprestimos, livros, usuario, onDevolver }) {
  const meusEmprestimos = emprestimos
    .filter(e => e.alunoId === usuario.id)
    .map(e => {
      const livro = livros.find(l => l.id === e.livroId);
      const status = statusEmprestimo(e);
      const multa = calcularMulta(e.dataDevolucao);
      const atraso = diasAtraso(e.dataDevolucao);
      return { ...e, livro, status, multa, atraso };
    });

  const ativos = meusEmprestimos.filter(e => !e.devolvido);
  const historico = meusEmprestimos.filter(e => e.devolvido);

  const statusConfig = {
    atrasado: { bg: '#fef2f2', txt: cores.vermelho, label: '⚠️ Atrasado', border: '#fecaca' },
    ativo: { bg: cores.verdeClaro, txt: cores.verde, label: '✅ Em dia', border: '#a7f3d0' },
    devolvido: { bg: cores.cinzaClaro, txt: cores.cinzaMedio, label: '📦 Devolvido', border: '#e2e8f0' },
  };

  function renderCard(emp) {
    const sc = statusConfig[emp.status];
    return (
      <div key={emp.id} style={{
        background: cores.branco,
        borderRadius: 14,
        border: `1.5px solid ${sc.border}`,
        padding: '18px 20px',
        boxShadow: '0 2px 10px rgba(26,58,92,0.06)',
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
      }}>
        {/* Emoji */}
        <div style={{
          background: `linear-gradient(135deg, ${cores.azulEscuro}, ${cores.azulMedio})`,
          borderRadius: 10,
          width: 54,
          height: 54,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          flexShrink: 0,
        }}>
          {emp.livro?.capa}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: 15,
                color: cores.azulEscuro,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
              }}>
                {emp.livro?.titulo}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: cores.azulClaro }}>
                {emp.livro?.autor}
              </p>
            </div>
            <span style={{
              background: sc.bg,
              color: sc.txt,
              padding: '3px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'Lora', serif",
            }}>
              {sc.label}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 20, marginTop: 10, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 12, color: cores.cinzaMedio }}>
              <span style={{ fontWeight: 600, color: cores.azulEscuro }}>Emprestado: </span>
              {formatarData(emp.dataEmprestimo)}
            </div>
            <div style={{ fontSize: 12, color: emp.status === 'atrasado' ? cores.vermelho : cores.cinzaMedio }}>
              <span style={{ fontWeight: 600, color: emp.status === 'atrasado' ? cores.vermelho : cores.azulEscuro }}>
                Devolução: 
              </span>{' '}
              {formatarData(emp.dataDevolucao)}
              {emp.status === 'atrasado' && (
                <span style={{ marginLeft: 6, fontWeight: 700 }}>
                  ({emp.atraso} dia{emp.atraso > 1 ? 's' : ''} atrasado)
                </span>
              )}
            </div>
          </div>

          {parseFloat(emp.multa) > 0 && !emp.devolvido && (
            <div style={{
              marginTop: 10,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              padding: '7px 12px',
              fontSize: 13,
              color: cores.vermelho,
              fontWeight: 700,
              display: 'inline-block',
            }}>
              💰 Multa acumulada: R$ {emp.multa}
              <span style={{ fontSize: 11, fontWeight: 400, marginLeft: 6 }}>
                (R$ 1,50/dia)
              </span>
            </div>
          )}

          {!emp.devolvido && (
            <button
              onClick={() => onDevolver(emp.id)}
              style={{
                marginTop: 12,
                padding: '7px 18px',
                background: cores.verde,
                color: cores.branco,
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: "'Lora', serif",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              📥 Devolver Livro
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Lora', serif" }}>
      <h2 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        color: cores.azulEscuro,
        fontSize: 22,
        marginBottom: 24,
      }}>
        📚 Meus Empréstimos
      </h2>

      {ativos.length === 0 && historico.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 60,
          color: cores.cinzaMedio,
          background: cores.branco,
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(26,58,92,0.07)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 16 }}>Você ainda não tem nenhum empréstimo.</p>
          <p style={{ fontSize: 14 }}>Vá ao acervo e escolha um livro!</p>
        </div>
      )}

      {ativos.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ color: cores.azulMedio, fontSize: 16, marginBottom: 14 }}>
            📖 Livros Atuais ({ativos.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ativos.map(renderCard)}
          </div>
        </div>
      )}

      {historico.length > 0 && (
        <div>
          <h3 style={{ color: cores.cinzaMedio, fontSize: 16, marginBottom: 14 }}>
            📦 Histórico ({historico.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.75 }}>
            {historico.map(renderCard)}
          </div>
        </div>
      )}
    </div>
  );
}