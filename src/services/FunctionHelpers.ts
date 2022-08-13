import { DateTime } from "luxon";

export function sortNumberDesc(a: any, b: any) {
  if (a.value < b.value) {
    return 1;
  }
  if (a.value > b.value) {
    return -1;
  }
  return 0;
}

/**
 * Calcula e retorna a diferença em dias de dias úteis entre duas datas.
 * @param dataAntes Data no passado, envie-a no formato Luxon.
 * @param dataDepois Data mais recente, envie-a no formato Luxon.
 * @param feriados Lista de Feriados, uma array de strings com as datas em ISO.
 * @example diffBusinessDays(DateTime.fromISO('2022-01-01'), DateTime.fromISO('2022-12-31'))
 * @example diffBusinessDays(antes, depois, ['2022-01-01', '2022-04-15', '2022-11-15'])
 * @returns Retorna quantidade decimal da diferença de dias úteis entre duas datas. Caso o número retorne negativo, a Data no Passado está maior que a Data Recente.
 */
export function diffBusinessDays(dataAntes: DateTime, dataDepois: DateTime, feriados?: string[]) {

  const hoje = DateTime.now()
  const maxCont = 400;

  let cont = 1;
  let dataAtual = dataDepois;
  let contSubtrairDias = 0;

  // Enquanto a Data Atual for maior que anterior
  // cont e maxCont definem o máximo para o loop contar.
  while (cont <= maxCont && dataAtual >= dataAntes) {

    // Caso a Data Atual for sábado, domingo ou a data conter nos feriados...
    if (dataAtual.weekday === 7 || dataAtual.weekday === 6 || feriados?.includes(dataAtual.toISODate())) {
      
      // Caso a Data Atual seja Hoje,
      // diminui apenas a diferença entre hoje e meia noite de hoje. Se não, diminua 1
      contSubtrairDias += dataAtual.hasSame(hoje, 'day') ? hoje.diff(hoje.startOf('day'), 'day').days : 1
    }
    dataAtual = dataAtual.minus({ 'days': 1 })
    cont++;
  }

  if (cont >= maxCont) console.error(`Loop de contagem estourado. Limite: ${maxCont}`)

  // Retorna a quantidade de dias corridos menos a contagem dos dias não úteis.
  return dataDepois.diff(dataAntes, 'days').days - contSubtrairDias

}
