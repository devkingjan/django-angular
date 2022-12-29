import {Injectable} from '@angular/core';
import * as _ from 'lodash';

import {RequestService} from './request.service';
import {AuthData} from '../../app/models/auth-data';

@Injectable()
export class ApiService {
    authToken = {
        post: (auth: AuthData) => this.request
            .post()
            .url('auth/users/login')
            .payload(auth),
    };
    me = {
        get: () => this.request
            .get()
            .url('auth/me')
            .auth(),
        getUserBuId: (id) => this.request
            .get()
            .url(`auth/users/${id}`)
            .auth(),
        signUpInvitedUser: (userObj) => this.request
            .post()
            .url('auth/invited-users/create')
            .payload(userObj),
        update: (userObj) => this.request
            .put()
            .url('auth/users/update')
            .payload(userObj)
            .auth(),
        resetPwd: (pwdObj) => this.request
            .post()
            .url('auth/password')
            .payload(pwdObj)
            .auth(),
        sendMailForResetPwd: (pwdObj) => this.request
            .post()
            .url('auth/password/reset/')
            .payload(pwdObj),
        forgotPwd: (pwdObj) => this.request
            .post()
            .url('auth/password/reset/confirm/')
            .payload(pwdObj),
        resetPin: (pinObj) => this.request
            .post()
            .url('auth/pin')
            .payload(pinObj)
            .auth(),
        sendMailForResetPin: (pwdObj) => this.request
            .post()
            .url('auth/pin/reset/')
            .payload(pwdObj),
        forgotPin: (pwdObj) => this.request
            .post()
            .url('auth/pin/reset/confirm/')
            .payload(pwdObj),
        logout: () => this.request
            .post()
            .url('auth/password')
            .auth(),
    };
    userUpdate = {
        get: () => this.request
            .get()
            .url('auth/me')
            .auth()
    };
    member = {
        get: () => this.request
            .get()
            .url('company/member/entity')
            .auth(),
        create: (userObj) => this.request
            .post()
            .url('company/member/entity')
            .payload(userObj)
            .auth(),
        invite: (userObj) => this.request
            .post()
            .url('company/member/invite')
            .payload(userObj)
            .auth(),
        getPermission: (id) => this.request
            .get()
            .url(`company/member/${id}/get-permission`)
            .auth(),
        updatePermission: (obj) => this.request
            .put()
            .url(`company/member/${obj.id}/update-permission`)
            .payload(obj)
            .auth(),
        updateLabAccessMember: (obj) => this.request
            .put()
            .url(`company/member/${obj.id}/update-access-member`)
            .payload(obj)
            .auth(),
    };
    experiment = {
        getDbTemplates: () => this.request
            .get()
            .url('company/experiment/get-templates')
            .auth(),
        createTemplate: (dbObj) => this.request
            .post()
            .url('company/experiment/create-template')
            .payload(dbObj)
            .auth(),
        editTemplate: (dbObj) => this.request
            .put()
            .url('company/experiment/edit-template')
            .payload(dbObj)
            .auth(),
        getColumns: (templateId) => this.request
            .get()
            .url(`company/experiment/${templateId}/get-columns`)
            .auth(),
        getDropdownOption: (columnId) => this.request
            .get()
            .url(`company/experiment/column/${columnId}/get-dropdown-option`)
            .auth(),
        createDropdownOption: (columnId, obj) => this.request
            .post()
            .url(`company/experiment/column/${columnId}/create-option`)
            .payload(obj)
            .auth(),
        getExpData: (templateId) => this.request
            .get()
            .url(`company/experiment/template/${templateId}/get`)
            .auth(),
        getRecentExpData: () => this.request
            .get()
            .url(`company/experiment/template/recent-exp`)
            .auth(),
        createExpData: (templateId, dbObj) => this.request
            .post()
            .url(`company/experiment/template/${templateId}/create`)
            .payload(dbObj)
            .auth(),
        editExpData: (expId, dbObj) => this.request
            .put()
            .url(`company/experiment/template/${expId}/update`)
            .payload(dbObj)
            .auth(),
        cancelExpData: (expId) => this.request
            .delete()
            .url(`company/experiment/template/${expId}/cancel`)
            .auth(),
        getExperiments: (userId) => this.request
            .get()
            .url('company/experiment/main/')
            .params(userId)
            .auth(),
        getExperimentDetails: (expId) => this.request
            .get()
            .url(`company/experiment/main/${expId}`)
            .auth(),
        updateExperiment: (expId, data) => this.request
            .put()
            .url(`company/experiment/main/${expId}/`)
            .file(data)
            .auth(),
        getExperimentVersion: (expId) => this.request
            .get()
            .url('company/experiment/version/')
            .params(expId)
            .auth(),
        getExperimentEntryVersion: (expVersionId) => this.request
            .get()
            .url('company/experiment/entry-version')
            .params(expVersionId)
            .auth(),
        signExperiment: (data) => this.request
            .post()
            .url('company/experiment/sign/')
            .payload(data)
            .auth(),
        assignExperiment: (expId, data) => this.request
            .put()
            .url(`company/experiment/${expId}/assign-user/`)
            .payload(data)
            .auth(),
        getExperimentEntry: () => this.request
            .get()
            .url('company/experiment/entry/')
            .auth()
    };
    inventory = {
        getDatabase: () => this.request
            .get()
            .url('company/inventory/get-databases')
            .auth(),
        createDatabase: (dbObj) => this.request
            .post()
            .url('company/inventory/create-database')
            .payload(dbObj)
            .auth(),
        editDatabase: (dbObj) => this.request
            .put()
            .url('company/inventory/edit-database')
            .payload(dbObj)
            .auth(),
        getColumns: (databaseId) => this.request
            .get()
            .url(`company/inventory/${databaseId}/get-columns`)
            .auth(),
        getSampleData: (databaseId) => this.request
            .get()
            .url(`company/inventory/database/${databaseId}/get`)
            .auth(),
        createSampleData: (databaseId, obj) => this.request
            .post()
            .url(`company/inventory/database/${databaseId}/create`)
            .payload(obj)
            .auth(),
        getDropdownOption: (columnId) => this.request
            .get()
            .url(`company/inventory/column/${columnId}/get-dropdown-option`)
            .auth(),
        createDropdownOption: (columnId, obj) => this.request
            .post()
            .url(`company/inventory/column/${columnId}/create-option`)
            .payload(obj)
            .auth(),
        editSampleData: (sampleId, sampleLocationId, dbObj) => this.request
            .put()
            .url(`company/inventory/database/${sampleId}/${sampleLocationId}/update`)
            .payload(dbObj)
            .auth(),
        cancelSampleData: (sampleId) => this.request
            .delete()
            .url(`company/inventory/sample/${sampleId}/cancel`)
            .auth(),
    };
    storageLocation = {
        getStorageTemperatures: () => this.request
            .get()
            .url('company/storage-location/get-temperatures')
            .auth(),
        createStorageTemperature: (obj) => this.request
            .post()
            .url('company/storage-location/create-temperature')
            .payload(obj)
            .auth(),
        getStorageEquipments: () => this.request
            .get()
            .url('company/storage-location/get-equipments')
            .auth(),
        createStorageEquipment: (obj) => this.request
            .post()
            .url('company/storage-location/create-equipment')
            .payload(obj)
            .auth(),
        getStorageLocationByTemperature: () => this.request
            .get()
            .url('company/storage-location/get-location-by-temperature')
            .auth(),
        getStorageLocation: () => this.request
            .get()
            .url('company/storage-location/get-location')
            .auth(),
        createStorageLocation: (obj) => this.request
            .post()
            .url('company/storage-location/create-location')
            .payload(obj)
            .auth(),
        editStorageLocation: (locationId, obj) => this.request
            .put()
            .url(`company/storage-location/${locationId}/edit-location`)
            .payload(obj)
            .auth(),
        deleteStorageLocation: (locationId) => this.request
            .delete()
            .url(`company/storage-location/${locationId}/delete-location`)
            .auth(),
        getSampleByLocation: (locationId) => this.request
            .get()
            .url(`company/storage-location/${locationId}/get-samples`)
            .auth(),
        validateLocation: (obj) => this.request
            .post()
            .url('company/storage-location/validate-location')
            .payload(obj)
            .auth(),
        getEquipmentWithBox: () => this.request
            .get()
            .url('company/storage-location/get-equipment-with-box')
            .auth(),
    };
    calendar = {
        get: () => this.request
            .get()
            .url('company/calendar/get')
            .auth(),
        create: (obj) => this.request
            .post()
            .url('company/calendar/create')
            .payload(obj)
            .auth(),
        update: (id, obj) => this.request
            .put()
            .url(`company/calendar/${id}/update`)
            .payload(obj)
            .auth(),
        delete: (id) => this.request
            .delete()
            .url(`company/calendar/${id}/delete`)
            .auth()
    };
    taskManager = {
        getTaskList: () => this.request
            .get()
            .url('company/task-manager/task-list/get')
            .auth(),
        getOverDueTaskList: (obj) => this.request
            .post()
            .url('company/task-manager/task-list/overdue')
            .payload(obj)
            .auth(),
        createTaskList: (obj) => this.request
            .post()
            .url('company/task-manager/task-list/create')
            .payload(obj)
            .auth(),
        deleteTaskList: (id) => this.request
            .delete()
            .url(`company/task-manager/task-list/${id}/delete`)
            .auth(),
        getTask: () => this.request
            .get()
            .url('company/task-manager/task/get')
            .auth(),
        getNoDueOverDueTask: (obj) => this.request
            .post()
            .url('company/task-manager/task/no-due-overdue')
            .payload(obj)
            .auth(),
        createTask: (obj) => this.request
            .post()
            .url('company/task-manager/task/create')
            .payload(obj)
            .auth(),
        editTask: (id, obj) => this.request
            .put()
            .url(`company/task-manager/task/${id}/edit`)
            .payload(obj)
            .auth(),
        deleteTask: (id) => this.request
            .delete()
            .url(`company/task-manager/task/${id}/delete`)
            .auth(),
    };
    fileManager = {
        getFileList: (userId) => this.request
            .get()
            .url(`company/file-manager/get-file?user=${userId}`)
            .auth(),
        getFolder: (userId, prefix) => this.request
            .get()
            .url(`company/file-manager/entity/user/${userId}/bucket/${prefix}/`)
            .auth(),
        uploadFile: (userId, prefix, obj) => this.request
            .post()
            .url(`company/file-manager/entity/user/${userId}/upload/${prefix}/`)
            .file(obj)
            .auth(),
        addFolder: (userId, prefix, obj) => this.request
            .post()
            .url(`company/file-manager/entity/user/${userId}/add-folder/${prefix}/`)
            .payload(obj)
            .auth(),
        deleteKey: (userId, obj) => this.request
            .post()
            .url(`company/file-manager/entity/user/${userId}/delete-key/`)
            .payload(obj)
            .auth(),
        updatePermission: (userId, obj) => this.request
            .post()
            .url(`company/file-manager/entity/user/${userId}/update-permission/`)
            .payload(obj)
            .auth(),
    };
    cellCultureLine = {
        getCellCultureLine: () => this.request
            .get()
            .url(`company/cell-culture/entity`)
            .auth(),
        createCellCultureLine: (obj) => this.request
            .post()
            .url(`company/cell-culture/entity`)
            .payload(obj)
            .auth(),
        editCellCultureLine: (obj) => this.request
            .put()
            .url(`company/cell-culture/entity`)
            .payload(obj)
            .auth(),
        getCellCultureLineOptions: () => this.request
            .get()
            .url(`company/cell-culture/options`)
            .auth(),
        createCellCultureLineOptions: (obj) => this.request
            .post()
            .url(`company/cell-culture/options`)
            .payload(obj)
            .auth(),
        getCellCultureEvent: () => this.request
            .get()
            .url(`company/cell-culture/entity`)
            .auth(),
        createCellCultureEvent: (obj) => this.request
            .post()
            .url(`company/cell-culture/event`)
            .payload(obj)
            .auth(),
        getCellCultureHistory: () => this.request
            .get()
            .url(`company/cell-culture/history`)
            .auth(),
        removeCellCultureHistory: (id, obj) => this.request
            .post()
            .url(`company/cell-culture/remove/${id}`)
            .payload(obj)
            .auth(),
    };
    project = {
        getProjects: () => this.request
            .get()
            .url(`company/project/set/entity/per-user/`)
            .auth(),
        createProject: (obj) => this.request
            .post()
            .url(`company/project/set/entity/`)
            .payload(obj)
            .auth(),
        editProject: (id, obj) => this.request
            .put()
            .url(`company/project/set/entity/${id}/`)
            .payload(obj)
            .auth(),
        deleteProject: (id) => this.request
            .delete()
            .url(`company/project/set/entity/${id}/`)
            .auth(),
        addTask: (obj) => this.request
            .post()
            .url(`company/project/set/task/`)
            .payload(obj)
            .auth(),
        editTask: (id, obj) => this.request
            .put()
            .url(`company/project/set/task/${id}/`)
            .payload(obj)
            .auth(),
        deleteTask: (id) => this.request
            .delete()
            .url(`company/project/set/task/${id}/`)
            .auth(),
        addComment: (obj) => this.request
            .post()
            .url(`company/project/set/comment/`)
            .payload(obj)
            .auth(),
        editComment: (id, obj) => this.request
            .put()
            .url(`company/project/set/comment/${id}/`)
            .payload(obj)
            .auth(),
        getProjectHistory: (projectId) => this.request
            .get()
            .url(`company/project/set/entity/${projectId}/get-history/`)
            .auth(),
    };
    
    constructor(private request: RequestService) {
    }
    
}
