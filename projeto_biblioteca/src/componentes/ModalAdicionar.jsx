import { useState } from 'react';
import { cores } from '../estilos/cores';
import { generos, paises } from '../dados/livros';

export default function ModalAdicionar({ onFechar, onAdicionar }) {
  const [form, setForm] = useState({
    titulo: '',
    autor: '',
    pais: '',
    genero: '',
    ano: '',
    sinopse: '',
    exemplares: 1,
    capa: '📖',
  });
  const [erro, setErro] = useState('');

  const capas = ['📖', '📚', '📕', '📗', '📘', '📙', '🔖', '📜', '🗒️', '✍️'];
  const todosGeneros = [...generos, 'Outro'];
  const todosPaises = [...paises, 'Outro'];

  function handleChange(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.titulo.trim() || !form.autor.trim() || !form.pais.trim() || !form.genero.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    const novoLivro = {
      ...form,
      id: 'livro-' + Date.now(),
      ano: parseInt(form.ano) || new Date().getFullYear(),
      exemplares: parseInt(form.exemplares) || 1,
    };
    onAdicionar(novoLivro);
    onFechar();
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: `1.5px solid ${cores.cinzaClaro}`,
    fontSize: 14,
    fontFamily: "'Lora', serif",
    outline: 'none',
    boxSizing: 'border-box',
    background: cores.branco,
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: cores.azulEscuro,
    display: 'block',
    marginBottom: 5,
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(26,58,92,0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20,
    }}
      onClick={e => e.target === e.currentTarget && onFechar()}
    >
      <div style={{
        background: cores.branco,
        borderRadius: 18,
        padding: '32px 36px',
        width: '100%',
        maxWidth: 520,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 16px 64px rgba(26,58,92,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: cores.azulEscuro,
            fontSize: 22,
            margin: 0,
          }}>
            ➕ Adicionar Livro
          </h2>
          <button onClick={onFechar} style={{
            background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: cores.cinzaMedio
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Capa emoji */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Ícone da Capa</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {capas.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleChange('capa', c)}
                  style={{
                    width: 40,
                    height: 40,
                    fontSize: 20,
                    border: `2px solid ${form.capa === c ? cores.azulMedio : cores.cinzaClaro}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: form.capa === c ? cores.azulPalido : cores.branco,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Título *</label>
              <input style={inputStyle} value={form.titulo}
                onChange={e => handleChange('titulo', e.target.value)} placeholder="Título do livro" required />
            </div>

            <div>
              <label style={labelStyle}>Autor *</label>
              <input style={inputStyle} value={form.autor}
                onChange={e => handleChange('autor', e.target.value)} placeholder="Nome do autor" required />
            </div>

            <div>
              <label style={labelStyle}>Ano</label>
              <input style={inputStyle} type="number" value={form.ano}
                onChange={e => handleChange('ano', e.target.value)} placeholder="ex: 1984" />
            </div>

            <div>
              <label style={labelStyle}>País *</label>
              <select style={inputStyle} value={form.pais}
                onChange={e => handleChange('pais', e.target.value)} required>
                <option value="">Selecione...</option>
                {todosPaises.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Gênero *</label>
              <select style={inputStyle} value={form.genero}
                onChange={e => handleChange('genero', e.target.value)} required>
                <option value="">Selecione...</option>
                {todosGeneros.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Nº de Exemplares</label>
              <input style={inputStyle} type="number" min={1} value={form.exemplares}
                onChange={e => handleChange('exemplares', e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Sinopse</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
              value={form.sinopse}
              onChange={e => handleChange('sinopse', e.target.value)}
              placeholder="Breve descrição do livro..."
            />
          </div>

          {erro && (
            <div style={{
              background: '#fef2f2', color: cores.vermelho, borderRadius: 8,
              padding: '9px 12px', fontSize: 13, marginBottom: 16, border: `1px solid #fecaca`,
            }}>
              ⚠️ {erro}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onFechar} style={{
              padding: '10px 22px', borderRadius: 8, border: `1.5px solid ${cores.cinzaClaro}`,
              background: cores.branco, color: cores.cinzaMedio, cursor: 'pointer',
              fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 14,
            }}>
              Cancelar
            </button>
            <button type="submit" style={{
              padding: '10px 28px', borderRadius: 8, border: 'none',
              background: `linear-gradient(90deg, ${cores.azulEscuro}, ${cores.azulMedio})`,
              color: cores.branco, cursor: 'pointer',
              fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 14,
              boxShadow: '0 3px 10px rgba(37,99,168,0.2)',
            }}>
              ✅ Adicionar Livro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}