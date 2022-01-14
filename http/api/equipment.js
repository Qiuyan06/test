const install = (vm) => {
    return {
        owerEquipMock(params = {}){
            return vm.$u.get('/iot-ysa-equipment/equipment/devEquipFontEndInfo/myEquip', params)
        },
        equipInfomationMock(params = {}){
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/myEquipInformation', params)
        },
        getEquipStatus(params = {}){//我的仪器状态数据
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/myOwerEquipStatusLst', params)
        },
        myOwerEquip(params = {}) { // 我的仪器
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/myOwerEquip', params)
        },
        owerEquip(params = {}) { // 我的仪器
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/owerEquip', params)
        },
        owerEquipCount(params = {}) { // 仪器统计
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/owerEquipCount', params)
        },
        catetoryPageList(params = {}) { // 仪器分类
            return vm.$u.post('/iot-ysa-datacenter/devCate/queryInstruCategory', params)
        },
        brandPageList(params = {}) { // 仪器品牌
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/brandPageList', params)
        },
        modelPageList(params = {}) { // 仪器型号
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/modelPageList', params)
        },
        devCateSelect(params = {}) { // 教育部分类
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/devCateSelect', params)
        },
        userCreatedLab(params = {}) { // 实验室
            return vm.$u.post('/iot-ysa-laboratory/laboratory/labFontEnd/userCreatedLab', params)
        },
        labRoomList(params = {}) { // 根据实验室id查询用户拥有房间List
            return vm.$u.post('/iot-ysa-room/room/roomFontEnd/labRoomList', params)
        },
        save(params = {}) { // 保存房间
            return vm.$u.post('/iot-ysa-room/room/roomFontEnd/save', params)
        },
        addEquip(params = {}) { // 保存设备
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/addEquip', params)
        },
        addEquipWND(params = {}) { // 保存无类型设备
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/addMyEquip', params)
        },
        equipInformation(params = {}) { // (共用)设备详情-设备信息(仪器猫/云盒子/仪器猫伴侣)
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/equipInformation', params)
        },
        equipRecord(params = {}) { // (共用)设备详情-设备信息-报警记录/维修记录/维护记录/计量记录/保养记录(与雷达图共用一个接口)
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/equipRecord', params)
        },
        queryRoomByInstruId(params = {}) { // 设备详情-设备信息(仪器猫/云盒子/仪器猫伴侣)房间信息
            return vm.$u.post('/iot-ysa-room/room/roomFontEnd/queryRoomByInstruId', params)
        },
				getLifeCycle (params = {}) {  // 仪器详情--》生命周期管理
					  return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/getInstruPeriod', params)
				},
        getInitialState(params = {}) { // 云盒子详情接口-获取指令控制初始状态
            return vm.$u.post('/iot-ysa-box/boxDetails/getInitialState', params)
        },
        operation(params = {}) { // 云盒子开关机
            return vm.$u.post('/iot-ysa-box/boxDetails/operation', params)
        },
        getInitialState_cat(params = {}) { // 仪器猫详情接口-获取指令控制初始状态
            return vm.$u.post('/iot-ysa-cat/cat/isOnline', params)
        },
        operation_cat(params = {}) { // 仪器猫开关机
            return vm.$u.post('/iot-ysa-cat/icInstruCmdlog/operation', params)
        },
        queryOperationLogList(params = {}) { // 日志-操作记录查询
            return vm.$u.post('/iot-ysa-equipment/operationLog/queryOperationLogList', params)
        },
        getCmdlogList(params = {}) { // APP-状态记录查询
            return vm.$u.post('/iot-ysa-cat/icInstruCmdlog/getCmdlogList', params)
        },
        equipShareInfo(params = {}) { // 设备列表_查询设备的共享人和共享人数
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/equipShareInfo', params)
        },
        queryEquipIphon(params = {}) { // 查询硬件设备号
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/queryEquipIphon', params)
        },
        queryMyEquipIphon(params = {}) { // 查询硬件设备号(编辑仪器调用)
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/queryMyEquipIphon', params)
        },
        equipOneShareInfo(params = {}) { // 设备列表_单个设备的共享人和共享人数
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/equipOneShareInfo', params)
        },
        getEquipCmdlogList(params = {}) { // APP-设备状态记录查询
            return vm.$u.post('/iot-ysa-cat/icInstruCmdlog/getEquipCmdlogList', params)
        },
        getBoxEquipCmdlogList(params = {}) { // APP-云盒子设备状态记录查询
            return vm.$u.post('/iot-ysa-box/boxEquipRecord/queryBoxEquipRecordList', params)
        },
        catlogList(params = {}) { // 报警记录（个人中心调用不用传参数）
            return vm.$u.post('/iot-ysa-cat/cat/catlogList', params)
        },
        catlogLists(params = {}) { // 报警记录
            return vm.$u.post('/iot-ysa-cat/cat/catlogLists', params)
        },
        delEquipShareInfo(params = {}) { // 批量删除设备的共享人
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/delEquipShareInfo', params)
        },
        loadEquip(params = {}) { // 回显编辑数据
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/loadEquip', params)
        },
        editEquip(params = {}) { // 编辑仪器
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/editEquip', params)
        },
        editMyEquip(params = {}) { // 编辑仪器（新）
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/editMyEquip', params)
        },
        queryInstruServicelogList(params = {}) { // 维护、保养日志-列表查询
            return vm.$u.post('/iot-ysa-equipment/equipment/icInstruServicelog/queryInstruServicelogList', params)
        },
        // 增加维护、保养记录
        savaServicelog(params = {}) {
            return vm.$u.post('/iot-ysa-equipment/equipment/icInstruServicelog/saveInstruServicelog', params)
        },
        // 增加计量记录
        saveIcInstruMeasure(params = {}) {
            return vm.$u.post('/iot-ysa-equipment/equipment/icInstruMeasure/saveIcInstruMeasure', params)
        },
        queryIcInstruMeasureList(params = {}) { // 计量-列表查询
            return vm.$u.post('/iot-ysa-equipment/equipment/icInstruMeasure/queryIcInstruMeasureList', params)
        },
        queryCatLogDetails(params = {}) { // 报警记录详情查询
            return vm.$u.post('/iot-ysa-cat/cat/queryCatLogDetails', params)
        },
        updateCatLogStatus(params = {}) { // 处理报警记录
            return vm.$u.post('/iot-ysa-cat/cat/updateCatLogStatus', params)
        },
        getRealTimeToRedis(params = {}) { // 仪器猫实时电流电压统计
            return vm.$u.post('/iot-ysa-cat/icInstruCountday/getRealTimeToRedis', params)
        },
        catCountdayData(params = {}) { // 仪器猫运行时长次数统计
            return vm.$u.post('/iot-ysa-cat/icInstruCountday/catCountdayData', params)
        },
        equipAverage(params = {}) { // 仪器猫仪器平均值
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/equipAverage', params)
        },
        getUseKWH(params = {}) { // 仪器猫能耗图
            return vm.$u.post('/iot-ysa-cat/cat/getUseKWH', params)
        },
        getBoxEverydayData(params = {}) { // 云盒子运行时长次数统计
            return vm.$u.post('/iot-ysa-box/boxInfoCountday/getBoxEverydayData', params)
        },
        queryRealTime(params = {}) { // 仪器猫实时电流电压统计(第一次请求)
            return vm.$u.post('/iot-ysa-cat/icInstruCountday/queryRealTime', params)
        },
        selectIcInstruCountById(params = {}) { // 设备详情-设备信息-仪器猫(安全阈值)(报警设置回显共用这个接口)
            return vm.$u.post('/iot-ysa-cat/icInstruCount/selectIcInstruCountById', params)
        },
        equipShareCode(params = {}) { // 生成分享二维码
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/equipShareCode', params)
        },
        equipShareCodeBand(params = {}) { // 设备列表_二维码扫码分享绑定
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/equipShareCodeBand', params)
        },
        // 仪器猫报警设置
        addAlarmSettings(params = {}) {
            return vm.$u.post('/iot-ysa-cat/cat/addAlarmSettings', params)
        },
        owerEquipForShar(params = {}) { // 查找我的仪器（分享用）
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/owerEquipForShar', params)
        },
        getPhone(params = {}) { // 获取用户的有效手机号
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/checkoutPhone', params)
        },
        validPhoneCode(params = {}) { // 校验手机验证码
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/checkoutPhoneCode', params)
        },
        validRandomCode(params = {}) { // 校验随机码
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/checkoutRandomCode', params)
        },
        getDeviceByInstruNum(params = {}) { // 根据设备编号查询回显的设备信息
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/queryDeviceEcho', params)
        },
        getUnbindDeviceList(params = {}) { // 选择未绑定的设备列表
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/queryUnBandingEquipList', params)
        },
        getUnbindDeviceInfo(params = {}) { // 获取选择的未绑定的设备信息
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/queryUnBandingEquipsList', params)
        },
        setMaint(params = {}) { // 计量设置,保养设置,维护设置
            return vm.$u.post('/iot-ysa-equipment/equipment/icInstruServicelogSet/save', params)
        },
        showMaintSet(params = {}) { // 计量设置,保养设置,维护设置回显
            return vm.$u.post('/iot-ysa-equipment/equipment/icInstruServicelogSet/getByIdOrType', params)
        },
        // 获取计量信息
        getMeasure(params = {}) {
            return vm.$u.post('/iot-ysa-equipment/equipment/icInstruMeasure/getMeasureById', params)
        },
        // 编辑计量信息
        updateMeasure(params = {}) {
            return vm.$u.post('/iot-ysa-equipment/equipment/icInstruMeasure/updateIcInstruMeasure', params)
        },
        deleteMeasure(params = {}) { // 删除计量
            return vm.$u.post('/iot-ysa-equipment/equipment/icInstruMeasure/deleteIcInstruMeasure', params)
        },
        //	根据id查询保养、维护记录、
        getServiceLog(params = {}) {
            return vm.$u.post('/iot-ysa-equipment/equipment/icInstruServicelog/getServiceLog', params)
        },
        // 根据id更新保养、维护记录
        updateInstruServicelog(params = {}) {
            return vm.$u.post('/iot-ysa-equipment/equipment/icInstruServicelog/updateInstruServicelog', params)
        },
        //    根据id删除保养、维护记录
        deleteInstruServicelog(params = {}) {
            return vm.$u.post('/iot-ysa-equipment/equipment/icInstruServicelog/deleteInstruServicelog', params)
        },
        getEquipCmdlogTotal(params = {}) { // 设备状态记录合计查询
            return vm.$u.post('/iot-ysa-cat/icInstruCmdlog/getEquipCmdlogTotal', params)
        },
        getBoxEquipCmdlogTotal(params = {}) { // 云盒子设备状态记录合计查询
            return vm.$u.post('/iot-ysa-box/boxEquipRecord/queryBoxStatusCount', params)
        },
        getIntellerBoxNowStatusInfo(params = {}) { // 奥普乐实时监控数据
            return vm.$u.post('/iot-ysa-box/intellerCloudBoxService/queryIntellerBoxNowStatusInfo', params)
        },
        //根据id获取设备信息
        getEquipInfoById(params = {}) { // 云盒子设备状态记录合计查询
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/getEquipInfoById', params)
        },
        queryType(params = {}) { // 判断云盒子绑定奥普乐、能谱
            return vm.$u.post('/iot-ysa-box/intellerCloudBoxService/queryIntellerBoxBelongToFactory', params)
        },
        subInstruFeedback(params = {}) { // 仪器详情 --》提交反馈问题
                return vm.$u.post('/iot-ysa-equipment/equipment/instruFeedback/saveOrUpdateInstruFeedback', params)
        },
        instruFeedbackList(params = {}) { // 仪器详情 --》反馈问题记录列表
                return vm.$u.post('/iot-ysa-equipment/equipment/instruFeedback/queryInstruFeedbackList', params)
        },
        getFeedbackTypes(params = {}) { // 仪器详情 --》问题反馈，获取可用的反馈类型
                return vm.$u.post('/iot-ysa-base/iot_app/sysDictData/selectDictDataList', params)
        },
        getTemplateEti(params = {}) { // 查询所有云盒子配置模块加载接口地址信息
            return vm.$u.post('/iot-ysa-box/intellerCloudBoxService/queryTemplateEti', params)
        },
        getSmartCloudBoxTemplateInfo(params={}){//获取仪器对应云盒子配置模板信息
            return vm.$u.post('/iot-ysa-base/communalSetting/communalPageTemplateDetail/getSmartCloudBoxTemplateInfoByEquipId', params)
        },
        handleDealWarnBySet(params={}){//处理云盒子配置的报警数据
            return vm.$u.post('/iot-ysa-base/iotInstrumentRecordHandle/handleInstrumentRecord',params)
        }
    }
}

export default {
    install
}
