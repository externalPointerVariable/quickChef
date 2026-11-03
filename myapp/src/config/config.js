function cleanEnvVar(value) {
  if (!value) return "https://www.themealdb.com/api/json/v1/1";
  return value.trim().replace(/^['"]|['"]$/g, "") || "https://www.themealdb.com/api/json/v1/1";
}

const config = {
  mealDbEndpoint: cleanEnvVar(import.meta.env.VITE_MEALDB_URL || ""),
};

export default config;
