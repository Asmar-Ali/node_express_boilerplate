const ModuleAlias = require('module-alias');

ModuleAlias.addAliases({
  '@controllers': `${__dirname}/controllers`,
  '@config': `${__dirname}/config`,
  '@database': `${__dirname}/database`,
  '@jobs': `${__dirname}/jobs`,
  '@middlewares': `${__dirname}/middlewares`,
  '@routes': `${__dirname}/routes`,
  '@utils': `${__dirname}/utils`,
  '@views': `${__dirname}/views`,
});
