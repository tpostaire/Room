import { Map } from '@/store/types'

export default class WotMaps {
  private maps: Map[] = [
    {
      desc: 'Two avenues of attack are divided by a swamp. The eastern side is ideal for trench warfare. The western side is favorable to a hard push. The swamp provides a risky but perhaps unexpected attack route.',
      icon: require('@/assets/games/wot/icons/maps/01_karelia.png'),
      name: 'Karelia',
      width: 760,
      height: 760,
      ratio: 0
    },
    {
      desc: "Generally open terrain featuring a large hill and a railway embankment. Scattered trees provide concealment for tank destroyers. On the offensive, strike against the enemy's flanks, but do not leave your own flanks unguarded. Artillery enjoys good fields of fire, but is still vulnerable to raids by light tanks.",
      icon: require('@/assets/games/wot/icons/maps/05_prohorovka.png'),
      name: 'Prokhorovka',
      width: 760,
      height: 760,
      ratio: 0
    }
  ]

  getMaps = (): Map[] => {
    return this.maps
  }
}
