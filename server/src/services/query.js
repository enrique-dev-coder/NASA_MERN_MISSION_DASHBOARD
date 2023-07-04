// para la paginacion vamos a usar los valores de skip y limit de mongo db
// un 0 para mongo es traer todos los documentos

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 0;

function getPagination(query) {
  const limit = Math.abs(query.limit) || DEFAULT_LIMIT;
  const page = Math.abs(query.page) || DEFAULT_PAGE;
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

module.exports = {
  getPagination,
};
