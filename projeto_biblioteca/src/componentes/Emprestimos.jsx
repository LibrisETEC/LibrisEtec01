import { cores } from '../estilos/cores';
import { formatarData, diasAtraso, calcularMulta, statusEmprestimo } from '../funcoes/datas';

export default function Emprestimos({ emprestimos, livros, usuarios, onDevolver }) {
  const emprestimosComInfo = emprestimos.map(e => {
    const livro = livros.find(l => l.id === e.livroId);
    const aluno = usuarios.find(u => u.id === e.alunoId);
    const status = statusEmprestimo(e);
    const atraso = diasAtraso(e.dataDevolucao);
    const multa = calcularMulta(e.dataDevolucao);
    return { ...e, livro, aluno, status, atraso, multa };
  });

  const ativos = emprestimosComInfo.filter(e => !e.devolvido);
  const atrasados = ativos.filter(e => e.status === 'atrasado');
  const devolvidos = emprestimosComInfo.filter(e => e.devolvido);

  const statusStyle = (status) => {
    if (status === 'atrasado') return { bg: '#fef2f2', txt: cores.vermelho, label: '⚠️ Atrasado' };
    if (status === 'ativo') return { bg: cores.verdeClaro, txt: cores.verde, label: '✅ Em dia' };
    return { bg: cores.cinzaClaro, txt: cores.cinzaMedio, label: '📦 Devolvido' };
  };

  function renderLinha(emp) {
    const ss = statusStyle(emp.status);
    return (
      <tr key={emp.id} style={{ borderBottom: `1px solid ${cores.cinzaClaro}` }}>
        <td style={{ padding: '12px 14px', fontSize: 14, color: cores.azulEscuro, fontWeight: 600 }}>
          {emp.livro?.capa} {emp.livro?.titulo || '?'}
        </td>
        <td style={{ padding: '12px 14px', fontSize: 13, color: cores.cinzaEscuro }}>
          {emp.aluno?.nome || '?'}
          <br />
          <span style={{ fontSize: 11, color: cores.cinzaMedio }}>
            RM: {emp.aluno?.rm || 'N/A'}
          </span>
        </td>
        <td style={{ padding: '12px 14px', fontSize: 13, color: cores.cinzaEscuro }}>
          {formatarData(emp.dataEmprestimo)}
        </td>
        <td style={{ padding: '12px 14px', fontSize: 13, color: emp.status === 'atrasado' ? cores.vermelho : cores.cinzaEscuro, fontWeight: emp.status === 'atrasado' ? 700 : 400 }}>
          {formatarData(emp.dataDevolucao)}
          {emp.status === 'atrasado' && (
            <div style={{ fontSize: 11, color: cores.vermelho }}>
              {emp.atraso} dia(s) de atraso
            </div>
          )}
        </td>
        <td style={{ padding: '12px 14px' }}>
          <span style={{
            background: ss.bg,
            color: ss.txt,
            borderRadius: 20,
            padding: '3px 10px',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'Lora', serif",
          }}>
            {ss.label}
          </span>
        </td>
        <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: parseFloat(emp.multa) > 0 ? cores.vermelho : cores.cinzaMedio }}>
          {parseFloat(emp.multa) > 0 ? `R$ ${emp.multa}` : '-'}
        </td>
        <td style={{ padding: '12px 14px' }}>
          {!emp.devolvido && (
            <button
              onClick={() => onDevolver(emp.id)}
              style={{
                padding: '6px 14px',
                background: cores.verde,
                color: cores.branco,
                border: 'none',
                borderRadius: 7,
                cursor: 'pointer',
                fontFamily: "'Lora', serif",
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              Devolver
            </button>
          )}
        </td>
      </tr>
    );
  }

  return (
    <div style={{ fontFamily: "'Lora', serif" }}>
      {/* Estatísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Empréstimos Ativos', val: ativos.length, cor: cores.azulMedio, icon: '📚' },
          { label: 'Livros Atrasados', val: atrasados.length, cor: cores.vermelho, icon: '⚠️' },
          { label: 'Total Devolvidos', val: devolvidos.length, cor: cores.verde, icon: '✅' },
        ].map(item => (
          <div key={item.label} style={{
            background: cores.branco,
            borderRadius: 12,
            padding: '18px 20px',
            boxShadow: '0 2px 12px rgba(26,58,92,0.07)',
            border: `1.5px solid ${cores.azulPalido}`,
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: item.cor }}>{item.val}</div>
            <div style={{ fontSize: 12, color: cores.cinzaMedio, marginTop: 2 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div style={{
        background: cores.branco,
        borderRadius: 14,
        boxShadow: '0 2px 16px rgba(26,58,92,0.08)',
        overflow: 'hidden',
        border: `1.5px solid ${cores.azulPalido}`,
      }}>
        <div style={{
          padding: '16px 20px',
          background: `linear-gradient(90deg, ${cores.azulEscuro}, ${cores.azulMedio})`,
          color: cores.branco,
          fontWeight: 700,
          fontSize: 15,
        }}>
          📋 Todos os Empréstimos
        </div>
        {emprestimos.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: cores.cinzaMedio }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
            Nenhum empréstimo registrado ainda.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: cores.azulSuave }}>
                  {['Livro', 'Aluno', 'Data Empréstimo', 'Data Devolução', 'Status', 'Multa', 'Ação'].map(h => (
                    <th key={h} style={{
                      padding: '10px 14px', textAlign: 'left', fontSize: 12,
                      fontWeight: 700, color: cores.azulEscuro, textTransform: 'uppercase', letterSpacing: 0.5,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {emprestimosComInfo.map(renderLinha)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}