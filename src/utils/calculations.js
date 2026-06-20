export const TARIFA_OCTOPUS_RELAX = {
  precioP1: 0.093,
  precioP2: 0.093,
  precioEnergia: 0.1154,
  cuotaFija: 0,
}

export const VALORES_FIJOS = {
  bonoSocialDia: 0.019121,
  alquilerEquiposDia: 0.027,
  iva: 21,
  impuestoElectrico: 5.11269632,
}

export const TIPO_TARIFA = {
  FIJA: 'fija',
  TRAMOS: 'tramos',
}

export function calcularTerminoEnergia({
  tipoTarifa = TIPO_TARIFA.FIJA,
  consumo = 0,
  precioEnergia = 0,
  consumoPunta = 0,
  consumoLlano = 0,
  consumoValle = 0,
  precioEnergiaPunta = 0,
  precioEnergiaLlano = 0,
  precioEnergiaValle = 0,
}) {
  if (tipoTarifa === TIPO_TARIFA.TRAMOS) {
    return (
      consumoPunta * precioEnergiaPunta +
      consumoLlano * precioEnergiaLlano +
      consumoValle * precioEnergiaValle
    )
  }

  return consumo * precioEnergia
}

export function calcularConsumoTotal({
  tipoTarifa = TIPO_TARIFA.FIJA,
  consumo = 0,
  consumoPunta = 0,
  consumoLlano = 0,
  consumoValle = 0,
}) {
  if (tipoTarifa === TIPO_TARIFA.TRAMOS) {
    return consumoPunta + consumoLlano + consumoValle
  }

  return consumo
}

export function calcularTarifa({
  tipoTarifa = TIPO_TARIFA.FIJA,
  consumo = 0,
  consumoPunta = 0,
  consumoLlano = 0,
  consumoValle = 0,
  dias,
  p1,
  p2,
  precioP1,
  precioP2,
  precioEnergia = 0,
  precioEnergiaPunta = 0,
  precioEnergiaLlano = 0,
  precioEnergiaValle = 0,
  bonoSocialDia,
  alquilerEquiposDia,
  cuotaFija,
  iva,
  impuestoElectrico,
}) {
  const terminoEnergia = calcularTerminoEnergia({
    tipoTarifa,
    consumo,
    precioEnergia,
    consumoPunta,
    consumoLlano,
    consumoValle,
    precioEnergiaPunta,
    precioEnergiaLlano,
    precioEnergiaValle,
  })

  const consumoTotal = calcularConsumoTotal({
    tipoTarifa,
    consumo,
    consumoPunta,
    consumoLlano,
    consumoValle,
  })

  const terminoPotencia = dias * (p1 * precioP1 + p2 * precioP2)
  const bonoSocialTotal = dias * bonoSocialDia
  const alquilerTotal = dias * alquilerEquiposDia

  const subtotalSinImpuestos =
    terminoEnergia +
    terminoPotencia +
    bonoSocialTotal +
    alquilerTotal +
    cuotaFija

  const baseImpuestoElectrico =
    terminoEnergia + terminoPotencia + bonoSocialTotal

  const impElectrico = baseImpuestoElectrico * (impuestoElectrico / 100)

  const baseIva = subtotalSinImpuestos + impElectrico
  const impIva = baseIva * (iva / 100)

  const total = subtotalSinImpuestos + impElectrico + impIva

  return {
    tipoTarifa,
    consumoTotal,
    terminoEnergia,
    terminoPotencia,
    bonoSocialTotal,
    alquilerTotal,
    cuotaFija,
    impElectrico,
    impIva,
    total,
    subtotalSinImpuestos,
    baseImpuestoElectrico,
    baseIva,
  }
}

export function calcularComparativa(resultadoOctopus, resultadoUsuario) {
  const diferenciaAbsoluta = resultadoUsuario.total - resultadoOctopus.total
  const diferenciaRelativa =
    resultadoOctopus.total > 0
      ? (diferenciaAbsoluta / resultadoOctopus.total) * 100
      : 0

  return {
    diferenciaAbsoluta,
    diferenciaRelativa,
    octopusEsMasBarata: diferenciaAbsoluta > 0,
    usuarioEsMasBarata: diferenciaAbsoluta < 0,
    empate: diferenciaAbsoluta === 0,
  }
}

export function validarNumeros(valores) {
  return valores.every((valor) => Number.isFinite(valor) && valor >= 0)
}

export function toNumber(value) {
  return Number.parseFloat(value)
}

export function formatearEuros(value) {
  return `${value.toFixed(2)} €`
}

export function formatearPorcentaje(value) {
  return `${value.toFixed(2)}%`
}
