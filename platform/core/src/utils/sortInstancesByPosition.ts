import { vec3 } from 'gl-matrix';

export default function sortInstances(instances: Array<any>) {
  if (instances.length <= 1) {
    return instances;
  }

  // CRITICAL FIX: Filter out instances without spatial position data
  // This handles:
  // 1. Scout/Localizer images (2D projection, no 3D position)
  // 2. 3D Volume Renderings (Heart_Batch, MIP, VR) - not axial slices
  // 3. Derived images with missing tags
  const validInstances = instances.filter(instance =>
    instance.ImagePositionPatient &&
    Array.isArray(instance.ImagePositionPatient) &&
    instance.ImagePositionPatient.length === 3 &&
    instance.ImageOrientationPatient &&
    instance.ImageOrientationPatient.length === 6
  );

  // If no valid instances found, return original unsorted
  // (better than crashing)
  if (validInstances.length === 0) {
    console.warn('No instances with valid position data found in series');
    return instances;
  }

  const { ImagePositionPatient: referenceImagePositionPatient, ImageOrientationPatient } =
    validInstances[Math.floor(validInstances.length / 2)];

  const rowCosineVec = vec3.fromValues(
    ImageOrientationPatient[0],
    ImageOrientationPatient[1],
    ImageOrientationPatient[2]
  );
  const colCosineVec = vec3.fromValues(
    ImageOrientationPatient[3],
    ImageOrientationPatient[4],
    ImageOrientationPatient[5]
  );

  const scanAxisNormal = vec3.cross(vec3.create(), rowCosineVec, colCosineVec);
  const refIppVec = vec3.set(
    vec3.create(),
    referenceImagePositionPatient[0],
    referenceImagePositionPatient[1],
    referenceImagePositionPatient[2]
  );

  const distanceInstancePairs = validInstances.map(instance => {
    const imagePositionPatient = instance.ImagePositionPatient;

    // Safety check at individual instance level too
    if (!imagePositionPatient || imagePositionPatient.length !== 3) {
      return { distance: 0, instance };
    }

    const positionVector = vec3.create();
    const instIppVec = vec3.set(
      vec3.create(),
      imagePositionPatient[0],
      imagePositionPatient[1],
      imagePositionPatient[2]
    );

    vec3.sub(positionVector, refIppVec, instIppVec);
    const distance = vec3.dot(positionVector, scanAxisNormal);

    return {
      distance,
      instance,
    };
  });

  distanceInstancePairs.sort((a, b) => b.distance - a.distance);
  const sortedInstances = distanceInstancePairs.map(a => a.instance);

  return sortedInstances;
}
