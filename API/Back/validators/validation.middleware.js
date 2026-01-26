
/**
 * Middleware générique pour valider les données avec Zod
 * Supporte : body, query, params
 */
const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      // Récupère les données selon la source
      const data = req[source];
      
      // Valide avec le schéma Zod
      const validatedData = schema.parse(data);
      
      // Stocke les données validées
      req.validatedData = validatedData;
      
      next();
    } catch (error) {
      // Formatte les erreurs de validation Zod
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

      // Erreur générique
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
