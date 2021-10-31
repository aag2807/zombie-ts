//ZOMBIES
import tankzee from '../assets/tankzee.json'
import dogzee from '../assets/dogzee.json'
import femalezee from '../assets/femalezee.json'
import nursezee from '../assets/nursezee.json'
import quickzee from '../assets/quickzee.json'
import copzee from '../assets/copzee.json'

type asset = 
  typeof tankzee | 
  typeof dogzee |
  typeof femalezee | 
  typeof nursezee |
  typeof quickzee |
  typeof copzee

export const zombies: asset[] = [
  tankzee,
  dogzee,
  femalezee,
  nursezee,
  quickzee,
  copzee,
]
