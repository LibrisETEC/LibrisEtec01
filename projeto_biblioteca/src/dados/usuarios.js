// Estrutura de usuários persistida no localStorage
// Tipo: 'aluno' | 'admin'
// Login aluno: email ou rm (5 dígitos)
// Login admin: email ou registroProfessor

export const usuariosIniciais = [
  {
    id: 'admin-1',
    tipo: 'admin',
    nome: 'Profª Ana Bibliotecária',
    email: 'ana@etec.sp.gov.br',
    registroProfessor: 'PROF01',
    senha: 'admin123',
  },
  {
    id: 'admin-2',
    tipo: 'admin',
    nome: 'Prof. Carlos Souza',
    email: 'carlos@etec.sp.gov.br',
    registroProfessor: 'PROF02',
    senha: 'admin456',
  },
  {
    id: 'aluno-1',
    tipo: 'aluno',
    nome: 'Lucas Ferreira',
    email: 'lucas@aluno.etec.br',
    rm: '12345',
    senha: 'aluno123',
  },
  {
    id: 'aluno-2',
    tipo: 'aluno',
    nome: 'Maria Clara',
    email: 'maria@aluno.etec.br',
    rm: '23456',
    senha: 'aluno456',
  },
  {
    id: 'aluno-3',
    tipo: 'aluno',
    nome: 'João Pedro',
    email: 'joao@aluno.etec.br',
    rm: '34567',
    senha: 'aluno789',
  },
];