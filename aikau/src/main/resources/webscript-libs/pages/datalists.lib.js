/* global remote */

function getDataListServices() {
   return [
      {
         id: "CRUD_SERVICE",
         name: "alfresco/services/CrudService"
      },
      {
         id: "DATALIST_SERVICE",
         name: "alfresco/services/DataListService"
      },
      {
         id: "DIALOG_SERVICE",
         name: "alfresco/services/DialogService"
      },
      {
         id: "DOCUMENT_SERVICE",
         name: "alfresco/services/DocumentService"
      },
      {
         id: "FORMS_RUNTIME_SERVICE",
         name: "alfresco/services/FormsRuntimeService"
      },
      {
         id: "NODE_PREVIEW_SERVICE",
         name: "alfresco/services/NodePreviewService"
      },
      {
         id: "NOTIFICATION_SERVICE",
         name: "alfresco/services/NotificationService"
      },
      {
         id: "SEARCH_SERVICE",
         name: "alfresco/services/SearchService"
      },
      {
         id: "SITE_SERVICE",
         name: "alfresco/services/SiteService"
      },
      {
         id: "USER_SERVICE",
         name: "alfresco/services/UserService"
      }
   ];
}

function getDataListsList() {
   return {
      name: "alfresco/lists/AlfList",
      align: "sidebar",
      config: {
         pubSubScope: "LIST_OF_LISTS_",
         loadDataPublishTopic: "ALF_CRUD_GET_ALL",
         loadDataPublishPayload: {
            url: "slingshot/datalists/lists/site/swsdp/dataLists" // TODO: Hard-coded to site
         },
         itemsProperty: "datalists",
         widgets: [
            {
               name: "alfresco/lists/views/AlfListView",
               config: {
                  widgets: [
                     {
                        name: "alfresco/lists/views/layouts/Row",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/lists/views/layouts/Cell",
                                 config: {
                                    widgets: [
                                       {
                                          name: "alfresco/renderers/PropertyLink",
                                          config: {
                                             propertyToRender: "title",
                                             useCurrentItemAsPayload: false,
                                             publishTopic: "ALF_GET_DATA_LIST_WIDGETS",
                                             publishPayloadType: "PROCESS",
                                             publishPayloadModifiers: ["processCurrentItemTokens"],
                                             publishPayload: {
                                                nodeRef: "{nodeRef}",
                                                itemType: "{itemType}",
                                                alfResponseTopic: "SHOW_DATA_LIST"
                                             },
                                             publishGlobal: true
                                          }
                                       }
                                    ]
                                 }
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      }
   };
}

function getDataListDisplay() {
   return {
      name: "alfresco/layout/DynamicWidgets",
      config: {
         subscriptionTopic: "SHOW_DATA_LIST",
         subscribeGlobal: true
      }
   };
}

function getContainer() {
   var container = null;
   var result = remote.call("/slingshot/datalists/lists/site/swsdp/dataLists");
   if (result.status == 200) // jshint ignore:line
   {
      var response = JSON.parse(result);
      container = response.container;
   }
   return container;
}

function getListTypes() {
   var types = [];
   var result = remote.call("/api/classes/dl_dataListItem/subclasses");
   
   if (result.status == 200) // jshint ignore:line
   {
      var classes = JSON.parse(result);
      var subclass;
      
      for (var i = 0, ii = classes.length; i < ii; i++)
      {
         subclass = classes[i];
         if (subclass.name === "dl:dataListItem")
         {
            // Ignore abstract parent type
            continue;
         }

         types.push(
         {
            value: subclass.name,
            label: subclass.title
         });
      }
   }

   return types;
}


function getNewDataListButton() {
   return {
      name: "alfresco/buttons/AlfButton",
      align: "sidebar",
      config: {
         style: {
            marginTop: "10px"
         },
         additionalCssClasses: "call-to-action",
         label: "New List",
         publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
         publishPayload: {
            dialogId: "NEW_DATA_LIST_DIALOG",
            dialogTitle: "New List",
            formSubmissionTopic: "ALF_CRUD_CREATE",
            formSubmissionGlobal: false,
            formSubmissionPayloadMixin: {
               responseScope: "LIST_OF_LISTS_",
               alf_destination: getContainer(),
               url: "api/type/dl%3AdataList/formprocessor"
            },
            widgets: [
               {
                  name: "alfresco/forms/controls/Select",
                  config: {
                     name: "prop_dl_dataListItemType",
                     label: "Select the type of list you want to create",
                     optionsConfig: {
                        fixed: getListTypes()
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     name: "prop_cm_title",
                     label: "Title"
                  }
               },
               {
                  name: "alfresco/forms/controls/TextArea",
                  config: {
                     name: "prop_cm_description",
                     label: "Description"
                  }
               }
            ]
         },
         publishGlobal: true
      }
   }
}


function getDataListWidgets() {
   return {
      name: "alfresco/layout/AlfSideBarContainer",
      config: {
         widgets: [
            getNewDataListButton(),
            getDataListsList(),
            getDataListDisplay()
         ]
      }
   };
}