import { Router } from 'express'
import { getCiudadesByRegion, getRegiones } from '../controllers/ubicacion.controller.js'

const router = Router()

router.get('/regiones', getRegiones)
router.get('/regiones/:codigoRegion/ciudades', getCiudadesByRegion)

export default router
