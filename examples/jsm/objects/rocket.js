import * as THREE from 'three';
import { mergeGeometries } from '../../jsm/utils/BufferGeometryUtils.js'

export class launchVehicleModel {
    constructor(radius, bodyLength, noseConeLength, flameLength, finLength, finThickness, finHeight) {
        const lengthSegments = 2
        const radialSegments = 32

        // Create the vehicle's body
        const launchVehicleBodyGeometry = new THREE.CylinderGeometry(radius, radius, bodyLength, radialSegments, lengthSegments, false)
        launchVehicleBodyGeometry.name = "body"
        launchVehicleBodyGeometry.translate(0, bodyLength/2, 0)
        // Create the nose cone
        const launchVehicleNoseConeGeometry = new THREE.ConeGeometry(radius, noseConeLength, radialSegments, lengthSegments, true)
        launchVehicleNoseConeGeometry.name = "noseCone"
        launchVehicleNoseConeGeometry.translate(0, (bodyLength+noseConeLength)/2 + bodyLength/2, 0)
        // Create the fins
        const finVertices = [
            new THREE.Vector3(0, finLength, radius),   // Leading edge of fin
            new THREE.Vector3(finThickness/2, 0.1, radius),  // Left trailing edge of fin
            new THREE.Vector3(-finThickness/2, 0.1, radius),  // Right trailing edge of fin
            new THREE.Vector3(0, 0, radius+finHeight)  // Back trailing edge of fin
        ]
        const finIndices = [
            0, 1, 2,
            0, 2, 3,
            0, 3, 1,
            3, 2, 1
        ]
        const launchVehicleFin0Geometry = new THREE.FacesGeometry(finVertices, finIndices)

        launchVehicleFin0Geometry.name = "fin0"
        const launchVehicleFin1Geometry = launchVehicleFin0Geometry.clone()
        launchVehicleFin1Geometry.name = "fin1"
        launchVehicleFin1Geometry.rotateY(Math.PI*2/3)
        const launchVehicleFin2Geometry = launchVehicleFin0Geometry.clone()
        launchVehicleFin2Geometry.name = "fin2"
        launchVehicleFin2Geometry.rotateY(-Math.PI*2/3)

        // Create the vehicle's flame
        const launchVehicleFlameGeometry = new THREE.CylinderGeometry(radius*.9, radius*0.4, flameLength, radialSegments, lengthSegments, false)
        launchVehicleFlameGeometry.name = "rocketEngine"
        launchVehicleFlameGeometry.translate(0, -(bodyLength+flameLength)/2 + bodyLength/2, 0)

        // Merge the nosecone and fins into the body
        const launchVehicleGeometry = mergeGeometries([launchVehicleBodyGeometry, launchVehicleNoseConeGeometry, launchVehicleFin0Geometry, launchVehicleFin1Geometry, launchVehicleFin2Geometry])
        const launchVehicleMaterial = new THREE.MeshPhongMaterial( {color: 0x7f3f00})
        const launchVehicleFlameMaterial = new THREE.MeshPhongMaterial( {color: 0x000000, emissive: 0xdfa0df, emissiveIntensity: 1.25, transparent: true, opacity: 0.5})
        const launchVehicleBodyMesh = new THREE.Mesh(launchVehicleGeometry, launchVehicleMaterial)
        launchVehicleBodyMesh.name = 'body'
        const launchVehicleFlameMesh = new THREE.Mesh(launchVehicleFlameGeometry, launchVehicleFlameMaterial)
        launchVehicleFlameMesh.name = 'flame'
        const launchVehiclePointLightMesh = new THREE.Points(
            new THREE.BufferGeometry().setAttribute( 'position', new THREE.Float32BufferAttribute( [0, 0, 0], 3) ),
            new THREE.PointsMaterial( { color: 0xFFFFFF } ) )
        launchVehiclePointLightMesh.name = 'pointLight'
        const launchVehicleMesh = new THREE.Group().add(launchVehicleBodyMesh).add(launchVehicleFlameMesh)
        launchVehicleMesh.name = 'launchVehicle'
        launchVehiclePointLightMesh.visible = true
        launchVehicleMesh.add(launchVehiclePointLightMesh)
        return launchVehicleMesh
    }
}
