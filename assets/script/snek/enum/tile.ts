export enum TILE_TYPE {
  FLOOR = "floor",
  WALL = "wall",
}

export function getTileType(tileIndex: number) {
  switch (tileIndex) {
    case 0: {
      return TILE_TYPE.FLOOR;
    }

    case 1: {
      return TILE_TYPE.WALL;
    }

    default: {
      return TILE_TYPE.FLOOR;
    }
  }
}
