import { Entity } from '@/store/types'

export interface WotTanksApiResponse {
  data: {
    status: string;
    meta: {
      count: number;
      page_total: number;
      total: number;
      limit: number;
      page: number;
    };
    data: {
      [key: string]: WotTankApiData;
    };
  };
}

export interface WotTankApiData {
  tank_id: number;
  type: string;
  name: string;
  images: {
    small_icon: string;
    contour_icon: string;
    big_icon: string;
  };
}

export interface Tank extends Entity {
  apiId: string | undefined;
  type: ApiTankType;
}

export enum ApiTankType {
  LIGHT_TANK = 'lightTank',
  MEDIUM_TANK = 'mediumTank',
  HEAVY_TANK = 'heavyTank',
  TANK_DESTROYER = 'AT-SPG',
  SPG = 'SPG'
}

export enum TankType {
  LIGHT_TANK = 'lightTank',
  MEDIUM_TANK = 'mediumTank',
  HEAVY_TANK = 'heavyTank',
  TANK_DESTROYER = 'tankDestroyer',
  SPG = 'spg'
}
