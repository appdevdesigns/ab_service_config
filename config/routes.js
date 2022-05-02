/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
   /***************************************************************************
    *                                                                          *
    * SiteController                                                           *
    *                                                                          *
    * These routes are responsible for loading an initial HTML container to    *
    * load the AppBuilder.                                                     *
    *                                                                          *
    ***************************************************************************/
   "/": "SiteController.index",
   // returns the default loader for the site.  It will determine the tenant
   // and user from the url & user sessions if already set
   // @return {HTML} for the framework to load.

   "get /admin": {
      // returns the loader for the Tenant Administration site.
      // The TenantID will be gathered as the default specified in the
      // config.local.js
      // @return {HTML} for the framework to load.
      controller: "SiteController",
      action: "index",
      useTenantID: true,
   },

   // Static Resources for our Web Clients
   "/favicon.ico": "SiteController.favicon",
   "get /sails.io.js": "SiteController.sailsio",

   "get /config": "SiteController.config",
   // request the configuration information for the current user

   "get /auth/password/reset": "auth/reset-password-verify",
   "post /auth/password/reset": "auth/reset-password-update",
   "post /auth/login/reset": "auth/reset-password-request",
   // password reset request

   "post /auth/login": "auth/login",
   // process the password login

   "post /auth/logout": "auth/logout",
   // process the password logout

   // Plugin Loading
   "get /plugin/:tenant/:key": {
      controller: "SiteController",
      action: "pluginLoad",
      skipAssets: false,
   }, // "SiteController.pluginLoad",

   // file_processor routes:
   "post /file/upload/:objID/:fieldID/:isWebix": "file_processor/file-upload",
   "get  /file/:ID": "file_processor/file-get",

   /***************************************************************************
    *                                                                          *
    * More custom routes here...                                               *
    * (See https://sailsjs.com/config/routes for examples.)                    *
    *                                                                          *
    * If a request to a URL doesn't match any of the routes in this file, it   *
    * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
    * not match any of those, it is matched against static assets.             *
    *                                                                          *
    ***************************************************************************/
   // tenant_manager routes:
   "post /tenant/add": "tenant_manager/tenant-add",
   // "/tenant_manager/find": "tenant_manager/find",

   // appbuilder routes:
   "get /appbuilder/csv-export/:viewID": "appbuilder/csv-export",
   // Find
   "get /app_builder/model/:objID": "appbuilder/model-get",
   "get /app_builder/model/:objID/count": "appbuilder/model-get-count",
   // Create
   "post /app_builder/model/:objID": "appbuilder/model-post",
   "post /app_builder/batch/model/:objID": "appbuilder/model-post-batch",
   // Update
   "put /app_builder/model/:objID/:ID": "appbuilder/model-update",
   "put /app_builder/batch/model/:objID": "appbuilder/model-update-batch",
   // Delete
   "delete /app_builder/model/:objID/:ID": "appbuilder/model-delete",

   // multilingual routes
   "/multilingual/label-missing": "appbuilder/label-missing",

   // log_manager routes:
   "get /app_builder/object/:objID/track": "log_manager/rowlog-find",

   // definition_manager routes:
   "delete /definition/migrate/object/:objID/index/:ID":
      "definition_manager/migrate-index-delete",
   "post /definition/migrate/object/:objID/index/:ID":
      "definition_manager/migrate-index-create",
   "post /definition/migrate/object/:objID/field/:ID":
      "definition_manager/migrate-field-create",
   "put /definition/migrate/object/:objID/field/:ID":
      "definition_manager/migrate-field-update",
   "delete /definition/migrate/object/:objID/field/:ID":
      "definition_manager/migrate-field-down",
   "delete /definition/migrate/object/:ID":
      "definition_manager/migrate-object-down",
   "post /definition/migrate/object/:ID":
      "definition_manager/migrate-object-create",
   "get /definition/allapplications":
      "definition_manager/definition-allapplications",
   "post /definition/register": "definition_manager/register-updates",
   "delete /definition/:ID": "definition_manager/definition-delete",
   "put /definition/:ID": "definition_manager/definition-update",
   "post /definition/create": "definition_manager/definition-create",
   "get /definition/export/all": "definition_manager/export-all",
   "get /definition/export/:ID": "definition_manager/export-app",
   "/definition/import": "definition_manager/json-import",
   "post /test/import": "definition_manager/test-import",
   "post /test/reset": "definition_manager/test-reset",

   // process_manager routes:
   "post /process/inbox/register": "process_manager/inbox-register",
   "put /process/inbox/:ID": "process_manager/inbox-update",

   // "/sg": "SiteController.sg", // testing out the SG library
   // commcenter routes:
   "put /commcenter/socket/:key": "commcenter/socket-send",
   "post /commcenter/socket/:key": "commcenter/socket-join",
   "post /commcenter/room/:key": "commcenter/room-join",
   "put /commcenter/room/:key": "commcenter/room-send",
};
