import Spritesheet from "../graphics/spritesheet.js";
import Renderer from "../graphics/renderer.js";

const spritesheet = new Spritesheet(512, 8);

class Chunk
{
  static size = 16;

  constructor()
  {
    this.position = { x: 0, y: 0 };
    this.entities = [];
    this.voxels = [];
  }

  load(data)
  {
    this.position = data.position;
    this.entities = data.entities;
    this.voxels = data.voxels;
  }

  // Updates any changes to the contents of a chunk
  update(data)
  {
    data.delta_entities.forEach((delta_entitiy) => {
      this.entities.get(delta_entitiy.id).update(delta_entitiy.delta);
    });

    data.delta_voxels.forEach((delta_voxel) => {
      thhis.voxels.get(delta_voxel.id).update(delta_voxel.delta);
    });
  }

  draw()
  {
    for (let x = 0; x < this.size; ++x)
    {
      for (let y = 0; y < this.size; ++y)
      {
        Renderer.draw_sprite(this.position.x + x * 8, this.position.y + y * 8, spritesheet.get_sprite(0, 0));
      }
    }
  }
}

export default Chunk;