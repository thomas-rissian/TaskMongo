
/**
 * Middleware générique pour valider les données avec Zod
 * Supporte : body, query, params
 */
const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const data = req[source];
      const validatedData = schema.parse(data);
      req.validatedData = validatedData;
      
      next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          error: 'Validation échouée',
          details: formattedErrors
        });
      }
      res.status(400).json({
        error: 'Erreur de validation',
        details: error.message
      });
    }
  };
};

module.exports = {
  // Alias pour clarté
  validate,
  validateBody: (schema) => validate(schema, 'body'),
  validateQuery: (schema) => validate(schema, 'query'),
  validateParams: (schema) => validate(schema, 'params')
};
