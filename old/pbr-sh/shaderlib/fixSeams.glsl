vec3 fixSeams(vec3 vec, float mipmapIndex) {
  float scale = 1.0 - exp2(mipmapIndex) / cubemapSize;
  float M = max(max(abs(vec.x), abs(vec.y)), abs(vec.z));
  if (abs(vec.x) != M) vec.x *= scale;
  if (abs(vec.y) != M) vec.y *= scale;
  if (abs(vec.z) != M) vec.z *= scale;
  return vec;
}