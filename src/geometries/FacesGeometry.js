import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

class FacesGeometry extends BufferGeometry {

    constructor(
        inputVertices = [new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)],
        inputIndices = [
            0, 1, 2,
            0, 2, 3,
            0, 3, 1,
            3, 2, 1]
        ) {

        super();

        this.type = 'FacesGeometry';

        this.parameters = {
            inputVertices: inputVertices,
            inputIndices: inputIndices
        };
  
        const vertices = [];
        const normals = [];
        const uvs = [];
        const indices = [];

        for (let i = 0; i<inputIndices.length/3; i++) {
            vertices.push(inputVertices[inputIndices[i*3+0]].x, inputVertices[inputIndices[i*3+0]].y, inputVertices[inputIndices[i*3+0]].z);
            vertices.push(inputVertices[inputIndices[i*3+1]].x, inputVertices[inputIndices[i*3+1]].y, inputVertices[inputIndices[i*3+1]].z);
            vertices.push(inputVertices[inputIndices[i*3+2]].x, inputVertices[inputIndices[i*3+2]].y, inputVertices[inputIndices[i*3+2]].z);
            const normal = new Vector3().crossVectors(inputVertices[inputIndices[i*3+0]].clone().sub(inputVertices[inputIndices[i*3+1]]), inputVertices[inputIndices[i*3+0]].clone().sub(inputVertices[inputIndices[i*3+2]])).normalize();
            normals.push(normal.x, normal.y, normal.z);
            normals.push(normal.x, normal.y, normal.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(0, 0, 0, 0, 0, 0);
            indices.push(i*3+0, i*3+1, i*3+2);
        }
        
        this.setIndex(indices);
        this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
        this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
        this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

    }

    copy( source ) {

        super.copy( source );

        this.parameters = Object.assign( {}, source.parameters );

        return this;

    }

}

export { FacesGeometry };
