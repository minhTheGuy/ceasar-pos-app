import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url).replace('\\src\\utils', '')

const __dirname = path.dirname(__filename)

export { __dirname }
