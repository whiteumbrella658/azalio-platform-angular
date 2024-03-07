export const apiUrl = {
    admin: {
      get: {
        companies: 'super_admin/getAllCompanies',
        info: 'super_admin/getInfo',
        downloadCompanyUsers: 'super_admin/downloadCompanyUsers',
        companyAllUsers: 'super_admin/getCompanyAllUsers',
      },
      post: {
        importTasks: 'super_admin/importTasks'
      },
      patch: {
        updateSetting: 'super_admin/updateSetting',
        resetPassword: 'super_admin/resetPassword',
        updateBoring2Fun: 'super_admin/updateBoring2Fun',
        updateDashboardFlag: 'super_admin/updateDashboardFlag',
        updateAISurveyFlag: 'super_admin/updateAISurveyFlag',
        updateSMSFlag: 'super_admin/updateSMSCheckboxFlag',
        updateAskQFlag: 'super_admin/updateAskQFlag',
      }
    },
    home: {
      login: 'auth/login',
      companyAdminSignUp: 'auth/register',
      validateAdmin: 'auth/validateAdmin',
      validateToken: 'auth/validateToken',
      registerCompanyUser: 'auth/ValidateUser',
      forgotPassword: 'auth/forgot',
      updatePassword: 'auth/updatePasswordByForgotToken',
    },
    general: {
      get: {
        configurations: 'auth/getConfigurations',
        storeConfig: 'auth/getStoreConfig',
        getHighlights:'getHighlights'
      }
    },
    timesheet: {
        get: {
            timesheetSummary: 'timesheet/getTimesheetSummary',
            timesheetDetails: 'timesheet/getTimesheetDetailByUser',
            exportSummaryReport: 'timesheet/exportTimesheetSummary',
            exportDetailedReport: 'timesheet/exportTimesheetDetailedReport',
            timesheetGroups: 'timesheet/getTimesheetGroups'

          },
          post: {
             addTimesheetEntry: 'timesheet/addTimesheet',
             updateTimesheetEntry: 'timesheet/updateTimesheet',
             deleteTimesheetEntry: 'timesheet/deleteTimesheet'
          },
          patch: {
          }
    },
    integrations: {
      get: {
        linkToken: 'integrations/getLinkToken',
      },
      post: {
        saveLinkToken: 'integrations/saveLinkToken',
      }
    },
    survey: {
      post: {
        survey: 'surveys/addSurvey'
      },
      get: {
        surveys: 'surveys/getSurveys',
        downloadSurveyReport: 'surveys/downloadSurvey'
      },
    },
    aiSurvey: {
      get: {
        surveyQuestions: 'ai-survey/getSurveyQuestions',
        surveyResponses: 'ai-survey/getSurveyResponses',
        scheduledSurveysHistory: 'ai-survey/getScheduledSurveysHistory'
    },
     post: {
      getAIGeneratedQuestion: 'ai-survey/getAIGeneratedQuestion',
      createSurvey: 'ai-survey/addAISurveys',
      resendSMS: 'ai-survey/resendTextMessageAISurvey',
      cancelScheduledSurvey: 'ai-survey/cancelScheduledSurvey',
      getAITranslation: 'ai-survey/getAITranslation'
     }
    },
    askQ: {
      get: {
        askQuestion: 'askq/askQuestion',
        getQuestionHistory: 'askq/getQuestionHistory',
        getHomePageData: 'askq/getHomePageData',
        getHomePageGraphs: 'askq/getHomePageGraphs',
        getSavedGraphs: 'askq/getSavedGraphs',
        getSurveyQuestions: 'ai-survey/getAllSurveyQuestions',
        getConversations: 'askq/getConversations',
        getFunFacts: 'askq/getFunFacts'
      },
      post: {
        saveGraph: 'askq/saveGraph',
        unsaveGraph: 'askq/unsaveGraph',
      },
      patch: {
        updateTrigger: 'ai-survey/updateTrigger'
      }
    },
    tasks: {
      get: {
        tasks: 'tasks/getTasks',
        taskTags: 'tasks/getTags',
        taskHistory: 'tasks/getTaskHistory',
        filters: 'tasks/getFilters',
        logs: 'tasks/getPointsLog',
        dailyReport: 'tasks/getDailyTaskReport',
        downloadTaskReport: 'tasks/downloadTaskReport'
      },
      post: {
        addTask: 'tasks/addTask',
        addTaskComment: 'tasks/addTaskComment',
        addUpdateTags: 'tasks/addUpdateTaskTags',
        assignTaskToUser: 'tasks/assignTaskToUser'
     },
     patch: {
      revokePoints: 'tasks/revokePoints',
      editTask: 'tasks/editTask',
      updateTaskPriority: 'tasks/updateTaskPriority',
     },
     delete: {
      deleteTask: 'tasks/deleteTask'
     }
    },
    organisation: {
      get: {
        DefaultTimezone: 'organisation/getDefaultTimezone',
        Users: 'organisation/getUsers',
        Regions: 'organisation/getHierarchy',
        UsersByRegionTeamIds:'organisation/getUsersByRegionTeamIds',
        StoresByUserId:'organisation/getStoresByUserId',
        StoresOfCompany:'organisation/getStoresOfCompany',
        getUsersExist: 'organisation/getUsersExist',
        },
        post: {
          Region: 'organisation/addRegion',
          updateRegion: 'organisation/updateRegion',
          deleteRegion: 'organisation/deleteRegion',
        },
        patch: {
        }
    },
    user: {
      get: {
        getAllRoles: 'user/getAllRoles',
        profileInfo: 'user/getInfo',
        getCompanyUserTags: 'user/getUserTagsList',
        getUserTags: 'user/getUserTags'
      },
      post: {
        addUsers: 'user/addUser',
        editUser: 'user/updateUser',
        editAccountOwner: 'user/updateAccountOwner',
        deleteUser: 'user/deleteUser',
        importUsers: 'user/importUsers',
        resendInvite: 'user/resendInvite',
        updatePreference: 'user/updatePreference',
        updateUserTags: 'user/updateUserTags',
      },
      put: {

      }
    },
    schedule: {
      get: {
        schedules: 'schedule/getSchedules',
        leaves: 'schedule/getLeaves',
        leaveTypes: 'schedule/getLeaveTypes',
        leaveRequests: 'schedule/getLeaveRequests',
        notification: 'schedule/getTimeOffNotifications',
        openSwapHistory: 'schedule/getOpenSwapShiftHistory',
      },
      post: {
        addSchedule: 'schedule/addSchedule',
        splitSchedule: 'schedule/splitSchedule',
        addLeave: 'schedule/addLeave',
        acceptLeave: 'schedule/acceptLeave',
        respondToSwap: 'schedule/respondToSwapShift',
        respondToOpen: 'schedule/respondToOpenShift',
        publishSchedule: 'schedule/publishSchedules',
        updateSchedule: 'schedule/updateSchedule',
        deleteSchedule: 'schedule/deleteSchedule',
        updateLeave: 'schedule/updateLeave',
        deleteLeave: 'schedule/deleteLeave',
        copySchedules: 'schedule/copySchedules'
      }
    },
    recognition: {
      get: {
        userPoints: 'awards/getUsersWithAwards',
        goals: 'awards/getAllBadges',
        giftCardRequests: 'awards/getGiftCardRequests',
        notification: 'awards/getRewardNotifications',
        downloadPointsReport: 'awards/getUsersWithAwardsDownload'
      },
      post: {
        recognize: 'awards/awardBadgeToUser',
        resetPoints: 'awards/resetPoints',
        respondToGiftRequest: 'awards/respondToGiftRequest',
        markAsDelivered: 'awards/markAsDelivered',
        addAnnouncement: 'awards/addAnnouncement'
      }
    },
    automation: {
      get: {
        automation: 'automation/getAutomationData'
      },
      post: {
        addAutomation: 'automation/addAutomation'
      },
      patch: {
        updateAutomationStatus: 'automation/updateAutomationState'
      }
    },
    configiration_settings:{
      get:{
        getRolesAndPermissions:'settings/getRolesAndPermissions',
        getRules:'settings/getRules',
        getCustomizedLabels:'settings/getCustomizedLabels',
        getRequiredFeatures:'settings/getRequiredFeatures',
        getAllStores:'settings/getStoresOfCompany',
        getAdvancedFeatures: 'settings/getAdvancedFeatures'
      },
      post:{
        updateRolesAndPermissions:'settings/updateRolesAndPermissions',
        updateRules:'settings/updateRules',
        updateCustomizedLabels:'settings/updateCustomizedLabels',
        updateRequiredFeatures:'settings/updateRequiredFeatures',
        addStore:'settings/addStore',
        updateStore:'settings/updateStore',
        deleteStore: 'settings/deleteStore',
        addShift:'settings/addShift',
        updateShifts:'settings/updateShifts',
        updateAdvancedFeatures: 'settings/updateAdvancedFeatures'
      },
    },
    external:{
      put:{
        sharedscheduler:'store_app/updateToken',
        mobileScheduler:'mobile/updateToken'
      },
      get:{
        schedules: 'store_app/getSchedules',
        mobileSchedules: 'mobile/getSchedules'
      }   
    }
}
