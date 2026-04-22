import { useState } from 'react';
import { cores } from '../estilos/cores';

export default function Login({ onLogin }) {
  const [tipoLogin, setTipoLogin] = useState('aluno'); // 'aluno' | 'admin'
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    const usuarios = JSON.parse(localStorage.getItem('libris_usuarios') || '[]');
    let usuario = null;

    if (tipoLogin === 'aluno') {
      usuario = usuarios.find(u =>
        u.tipo === 'aluno' &&
        (u.email === identificador || u.rm === identificador) &&
        u.senha === senha
      );
    } else {
      usuario = usuarios.find(u =>
        u.tipo === 'admin' &&
        (u.email === identificador || u.registroProfessor === identificador) &&
        u.senha === senha
      );
    }

    if (usuario) {
      onLogin(usuario);
    } else {
      setErro('Credenciais inválidas. Verifique e tente novamente.');
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 8,
    border: `1.5px solid ${cores.cinzaClaro}`,
    fontSize: 15,
    fontFamily: "'Lora', serif",
    outline: 'none',
    background: cores.branco,
    boxSizing: 'border-box',
    transition: 'border 0.15s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${cores.azulSuave} 0%, ${cores.branco} 60%, ${cores.amareloPalido} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Lora', serif",
    }}>
      <div style={{
        background: cores.branco,
        borderRadius: 20,
        boxShadow: '0 8px 48px rgba(26,58,92,0.13)',
        padding: '48px 44px',
        width: '100%',
        maxWidth: 400,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📚</div>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: cores.azulEscuro,
            fontFamily: "'Playfair Display', Georgia, serif",
            letterSpacing: 1,
          }}>Libris Etec</div>
          <div style={{
            fontSize: 12,
            color: cores.azulClaro,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginTop: 2,
          }}>Sistema de Biblioteca</div>
        </div>

        {/* Toggle tipo */}
        <div style={{
          display: 'flex',
          borderRadius: 10,
          overflow: 'hidden',
          border: `1.5px solid ${cores.azulPalido}`,
          marginBottom: 28,
        }}>
          {['aluno', 'admin'].map(tipo => (
            <button
              key={tipo}
              onClick={() => { setTipoLogin(tipo); setErro(''); setIdentificador(''); setSenha(''); }}
              style={{
                flex: 1,
                padding: '10px 0',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Lora', serif",
                fontWeight: 600,
                fontSize: 14,
                transition: 'all 0.18s',
                background: tipoLogin === tipo ? cores.azulMedio : cores.branco,
                color: tipoLogin === tipo ? cores.branco : cores.azulMedio,
              }}
            >
              {tipo === 'aluno' ? '👤 Aluno' : '🔑 Administrador'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{
              fontSize: 13, fontWeight: 600, color: cores.azulEscuro, display: 'block', marginBottom: 6
            }}>
              {tipoLogin === 'aluno' ? 'Email ou RM (5 dígitos)' : 'Email ou Registro de Professor'}
            </label>
            <input
              type="text"
              value={identificador}
              onChange={e => setIdentificador(e.target.value)}
              placeholder={tipoLogin === 'aluno' ? 'ex: 12345 ou email@aluno.etec.br' : 'ex: PROF01 ou email@etec.sp.gov.br'}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              fontSize: 13, fontWeight: 600, color: cores.azulEscuro, display: 'block', marginBottom: 6
            }}>
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="Sua senha"
              style={inputStyle}
              required
            />
          </div>

          {erro && (
            <div style={{
              background: '#fef2f2',
              color: cores.vermelho,
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              marginBottom: 18,
              border: `1px solid #fecaca`,
            }}>
              ⚠️ {erro}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '13px',
              background: `linear-gradient(90deg, ${cores.azulEscuro}, ${cores.azulMedio})`,
              color: cores.branco,
              border: 'none',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Lora', serif",
              letterSpacing: 0.5,
              boxShadow: '0 4px 14px rgba(37,99,168,0.25)',
              transition: 'opacity 0.18s',
            }}
            onMouseOver={e => e.target.style.opacity = '0.9'}
            onMouseOut={e => e.target.style.opacity = '1'}
          >
            Entrar
          </button>
        </form>

        <div style={{
          marginTop: 24,
          padding: '14px',
          background: cores.azulSuave,
          borderRadius: 8,
          fontSize: 12,
          color: cores.cinzaMedio,
          lineHeight: 1.7,
        }}>
          <strong style={{ color: cores.azulEscuro }}>Acesso de teste:</strong><br/>
          <span>Aluno: RM <strong>12345</strong> / senha <strong>aluno123</strong></span><br/>
          <span>Admin: <strong>PROF01</strong> / senha <strong>admin123</strong></span>
        </div>
      </div>
    </div>
  );
}