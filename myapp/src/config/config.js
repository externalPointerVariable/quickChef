function cleanEnvVar(value) {
  return value.replace(/^"(.*)"$/, "$1"); // Removes extra double quotes
}

const config = {
  mealDbEndpoint: cleanEnvVar(import.meta.env.VITE_MEALDB_URL || ""),
};


export default config;