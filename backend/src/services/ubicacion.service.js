import { AppDataSource } from '../config/configDb.js'

export async function getRegionesService() {
  const regionRepository = AppDataSource.getRepository('Region')
  return regionRepository.find({
    order: { nombre: 'ASC' },
  })
}

export async function getCiudadesByRegionService(codigoRegion) {
  const codigoRegionNumero = Number(codigoRegion)
  if (!Number.isInteger(codigoRegionNumero) || codigoRegionNumero <= 0) {
    throw new Error('El codigoRegion debe ser un número entero positivo.')
  }

  const ciudadRepository = AppDataSource.getRepository('Ciudad')
  return ciudadRepository.find({
    where: {
      region: { codigo: codigoRegionNumero },
    },
    relations: { region: true },
    order: { nombre: 'ASC' },
  })
}
