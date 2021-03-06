model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true
            }
         }
      },
      {
         name: "alfresco/services/UserService"
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         id: "HEADER_USER_SET_HOME_PAGE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set Home Page",
            publishTopic: "ALF_SET_USER_HOME_PAGE",
            publishPayload: {
               homePage: "NewHomePage"
            }
         }
      },
      {
         name: "aikauTesting/mockservices/PreferenceServiceMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};