import { Api, Game, Map } from '@/store/types'
import axios from 'axios'
import { ApiHeader } from '@/types/games'
import { JWTRegion } from '@/store/modules/app/authentication'
import { ApiTankType, Tank, TankType, WotTankApiData, WotTanksApiResponse } from '@/types/games/wot'
import { v4 as uuid } from 'uuid'
import { EntitiesDataApi, MapsDataApi } from '@/types/games/wows'
import WotMaps from '@/types/games/wot/maps'

export const getWotApiData = async (token: string, setGameApi: (api: Api) => void): Promise<void> => {
  const scaleIcon = 0.8 // Sets default scale for all entities

  const canvasIcons = {
    lightTank: {
      image: require('@/assets/games/wot/icons/lightTank.svg'),
      width: 34 * scaleIcon,
      height: 18 * scaleIcon
    },
    mediumTank: {
      image: require('@/assets/games/wot/icons/mediumTank.svg'),
      width: 34 * scaleIcon,
      height: 18 * scaleIcon
    },
    heavyTank: {
      image: require('@/assets/games/wot/icons/heavyTank.svg'),
      width: 34 * scaleIcon,
      height: 18 * scaleIcon
    },
    tankDestroyer: {
      image: require('@/assets/games/wot/icons/AT-SPG.svg'),
      width: 33 * scaleIcon,
      height: 18 * scaleIcon
    },
    spg: {
      image: require('@/assets/games/wot/icons/SPG.svg'),
      width: 33 * scaleIcon,
      height: 18 * scaleIcon
    }
  }

  function getTankType (apiTankType: ApiTankType): string {
    if (apiTankType === ApiTankType.TANK_DESTROYER) {
      return TankType.TANK_DESTROYER
    } else if (apiTankType === ApiTankType.SPG) {
      return TankType.SPG
    }
    return apiTankType
  }

  const headers: ApiHeader = {
    Authorization: token,
    'X-Region': JWTRegion.EU,
    'X-Game': Game.WOT
  }
  const tanksResponse: WotTanksApiResponse = await axios.get(`${process.env.VUE_APP_MS_WG_API}/wot/encyclopedia/vehicles/`, { headers })
  const pageTotal = tanksResponse.data.meta.page_total
  let apiTanks: WotTankApiData[] = []
  for (let i = 1; i <= pageTotal; i++) {
    const response: WotTanksApiResponse = await axios.get(`${process.env.VUE_APP_MS_WG_API}/wot/encyclopedia/vehicles/?page_no=${i}`, { headers })
    apiTanks = apiTanks.concat(Object.values(response.data.data))
  }
  let tanks: Tank[] = apiTanks.map((tank: WotTankApiData): Tank => ({
    id: uuid(),
    apiId: tank.tank_id.toString(),
    name: tank.name,
    title: tank.name,
    type: tank.type as ApiTankType,
    game: Game.WOT,
    image: require('@/assets/games/wot/images/' + tank.type + '_image.png'),
    canvasImage: {
      image: tank.images.small_icon,
      dimensions: {
        width: canvasIcons[getTankType(tank.type as ApiTankType) as TankType].width,
        height: canvasIcons[getTankType(tank.type as ApiTankType) as TankType].height
      }
    }
  }))

  const defaultTanks: Tank[] = [
    {
      id: '1',
      apiId: undefined,
      name: 'LT',
      title: 'Light Tank',
      type: ApiTankType.LIGHT_TANK,
      game: Game.WOT,
      image: require('@/assets/games/wot/images/lightTank_image.png'),
      canvasImage: {
        image: canvasIcons.lightTank.image,
        dimensions: {
          width: canvasIcons.lightTank.width,
          height: canvasIcons.lightTank.height
        }
      }
    },
    {
      id: '2',
      apiId: undefined,
      name: 'MT',
      title: 'Medium Tank',
      type: ApiTankType.MEDIUM_TANK,
      game: Game.WOT,
      image: require('@/assets/games/wot/images/mediumTank_image.png'),
      canvasImage: {
        image: canvasIcons.mediumTank.image,
        dimensions: {
          width: canvasIcons.mediumTank.width,
          height: canvasIcons.mediumTank.height
        }
      }
    },
    {
      id: '3',
      apiId: undefined,
      name: 'HT',
      title: 'Heavy Tank',
      type: ApiTankType.HEAVY_TANK,
      game: Game.WOT,
      image: require('@/assets/games/wot/images/heavyTank_image.png'),
      canvasImage: {
        image: canvasIcons.heavyTank.image,
        dimensions: {
          width: canvasIcons.heavyTank.width,
          height: canvasIcons.heavyTank.height
        }
      }
    },
    {
      id: '4',
      apiId: undefined,
      name: 'TD',
      title: 'Tank Destroyer',
      type: ApiTankType.TANK_DESTROYER,
      game: Game.WOT,
      image: require('@/assets/games/wot/images/AT-SPG_image.png'),
      canvasImage: {
        image: canvasIcons.tankDestroyer.image,
        dimensions: {
          width: canvasIcons.tankDestroyer.width,
          height: canvasIcons.tankDestroyer.height
        }
      }
    },
    {
      id: '5',
      apiId: undefined,
      name: 'SPG',
      title: 'Artillery',
      type: ApiTankType.SPG,
      game: Game.WOT,
      image: require('@/assets/games/wot/images/SPG_image.png'),
      canvasImage: {
        image: canvasIcons.spg.image,
        dimensions: {
          width: canvasIcons.spg.width,
          height: canvasIcons.spg.height
        }
      }
    }
  ]

  tanks = tanks.concat(defaultTanks)
  const maps: Map[] = new WotMaps().getMaps()

  setGameApi({
    name: 'wot.encyclopedia.tanks',
    data: {
      name: 'wot.encyclopedia.tanks',
      entities: tanks
    } as EntitiesDataApi
  })

  setGameApi({
    name: 'wot.encyclopedia.maps',
    data: {
      name: 'wot.encyclopedia.maps',
      maps: maps
    } as MapsDataApi
  })
}
