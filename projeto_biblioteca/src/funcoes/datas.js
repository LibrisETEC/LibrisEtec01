export const PRAZO_DIAS = 14;
export const MULTA_POR_DIA = 1.50; // R$ por dia de atraso

export function hoje() {
  return new Date().toISOString().split('T')[0];
}

export function addDias(dataStr, dias) {
  const d = new Date(dataStr);
  d.setDate(d.getDate() + dias);
  return d.toISOString().split('T')[0];
}

export function diasAtraso(dataDevolucao) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dev = new Date(dataDevolucao);
  dev.setHours(0, 0, 0, 0);
  const diff = Math.floor((hoje - dev) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function calcularMulta(dataDevolucao) {
  const atraso = diasAtraso(dataDevolucao);
  return (atraso * MULTA_POR_DIA).toFixed(2);
}

export function formatarData(dataStr) {
  if (!dataStr) return '-';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function statusEmprestimo(emprestimo) {
  if (emprestimo.devolvido) return 'devolvido';
  const atraso = diasAtraso(emprestimo.dataDevolucao);
  if (atraso > 0) return 'atrasado';
  return 'ativo';
}